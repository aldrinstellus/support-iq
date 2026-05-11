'use client';

import { useEffect, useState } from 'react';
import { Loader2, RefreshCw, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { getApiBasePath } from '@/lib/api-utils';

interface Ticket {
  id: string;
  ticketNumber: string;
  summary: string;
  priority: 'High' | 'Medium' | 'Low' | 'None' | string;
  status: string;
  assignedAgent: string | null;
  reporter: string;
  reporterEmail: string;
  createdDate: string;
  lastUpdated: string;
  category: string | null;
  channel: string;
  aiProcessed: boolean;
  aiClassification: string | null;
}

interface TicketListDemoProps {
  limit?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
  onTicketClick?: (ticketNumber: string) => void;
}

export function TicketListDemo({
  limit = 20,
  autoRefresh = false,
  refreshInterval = 30000,
  onTicketClick,
}: TicketListDemoProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  // Pagination state — `from` is the 0-based offset of the first ticket on this page.
  // `hasMore` mirrors the API's hasMore signal (best-effort since Zoho doesn't return a total count).
  const [from, setFrom] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchTickets = async (e?: React.MouseEvent, opts?: { fromOverride?: number }) => {
    // Prevent event bubbling to parent elements (important for chat widget context)
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const nextFrom = opts?.fromOverride ?? from;
    try {
      setLoading(true);
      setError(null);

      const basePath = getApiBasePath();
      const response = await fetch(`${basePath}/api/tickets?limit=${limit}&from=${nextFrom}`);

      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }

      const data = await response.json();

      if (data.success) {
        setTickets(data.tickets);
        setHasMore(Boolean(data.pagination?.hasMore));
        setLastUpdated(new Date());
        if (opts?.fromOverride !== undefined) setFrom(opts.fromOverride);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset to page 0 when the parent changes `limit` or `autoRefresh`, then fetch.
    fetchTickets(undefined, { fromOverride: 0 });

    if (autoRefresh) {
      const interval = setInterval(() => fetchTickets(undefined, { fromOverride: 0 }), refreshInterval);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh, refreshInterval, limit]);

  const goPrev = (e?: React.MouseEvent) => {
    if (from === 0) return;
    fetchTickets(e, { fromOverride: Math.max(0, from - limit) });
  };
  const goNext = (e?: React.MouseEvent) => {
    if (!hasMore) return;
    fetchTickets(e, { fromOverride: from + limit });
  };

  const pageStart = tickets.length === 0 ? 0 : from + 1;
  const pageEnd = from + tickets.length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'None':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'escalated':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading tickets from Zoho Desk...</span>
      </div>
    );
  }

  if (error && tickets.length === 0) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <div>
            <h3 className="font-semibold text-destructive">Failed to load tickets</h3>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={(e) => fetchTickets(e)}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Live Zoho Desk Tickets</h2>
          <p className="text-sm text-muted-foreground mt-1" suppressHydrationWarning>
            Showing tickets {pageStart}–{pageEnd} (newest first)
            {lastUpdated && (
              <span className="ml-2">
                • Last updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={(e) => fetchTickets(e)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Tickets</p>
          <p className="text-2xl font-bold text-foreground mt-1">{tickets.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">High Priority</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {tickets.filter((t) => t.priority === 'High').length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Open</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {tickets.filter((t) => t.status === 'Open').length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Email Channel</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {tickets.filter((t) => t.channel === 'Email').length}
          </p>
        </div>
      </div>

      {/* Pagination controls — visible whenever there's at least one page boundary to cross. */}
      {(from > 0 || hasMore) && (
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="text-sm text-muted-foreground">
            Page {Math.floor(from / limit) + 1}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => goPrev(e)}
              disabled={loading || from === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-border text-sm hover:bg-muted/40 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              type="button"
              onClick={(e) => goNext(e)}
              disabled={loading || !hasMore}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-border text-sm hover:bg-muted/40 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tickets Table */}
      <div className="rounded-lg border border-border bg-card">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Ticket #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Summary
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Assigned
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => onTicketClick?.(ticket.ticketNumber)}
                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="font-mono text-sm font-semibold text-primary">
                      #{ticket.ticketNumber}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="max-w-md">
                      <p className="text-sm font-medium text-foreground truncate">
                        {ticket.summary}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {ticket.channel}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        ticket.status
                      )}`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-foreground">
                      {ticket.assignedAgent || (
                        <span className="text-muted-foreground italic">Unassigned</span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-foreground">
                        {ticket.reporter || 'Unknown'}
                      </p>
                      {ticket.reporterEmail && (
                        <p className="text-xs text-muted-foreground">
                          {ticket.reporterEmail}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <p className="text-sm text-foreground">
                      {new Date(ticket.createdDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(ticket.createdDate).toLocaleTimeString()}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
