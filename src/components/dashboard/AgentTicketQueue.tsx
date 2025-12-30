'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowUpDown, Calendar, Filter } from 'lucide-react';
import Link from 'next/link';

type TicketStatus = 'pending' | 'in_review' | 'approved' | 'rejected';
type SortField = 'date' | 'priority' | 'status';

interface Ticket {
  id: string;
  title: string;
  customer: string;
  status: TicketStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  draftId?: string;
}

const mockTickets: Ticket[] = [
  { id: 'TKT-001', title: 'Cannot access account dashboard', customer: 'John Smith', status: 'pending', priority: 'high', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), draftId: 'draft-001' },
  { id: 'TKT-002', title: 'Payment processing error', customer: 'Sarah Johnson', status: 'in_review', priority: 'urgent', createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), draftId: 'draft-002' },
  { id: 'TKT-003', title: 'Feature request: Dark mode', customer: 'Mike Wilson', status: 'pending', priority: 'low', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), draftId: 'draft-003' },
  { id: 'TKT-004', title: 'Email notifications not working', customer: 'Emily Brown', status: 'approved', priority: 'medium', createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000) },
  { id: 'TKT-005', title: 'Data export timeout', customer: 'David Lee', status: 'pending', priority: 'high', createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), draftId: 'draft-005' },
];

const statusConfig: Record<TicketStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' },
  in_review: { label: 'In Review', className: 'bg-blue-500/20 text-blue-500 border-blue-500/30' },
  approved: { label: 'Approved', className: 'bg-green-500/20 text-green-500 border-green-500/30' },
  rejected: { label: 'Rejected', className: 'bg-red-500/20 text-red-500 border-red-500/30' },
};

const priorityConfig = {
  low: { label: 'Low', className: 'text-gray-500' },
  medium: { label: 'Medium', className: 'text-blue-500' },
  high: { label: 'High', className: 'text-orange-500' },
  urgent: { label: 'Urgent', className: 'text-red-500' },
};

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function AgentTicketQueue() {
  const [filterStatus, setFilterStatus] = useState<TicketStatus | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortAscending, setSortAscending] = useState(false);

  const filteredTickets = mockTickets
    .filter(ticket => filterStatus === 'all' || ticket.status === filterStatus)
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'date': comparison = a.createdAt.getTime() - b.createdAt.getTime(); break;
        case 'priority': {
          const order = { low: 0, medium: 1, high: 2, urgent: 3 };
          comparison = order[a.priority] - order[b.priority];
          break;
        }
        case 'status': comparison = a.status.localeCompare(b.status); break;
      }
      return sortAscending ? comparison : -comparison;
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Ticket Queue</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as TicketStatus | 'all')}
              className="glass-card border-border px-4 py-2 rounded-lg text-sm text-foreground appearance-none pr-10 cursor-pointer hover:bg-card/90 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_review">In Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          <button
            onClick={() => { setSortField('date'); setSortAscending(!sortAscending); }}
            className="glass-card border-border px-4 py-2 rounded-lg text-sm text-foreground flex items-center gap-2 hover:bg-card/90 transition-colors"
          >
            <ArrowUpDown className="w-4 h-4" />
            Sort by {sortField}
          </button>
        </div>
      </div>

      <div className="glass-card border-border rounded-xl overflow-hidden">
        <div className="divide-y divide-border">
          <AnimatePresence mode="popLayout">
            {filteredTickets.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No tickets found</p>
              </motion.div>
            ) : (
              filteredTickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-4 hover:bg-card/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-mono text-muted-foreground">{ticket.id}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${statusConfig[ticket.status].className}`}>
                          {statusConfig[ticket.status].label}
                        </span>
                        <span className={`text-xs font-medium ${priorityConfig[ticket.priority].className}`}>
                          {priorityConfig[ticket.priority].label}
                        </span>
                      </div>
                      <h3 className="text-base font-medium text-foreground mb-1 truncate">{ticket.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{ticket.customer}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatTimeAgo(ticket.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {ticket.draftId && (
                        <Link
                          href={`/dashboard/drafts?id=${ticket.draftId}`}
                          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                          Review Draft
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="text-sm text-muted-foreground text-center">
        Showing {filteredTickets.length} of {mockTickets.length} tickets
      </div>
    </div>
  );
}
