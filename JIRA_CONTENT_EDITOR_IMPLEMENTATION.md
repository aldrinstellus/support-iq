Complete Implementation Guide: Jira Formatting with TipTap Editor

  1. Dependencies Required

  From package.json:
  {
    "@tiptap/react": "^2.27.1",
    "@tiptap/starter-kit": "^2.27.1",
    "@tiptap/extension-underline": "^2.27.1",
    "@tiptap/extension-link": "^2.27.1"
  }

  Install:
  npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-underline @tiptap/extension-link

  ---
  2. TipTap Editor Setup

  Lines 163-186 in JiraPreviewModal.tsx:

  import { useEditor, EditorContent } from '@tiptap/react';
  import StarterKit from '@tiptap/starter-kit';
  import Underline from '@tiptap/extension-underline';
  import Link from '@tiptap/extension-link';

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    ],
    content: initialHTMLContent || '<p>Ticket Description</p>',
    editorProps: {
      attributes: {
        class: 'tiptap-editor-description',
        style: 'flex: 1; overflow: auto; padding: 0; outline: none; color: #F9FAFB; font-family: "Geist"; font-size: 14px; font-weight: 400; line-height: 20px;',
      },
    },
  });

  What StarterKit includes:
  - Bold, Italic, Strike
  - Headings (H1, H2, H3)
  - Bullet lists, Ordered lists
  - Code blocks, Blockquotes
  - Hard breaks, Horizontal rules
  - Paragraphs

  ---
  3. ProseMirror JSON to Jira ADF Conversion

  Key Function: proseMirrorToAdf() (Lines 20-113)

  This is the core conversion logic that transforms TipTap's ProseMirror JSON into Jira's Atlassian Document Format (ADF).

  Complete Conversion Function:

  /**
   * Convert ProseMirror JSON to Atlassian Document Format (ADF)
   * Preserves all formatting including underline, bold, italic, etc.
   */
  const proseMirrorToAdf = (pmJson: any): any => {
    // Map ProseMirror node types to ADF node types
    const mapNodeType = (type: string): string => {
      const mapping: Record<string, string> = {
        'doc': 'doc',
        'paragraph': 'paragraph',
        'heading': 'heading',
        'bulletList': 'bulletList',
        'orderedList': 'orderedList',
        'listItem': 'listItem',
        'text': 'text',
        'hardBreak': 'hardBreak',
        'codeBlock': 'codeBlock',
        'blockquote': 'blockquote',
        'horizontalRule': 'rule',
      };
      return mapping[type] || type;
    };

    // Map ProseMirror mark types to ADF mark types
    const mapMarkType = (type: string): string => {
      const mapping: Record<string, string> = {
        'bold': 'strong',
        'italic': 'em',
        'underline': 'underline',
        'strike': 'strike',
        'code': 'code',
        'link': 'link',
      };
      return mapping[type] || type;
    };

    // Node types that should have content arrays
    const contentNodes = new Set([
      'doc', 'paragraph', 'heading', 'bulletList', 'orderedList',
      'listItem', 'codeBlock', 'blockquote'
    ]);

    // Node types that are leaf nodes (no content)
    const leafNodes = new Set(['text', 'hardBreak', 'rule']);

    // Recursively convert nodes
    const convertNode = (node: any): any => {
      const mappedType = mapNodeType(node.type);
      const adfNode: any = {
        type: mappedType,
      };

      // Add attributes based on node type
      if (node.type === 'heading' && node.attrs?.level) {
        adfNode.attrs = { level: node.attrs.level };
      } else if (node.type === 'orderedList') {
        adfNode.attrs = { order: node.attrs?.order || 1 };
      } else if (node.attrs) {
        // Copy other attributes
        adfNode.attrs = { ...node.attrs };
      }

      // Handle content (child nodes) - only for non-leaf nodes
      if (contentNodes.has(node.type)) {
        if (node.content && Array.isArray(node.content) && node.content.length > 0) {
          adfNode.content = node.content.map(convertNode).filter((n: any) => n !== null);
        } else {
          // Empty content array for block nodes
          adfNode.content = [];
        }
      }

      // Convert marks (formatting) - only for text nodes
      if (node.marks && Array.isArray(node.marks) && node.marks.length > 0) {
        adfNode.marks = node.marks.map((mark: any) => ({
          type: mapMarkType(mark.type),
          ...(mark.attrs && { attrs: mark.attrs }),
        }));
      }

      // Add text content - only for text nodes
      if (node.type === 'text') {
        adfNode.text = node.text || '';
      }

      return adfNode;
    };

    // Convert root doc node
    const adf = convertNode(pmJson);

    // Ensure version is set at root level
    return {
      version: 1,
      type: adf.type,
      content: adf.content || [],
    };
  };

  ---
  4. Usage Flow (Creating Jira Ticket)

  Lines 358-364:

  // Step 1: Get ProseMirror JSON from TipTap editor
  const pmJson = editor.getJSON();
  console.log('[Debug] ProseMirror JSON:', JSON.stringify(pmJson, null, 2));

  // Step 2: Convert ProseMirror JSON to ADF
  const adfContent = proseMirrorToAdf(pmJson);
  console.log('[Debug] ADF Content:', JSON.stringify(adfContent, null, 2));

  // Step 3: Send ADF to Jira API
  const payload = {
    title: 'Ticket Title',
    description: adfContent, // This is the Jira ADF object
    // ... other fields
  };

  await fetch('https://your-jira-api-endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  ---
  5. Example: Input → Output

  Input (User types in editor):

  **Bold text** and *italic text*
  - Bullet item 1
  - Bullet item 2

  ProseMirror JSON (from editor.getJSON()):

  {
    "type": "doc",
    "content": [
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "marks": [{ "type": "bold" }],
            "text": "Bold text"
          },
          { "type": "text", "text": " and " },
          {
            "type": "text",
            "marks": [{ "type": "italic" }],
            "text": "italic text"
          }
        ]
      },
      {
        "type": "bulletList",
        "content": [
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Bullet item 1" }]
              }
            ]
          },
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Bullet item 2" }]
              }
            ]
          }
        ]
      }
    ]
  }

  Jira ADF Output (from proseMirrorToAdf()):

  {
    "version": 1,
    "type": "doc",
    "content": [
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "marks": [{ "type": "strong" }],
            "text": "Bold text"
          },
          { "type": "text", "text": " and " },
          {
            "type": "text",
            "marks": [{ "type": "em" }],
            "text": "italic text"
          }
        ]
      },
      {
        "type": "bulletList",
        "content": [
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Bullet item 1" }]
              }
            ]
          },
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [{ "type": "text", "text": "Bullet item 2" }]
              }
            ]
          }
        ]
      }
    ]
  }

  ---
  6. Key Differences: ProseMirror vs Jira ADF
  ┌────────────────┬──────────────────┐
  │  ProseMirror   │     Jira ADF     │
  ├────────────────┼──────────────────┤
  │ bold           │ strong           │
  ├────────────────┼──────────────────┤
  │ italic         │ em               │
  ├────────────────┼──────────────────┤
  │ horizontalRule │ rule             │
  ├────────────────┼──────────────────┤
  │ underline      │ underline (same) │
  ├────────────────┼──────────────────┤
  │ strike         │ strike (same)    │
  └────────────────┴──────────────────┘
  ---
  7. Rendering the Editor in UI

  import { EditorContent } from '@tiptap/react';

  <EditorContent
    editor={editor}
    style={{
      flex: 1,
      overflow: 'auto',
      padding: '12px',
      minHeight: '200px',
    }}
  />

  ---
  Summary for Your Other Project:

  1. Install TipTap packages
  2. Setup useEditor with StarterKit + Underline + Link extensions
  3. Copy the proseMirrorToAdf() conversion function (lines 20-113)
  4. Use editor.getJSON() to get ProseMirror JSON
  5. Convert to ADF using proseMirrorToAdf(pmJson)
  6. Send ADF object to Jira API

  The proseMirrorToAdf function is the key piece - it handles all the node/mark mapping and recursive conversion. It's completely self-contained and can be copied directly to your other project!