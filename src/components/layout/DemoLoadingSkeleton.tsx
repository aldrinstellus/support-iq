'use client';

/**
 * DemoLoadingSkeleton
 *
 * Full-page loading skeleton that matches the demo layout structure.
 * Used during hydration to prevent visual flicker/layout shift.
 *
 * IMPORTANT: This skeleton MUST have the same dimensions as the actual content
 * to prevent any visual jump when the real content loads.
 */
export function DemoLoadingSkeleton() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar Skeleton */}
      <aside className="h-screen bg-card border-r border-border w-[300px]">
        <div className="flex h-full flex-col">
          {/* Logo area */}
          <div className="p-4 border-b border-border">
            <div className="h-8 w-24 bg-muted/50 rounded animate-pulse" />
            {/* Mode Switcher Skeleton */}
            <div className="mt-3 flex items-center gap-1 p-1 bg-background border border-border rounded-lg">
              <div className="px-3 py-1.5 rounded-md bg-primary/20 animate-pulse">
                <div className="h-4 w-20" />
              </div>
              <div className="px-3 py-1.5 rounded-md">
                <div className="h-4 w-16 bg-muted/30 rounded animate-pulse" />
              </div>
              <div className="px-3 py-1.5 rounded-md">
                <div className="h-4 w-12 bg-muted/30 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Conversations Section Skeleton */}
          <div className="flex-1 overflow-y-auto">
            <div className="py-3 border-b border-border px-3">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 w-24 bg-muted/30 rounded animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-6 w-6 bg-muted/30 rounded animate-pulse" />
                  <div className="h-6 w-14 bg-primary/30 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-8 w-full bg-muted/20 rounded animate-pulse mt-2" />
            </div>

            {/* Quick Actions Skeleton */}
            <div className="py-3 px-3">
              <div className="h-4 w-24 bg-muted/30 rounded animate-pulse mb-3" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/10">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-muted/30 rounded animate-pulse" />
                      <div className="h-4 w-24 bg-muted/30 rounded animate-pulse" />
                    </div>
                    <div className="h-5 w-12 bg-primary/30 rounded-full animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Persona Info Skeleton */}
          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-muted/30 rounded-full animate-pulse" />
              <div className="flex-1">
                <div className="h-4 w-28 bg-muted/30 rounded animate-pulse" />
                <div className="h-3 w-36 bg-muted/20 rounded animate-pulse mt-1" />
              </div>
              <div className="h-5 w-12 bg-primary/30 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Controls */}
        <div className="absolute top-4 left-[316px] z-20 flex items-center gap-2">
          <div className="h-9 w-9 bg-card border border-border rounded-lg animate-pulse" />
          <div className="h-9 w-9 bg-card border border-border rounded-lg animate-pulse" />
        </div>

        {/* Center Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="h-10 w-96 bg-muted/20 rounded animate-pulse mx-auto" />
            <div className="h-5 w-64 bg-muted/10 rounded animate-pulse mx-auto mt-3" />
          </div>
        </div>

        {/* Bottom Input */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 lg:left-[calc(50%+150px)] w-full max-w-3xl px-6 flex items-center gap-3">
          <div className="flex-1 h-14 bg-card/90 border border-border/50 rounded-full animate-pulse" />
          <div className="h-14 w-36 bg-primary/50 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
