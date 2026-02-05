/**
 * Utility functions for draft content migration and processing
 * Handles conversion between plain text and HTML formats
 */

/**
 * 1. Check if content is HTML vs plain text
 *
 * @param content - String to check
 * @returns true if content contains HTML tags
 */
export function isHtmlContent(content: string): boolean {
  if (!content) return false;
  const htmlTagRegex = /<\/?[a-z][\s\S]*>/i;
  return htmlTagRegex.test(content);
}

/**
 * 2. Escape HTML special characters to prevent XSS
 *
 * @param str - String to escape
 * @returns Escaped string safe for HTML
 */
function _escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 3. Convert markdown-style formatting to HTML
 */
function convertMarkdownToHtml(text: string): string {
  let result = text;

  // Bold: **text** or __text__ -> <strong>text</strong>
  result = result
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic: *text* or _text_ -> <em>text</em> (but not if it's part of **)
  result = result
    .replace(/\*([^*]+?)\*/g, '<em>$1</em>')
    .replace(/_([^_]+?)_/g, '<em>$1</em>');

  // Numbered lists: 1. text, 2. text -> <ol-li>text</ol-li> (temporary marker)
  result = result.replace(/^\s*\d+\.\s+(.+)$/gm, '<ol-li>$1</ol-li>');

  // Bullet points (including nested): - text or * text -> <ul-li>text</ul-li> (temporary marker)
  result = result.replace(/^\s*[•\-\*]\s+(.+)$/gm, '<ul-li>$1</ul-li>');

  return result;
}

/**
 * 4. MAIN FUNCTION: Migrate legacy plain text drafts to HTML format
 * Converts plain text with newlines to semantic HTML with <p> tags
 * Handles literal \n characters and markdown formatting
 * Collapses multiple sequential line breaks to max 1
 *
 * @param text - Plain text content (with \n newlines or literal \\n strings)
 * @returns HTML formatted content
 *
 * @example
 * migratePlainTextToHtml("Hello\n\nWorld")
 * // Returns: "<p>Hello</p><p>World</p>"
 */
export function migratePlainTextToHtml(text: string): string {
  if (!text) return '<p></p>';

  // If already properly formatted HTML (no literal \n or markdown), return as-is
  if (isHtmlContent(text) && !text.includes('\\n') && !text.includes('**') && !text.includes('\\*')) {
    return text;
  }

  // Handle content that's wrapped in a single <p> tag but contains literal \n
  let processedText = text;

  // Remove wrapping <p> tags if present
  if (processedText.startsWith('<p>') && processedText.endsWith('</p>')) {
    processedText = processedText.slice(3, -4);
  }

  // Replace literal \n characters (as strings) with actual newlines
  processedText = processedText
    .replace(/\\n/g, '\n')  // Convert \n to actual newline
    .replace(/\n{3,}/g, '\n\n');  // Collapse 3+ newlines to max 2

  // Unescape markdown characters (e.g., \*\* -> **)
  processedText = processedText
    .replace(/\\\*/g, '*')   // Unescape asterisks
    .replace(/\\_/g, '_')    // Unescape underscores
    .replace(/\\-/g, '-');   // Unescape hyphens

  // Convert markdown to HTML
  processedText = convertMarkdownToHtml(processedText);

  // Split by newlines and process each line
  const lines = processedText.split('\n');
  const htmlLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines - paragraph spacing is automatic
    if (!trimmed) {
      continue;
    }

    // Don't wrap list items in <p> tags (they have temporary markers)
    if (trimmed.startsWith('<ol-li>') || trimmed.startsWith('<ul-li>')) {
      htmlLines.push(trimmed);
    } else {
      // Line may contain HTML tags from markdown conversion, don't double-wrap
      // Just wrap in <p> tags without escaping (markdown already converted to HTML)
      htmlLines.push(`<p>${trimmed}</p>`);
    }
  }

  // Build nested lists: bullets nest inside numbered items
  let result = htmlLines.join('');
  const resultLines = result.split(/(?=<(?:ol-li|ul-li|p)>)/);

  const processedLines: string[] = [];
  let inOrderedList = false;
  let currentOlItems: string[] = [];
  let pendingBullets: string[] = [];

  for (const line of resultLines) {
    if (line.startsWith('<ol-li>')) {
      // If we have pending bullets, nest them in the last numbered item
      if (pendingBullets.length > 0 && currentOlItems.length > 0) {
        const lastItem = currentOlItems.pop()!;
        // Remove closing </li> from last item
        const itemContent = lastItem.replace('</li>', '');
        // Add nested bullet list inside
        const nestedList = `<ul>${pendingBullets.join('')}</ul>`;
        currentOlItems.push(`${itemContent}${nestedList}</li>`);
        pendingBullets = [];
      }

      // Start numbered list if not already in one
      if (!inOrderedList) {
        inOrderedList = true;
      }

      // Add numbered item
      const item = line.replace('<ol-li>', '<li>').replace('</ol-li>', '</li>');
      currentOlItems.push(item);

    } else if (line.startsWith('<ul-li>')) {
      // Collect bullet items to nest in previous numbered item
      const item = line.replace('<ul-li>', '<li>').replace('</ul-li>', '</li>');
      pendingBullets.push(item);

    } else {
      // Non-list item (paragraph) - flush everything

      // Nest any pending bullets in last numbered item
      if (pendingBullets.length > 0 && currentOlItems.length > 0) {
        const lastItem = currentOlItems.pop()!;
        const itemContent = lastItem.replace('</li>', '');
        const nestedList = `<ul>${pendingBullets.join('')}</ul>`;
        currentOlItems.push(`${itemContent}${nestedList}</li>`);
        pendingBullets = [];
      }

      // Flush numbered list
      if (inOrderedList && currentOlItems.length > 0) {
        processedLines.push(`<ol>${currentOlItems.join('')}</ol>`);
        currentOlItems = [];
        inOrderedList = false;
      }

      // Flush orphaned bullets (no numbered list to nest in)
      if (pendingBullets.length > 0) {
        processedLines.push(`<ul>${pendingBullets.join('')}</ul>`);
        pendingBullets = [];
      }

      processedLines.push(line);
    }
  }

  // Flush any remaining items
  if (pendingBullets.length > 0 && currentOlItems.length > 0) {
    const lastItem = currentOlItems.pop()!;
    const itemContent = lastItem.replace('</li>', '');
    const nestedList = `<ul>${pendingBullets.join('')}</ul>`;
    currentOlItems.push(`${itemContent}${nestedList}</li>`);
    pendingBullets = [];
  }

  if (currentOlItems.length > 0) {
    processedLines.push(`<ol>${currentOlItems.join('')}</ol>`);
  }

  if (pendingBullets.length > 0) {
    processedLines.push(`<ul>${pendingBullets.join('')}</ul>`);
  }

  return processedLines.join('') || '<p></p>';
}
