import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Users,
  Upload,
  Download,
  Plus,
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Eye,
  Trash2,
  Tag,
  UserCheck,
  Building2,
  Mail,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  DollarSign,
  Target,
  FileSpreadsheet,
  Loader2,
} from 'lucide-react';
import { formatDistanceToNow, parseISO, format, formatISO, subDays } from 'date-fns';

import { PageHeader } from '@/components/shared/page-header';
import { Pagination } from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

import { mockLeads } from '@/mock/data/leads';
import { mockUsers } from '@/mock/data/users';
import type { Lead, LeadStatus, LeadSource, PipelineStage } from '@/types';
import { cn } from '@/lib/utils';

// =============================================================================
// Form Schema & Types
// =============================================================================

const leadFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().min(1, 'Company name is required'),
  title: z.string().optional(),
  website: z.string().url('Please enter a valid URL (e.g. https://example.com)').optional().or(z.literal('')),
  industry: z.string().min(1, 'Please select an industry'),
  source: z.enum([
    'website',
    'referral',
    'linkedin',
    'whatsapp',
    'campaign',
    'cold_outreach',
    'other',
  ]),
  assignedTo: z.string().min(1, 'Please select an assignee'),
  tags: z.string().optional(),
  notes: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

type SortField = 'fullName' | 'company' | 'leadScore' | 'status' | 'lastInteractionAt' | 'pipelineStage';
type SortOrder = 'asc' | 'desc';

// =============================================================================
// Helper Functions
// =============================================================================

function getScoreBadge(score = 0) {
  if (score <= 30) {
    return {
      text: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-500',
      track: 'bg-rose-500/20',
      border: 'border-rose-500/30',
      badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    };
  }
  if (score <= 60) {
    return {
      text: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500',
      track: 'bg-amber-500/20',
      border: 'border-amber-500/30',
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    };
  }
  return {
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500',
    track: 'bg-emerald-500/20',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  };
}

function getStatusBadge(status: LeadStatus) {
  switch (status) {
    case 'new':
      return {
        label: 'New',
        className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-medium',
      };
    case 'contacted':
      return {
        label: 'Contacted',
        className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium',
      };
    case 'qualified':
      return {
        label: 'Qualified',
        className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium',
      };
    case 'unqualified':
      return {
        label: 'Unqualified',
        className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-medium',
      };
    case 'nurturing':
      return {
        label: 'Nurturing',
        className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-medium',
      };
    default:
      return {
        label: status,
        className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20 font-medium',
      };
  }
}

function getSourceBadge(source: LeadSource | string) {
  switch (source) {
    case 'website':
      return { label: 'Website', className: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20' };
    case 'referral':
      return { label: 'Referral', className: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20' };
    case 'linkedin':
      return { label: 'LinkedIn', className: 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-600/20' };
    case 'whatsapp':
      return { label: 'WhatsApp', className: 'bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-600/20' };
    case 'campaign':
      return { label: 'Campaign', className: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20' };
    case 'cold_outreach':
    case 'cold-outreach':
      return { label: 'Cold Outreach', className: 'bg-amber-600/10 text-amber-600 dark:text-amber-400 border border-amber-600/20' };
    default:
      return { label: source, className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20' };
  }
}

function getStageBadge(stage?: PipelineStage | string): string {
  if (!stage) return 'New';
  const map: Record<string, string> = {
    new: 'New',
    LEAD: 'Lead',
    contacted: 'Contacted',
    qualified: 'Qualified',
    QUALIFICATION: 'Qualified',
    discovery: 'Discovery',
    DISCOVERY: 'Discovery',
    proposal: 'Proposal',
    PROPOSAL: 'Proposal',
    negotiation: 'Negotiation',
    NEGOTIATION: 'Negotiation',
    won: 'Closed Won',
    CLOSED_WON: 'Closed Won',
    lost: 'Closed Lost',
    CLOSED_LOST: 'Closed Lost',
  };
  return map[stage] || stage;
}

function formatRelative(dateString?: string): string {
  if (!dateString) return 'Never';
  try {
    const parsed = parseISO(dateString);
    return formatDistanceToNow(parsed, { addSuffix: true });
  } catch {
    return dateString;
  }
}

function getInitials(name?: string): string {
  if (!name) return 'LD';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Retail',
  'Logistics',
  'Manufacturing',
  'Professional Services',
  'Energy',
  'Education',
  'Other',
];

// =============================================================================
// Main LeadsPage Component
// =============================================================================

export function LeadsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Local state for all leads initialized from mock data
  const [leads, setLeads] = useState<Lead[]>(() => [...mockLeads]);

  // Toolbar & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('leadScore');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isBulkTagOpen, setIsBulkTagOpen] = useState(false);
  const [bulkTagValue, setBulkTagValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup for creating lead
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      title: 'Head of Growth',
      website: '',
      industry: 'Technology',
      source: 'website',
      assignedTo: 'user-003',
      tags: 'Inbound, High Intent',
      notes: '',
    },
  });

  // Calculate high-level KPIs
  const stats = useMemo(() => {
    const total = leads.length;
    const qualified = leads.filter((l) => l.status === 'qualified').length;
    const highIntent = leads.filter((l) => (l.leadScore ?? 0) >= 70).length;
    const pipelineValue = leads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0);
    return { total, qualified, highIntent, pipelineValue };
  }, [leads]);

  // Filtered and sorted leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Search matches name, email, company, or title
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const fullName = lead.fullName || `${lead.firstName} ${lead.lastName}`;
        const matchesName = fullName.toLowerCase().includes(query);
        const matchesEmail = (lead.email || '').toLowerCase().includes(query);
        const matchesCompany = (lead.company || '').toLowerCase().includes(query);
        const matchesTitle = (lead.title || '').toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesCompany && !matchesTitle) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all' && lead.status !== statusFilter) {
        return false;
      }

      // Source filter
      if (sourceFilter !== 'all') {
        const normalizedLeadSource = (lead.source || '').replace('-', '_');
        const normalizedFilter = sourceFilter.replace('-', '_');
        if (normalizedLeadSource !== normalizedFilter) {
          return false;
        }
      }

      // Industry filter
      if (industryFilter !== 'all' && lead.industry !== industryFilter) {
        return false;
      }

      // Assigned To filter
      if (assigneeFilter !== 'all' && lead.assignedToId !== assigneeFilter) {
        return false;
      }

      return true;
    });
  }, [leads, searchQuery, statusFilter, sourceFilter, industryFilter, assigneeFilter]);

  // Sort filtered leads
  const sortedLeads = useMemo(() => {
    return [...filteredLeads].sort((a, b) => {
      let valA: string | number = '';
      let valB: string | number = '';

      switch (sortField) {
        case 'fullName':
          valA = (a.fullName || `${a.firstName} ${a.lastName}`).toLowerCase();
          valB = (b.fullName || `${b.firstName} ${b.lastName}`).toLowerCase();
          break;
        case 'company':
          valA = (a.company || '').toLowerCase();
          valB = (b.company || '').toLowerCase();
          break;
        case 'leadScore':
          valA = a.leadScore ?? 0;
          valB = b.leadScore ?? 0;
          break;
        case 'status':
          valA = a.status || '';
          valB = b.status || '';
          break;
        case 'lastInteractionAt':
          valA = new Date(a.lastInteractionAt || 0).getTime();
          valB = new Date(b.lastInteractionAt || 0).getTime();
          break;
        case 'pipelineStage':
          valA = a.pipelineStage || '';
          valB = b.pipelineStage || '';
          break;
        default:
          valA = a.leadScore ?? 0;
          valB = b.leadScore ?? 0;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredLeads, sortField, sortOrder]);

  // Paginated leads
  const totalPages = Math.ceil(sortedLeads.length / pageSize) || 1;
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedLeads.slice(start, start + pageSize);
  }, [sortedLeads, currentPage, pageSize]);

  // Active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (statusFilter !== 'all') count++;
    if (sourceFilter !== 'all') count++;
    if (industryFilter !== 'all') count++;
    if (assigneeFilter !== 'all') count++;
    return count;
  }, [statusFilter, sourceFilter, industryFilter, assigneeFilter]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSourceFilter('all');
    setIndustryFilter('all');
    setAssigneeFilter('all');
    setCurrentPage(1);
  };

  // Sort toggle handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Selection handlers
  const isAllPageSelected =
    paginatedLeads.length > 0 &&
    paginatedLeads.every((l) => selectedIds.includes(l.id));

  const handleSelectAllPage = (checked: boolean) => {
    if (checked) {
      const pageIds = paginatedLeads.map((l) => l.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = paginatedLeads.map((l) => l.id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const handleSelectLead = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  // Bulk Actions
  const handleBulkAssign = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) return;

    setLeads((prev) =>
      prev.map((lead) =>
        selectedIds.includes(lead.id)
          ? { ...lead, assignedToId: user.id, assignedToName: user.name }
          : lead
      )
    );

    toast({
      title: 'Bulk Assignment Complete',
      description: `Assigned ${selectedIds.length} lead(s) to ${user.name}.`,
    });
    setSelectedIds([]);
  };

  const handleBulkAddTag = () => {
    if (!bulkTagValue.trim()) return;
    const tagToAdd = bulkTagValue.trim();

    setLeads((prev) =>
      prev.map((lead) => {
        if (!selectedIds.includes(lead.id)) return lead;
        const currentTags = lead.tags || [];
        if (currentTags.includes(tagToAdd)) return lead;
        return { ...lead, tags: [...currentTags, tagToAdd] };
      })
    );

    toast({
      title: 'Tags Applied',
      description: `Added "${tagToAdd}" tag to ${selectedIds.length} lead(s).`,
    });
    setBulkTagValue('');
    setIsBulkTagOpen(false);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    const count = selectedIds.length;
    setLeads((prev) => prev.filter((lead) => !selectedIds.includes(lead.id)));
    setSelectedIds([]);
    toast({
      title: 'Leads Deleted',
      description: `Permanently removed ${count} lead(s).`,
      variant: 'destructive',
    });
  };

  // Single lead delete
  const handleDeleteLead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const lead = leads.find((l) => l.id === id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    toast({
      title: 'Lead Deleted',
      description: `${lead?.fullName || 'Lead'} has been removed.`,
      variant: 'destructive',
    });
  };

  // Single lead status update
  const handleUpdateStatus = (id: string, newStatus: LeadStatus, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
    toast({
      title: 'Status Updated',
      description: `Lead status updated to ${newStatus}.`,
    });
  };

  // Export to CSV
  const handleExportCsv = () => {
    const headers = [
      'ID',
      'Full Name',
      'Company',
      'Title',
      'Email',
      'Phone',
      'Industry',
      'Source',
      'Status',
      'Pipeline Stage',
      'Lead Score',
      'Estimated Value',
      'Assigned To',
      'Last Interaction',
    ];

    const rows = sortedLeads.map((l) => {
      const name = l.fullName || `${l.firstName} ${l.lastName}`;
      const company = l.company || '';
      const title = l.title || '';
      const phone = l.phone || '';
      const assigned = l.assignedToName || '';
      return [
        l.id,
        `"${name.replace(/"/g, '""')}"`,
        `"${company.replace(/"/g, '""')}"`,
        `"${title.replace(/"/g, '""')}"`,
        l.email || '',
        `"${phone}"`,
        l.industry || '',
        l.source || '',
        l.status || '',
        l.pipelineStage || '',
        l.leadScore ?? 0,
        l.estimatedValue ?? 0,
        `"${assigned}"`,
        l.lastInteractionAt || '',
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `skarworld-leads-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Export Successful',
      description: `Exported ${sortedLeads.length} leads to CSV.`,
    });
  };

  // Sample import
  const handleImportSample = () => {
    const newSampleLeads: Lead[] = [
      {
        id: `lead-imp-${Date.now()}-1`,
        firstName: 'Elena',
        lastName: 'Vasquez',
        fullName: 'Elena Vasquez',
        email: 'elena@novawave.tech',
        phone: '+1 (415) 800-4321',
        company: 'NovaWave AI',
        title: 'VP of Customer Experience',
        industry: 'Technology',
        status: 'qualified',
        source: 'website',
        pipelineStage: 'discovery',
        leadScore: 89,
        scoreTrend: 'up',
        estimatedValue: 95000,
        assignedToId: 'user-003',
        assignedToName: 'Marcus Chen',
        tags: ['Inbound', 'High Intent', 'AI Platform'],
        tenantId: 'tenant-001',
        notes: 'Inbound evaluation for multi-channel sales agent integration.',
        lastInteractionAt: formatISO(subDays(new Date(), 1)),
        nextFollowUpDate: formatISO(subDays(new Date(), -2)),
        createdAt: formatISO(new Date()),
        updatedAt: formatISO(new Date()),
      },
      {
        id: `lead-imp-${Date.now()}-2`,
        firstName: 'Rajiv',
        lastName: 'Mehta',
        fullName: 'Rajiv Mehta',
        email: 'rajiv.m@finovatek.com',
        phone: '+1 (212) 640-9988',
        company: 'Finovatek Capital',
        title: 'Managing Director',
        industry: 'Finance',
        status: 'new',
        source: 'linkedin',
        pipelineStage: 'new',
        leadScore: 78,
        scoreTrend: 'neutral',
        estimatedValue: 140000,
        assignedToId: 'user-004',
        assignedToName: 'Sarah Jenkins',
        tags: ['FinTech', 'Enterprise'],
        tenantId: 'tenant-001',
        notes: 'Outreach campaign response regarding autonomous lead qualification.',
        lastInteractionAt: formatISO(subDays(new Date(), 2)),
        nextFollowUpDate: formatISO(subDays(new Date(), -3)),
        createdAt: formatISO(new Date()),
        updatedAt: formatISO(new Date()),
      },
    ];

    setLeads((prev) => [...newSampleLeads, ...prev]);
    setIsImportOpen(false);
    toast({
      title: 'Import Completed',
      description: `Successfully imported ${newSampleLeads.length} leads.`,
    });
  };

  // Create lead submit
  const onSubmitCreateLead = async (data: LeadFormData) => {
    setIsSubmitting(true);
    // Simulate server response delay
    await new Promise((res) => setTimeout(res, 600));

    const selectedUser = mockUsers.find((u) => u.id === data.assignedTo) || mockUsers[2];
    const tagsArray = data.tags
      ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : ['New Prospect'];

    // Map source enum if cold_outreach
    const normalizedSource: LeadSource =
      data.source === 'cold_outreach' ? 'cold-outreach' : (data.source as LeadSource);

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email || `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}@${data.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      phone: data.phone || '+1 (555) 000-0000',
      company: data.company,
      title: data.title || 'Executive',
      industry: data.industry,
      status: 'new',
      source: normalizedSource,
      pipelineStage: 'new',
      leadScore: 65,
      scoreTrend: 'neutral',
      estimatedValue: 50000,
      assignedToId: selectedUser.id,
      assignedToName: selectedUser.name,
      tags: tagsArray,
      tenantId: 'tenant-001',
      notes: data.notes || '',
      lastInteractionAt: formatISO(new Date()),
      nextFollowUpDate: formatISO(subDays(new Date(), -2)),
      createdAt: formatISO(new Date()),
      updatedAt: formatISO(new Date()),
    };

    setLeads((prev) => [newLead, ...prev]);
    setIsSubmitting(false);
    setIsCreateOpen(false);
    reset();

    toast({
      title: 'Lead Created',
      description: `Successfully added ${newLead.fullName} (${newLead.company}) to your CRM.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <PageHeader
        title="Leads"
        description="Manage your leads and prospects"
        icon={Users}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsImportOpen(true)}
              className="gap-2 shadow-xs"
            >
              <Upload className="h-4 w-4" />
              <span>Import</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              className="gap-2 shadow-xs"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            <Button
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="gap-2 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              <span>New Lead</span>
            </Button>
          </div>
        }
      />

      {/* 2. Quick Metrics Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Leads</span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">{stats.total}</div>
          <p className="mt-1 text-xs text-muted-foreground">Active in pipeline</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Qualified Leads</span>
            <Sparkles className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {stats.qualified}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {stats.total > 0 ? Math.round((stats.qualified / stats.total) * 100) : 0}% qualification rate
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">High Intent (Score &ge; 70)</span>
            <Target className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">{stats.highIntent}</div>
          <p className="mt-1 text-xs text-muted-foreground">Prime for closing</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Estimated Pipeline</span>
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">
            ${(stats.pipelineValue / 1000).toFixed(0)}k
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Potential deal size</p>
        </div>
      </div>

      {/* 3. Data Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, company..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-8"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFiltersPanel((prev) => !prev)}
              className={cn(
                'gap-2 shadow-xs transition-colors',
                (showFiltersPanel || activeFiltersCount > 0) && 'border-primary/50 bg-primary/5 text-primary'
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs font-semibold">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-9 gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
                <span>Reset</span>
              </Button>
            )}
          </div>
        </div>

        {/* Expandable Filter Panel */}
        {showFiltersPanel && (
          <div className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-4 shadow-xs sm:grid-cols-2 lg:grid-cols-4">
            {/* Status Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="unqualified">Unqualified</SelectItem>
                  <SelectItem value="nurturing">Nurturing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Source Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Source</label>
              <Select
                value={sourceFilter}
                onValueChange={(val) => {
                  setSourceFilter(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="campaign">Campaign</SelectItem>
                  <SelectItem value="cold_outreach">Cold Outreach</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Industry Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Industry</label>
              <Select
                value={industryFilter}
                onValueChange={(val) => {
                  setIndustryFilter(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All Industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Assigned To Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Assigned To</label>
              <Select
                value={assigneeFilter}
                onValueChange={(val) => {
                  setAssigneeFilter(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All Assignees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Team Members</SelectItem>
                  {mockUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.title})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* 4. Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {selectedIds.length}
            </span>
            <span className="text-sm font-medium text-foreground">
              {selectedIds.length === 1 ? '1 lead selected' : `${selectedIds.length} leads selected`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Bulk Assign Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 bg-background shadow-xs">
                  <UserCheck className="h-4 w-4" />
                  <span>Assign To</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Choose Team Member</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {mockUsers.map((user) => (
                  <DropdownMenuItem
                    key={user.id}
                    onClick={() => handleBulkAssign(user.id)}
                    className="gap-2"
                  >
                    <Avatar className="h-6 w-6 text-[10px]">
                      <AvatarFallback>{user.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-[11px] text-muted-foreground">{user.title}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Bulk Tag Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBulkTagOpen(true)}
              className="gap-1.5 bg-background shadow-xs"
            >
              <Tag className="h-4 w-4" />
              <span>Add Tag</span>
            </Button>

            {/* Bulk Delete Button */}
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              className="gap-1.5 shadow-xs"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds([])}
              className="text-xs text-muted-foreground"
            >
              Deselect All
            </Button>
          </div>
        </div>
      )}

      {/* 5. Data Table */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-12 px-4">
                <Checkbox
                  checked={isAllPageSelected}
                  onCheckedChange={handleSelectAllPage}
                  aria-label="Select all on this page"
                />
              </TableHead>

              {/* Name (sortable) */}
              <TableHead
                onClick={() => handleSort('fullName')}
                className="cursor-pointer select-none font-semibold text-foreground"
              >
                <div className="flex items-center gap-1.5">
                  <span>Name</span>
                  {sortField === 'fullName' ? (
                    sortOrder === 'asc' ? (
                      <ArrowUp className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <ArrowDown className="h-3.5 w-3.5 text-primary" />
                    )
                  ) : (
                    <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground opacity-60" />
                  )}
                </div>
              </TableHead>

              {/* Company (sortable) */}
              <TableHead
                onClick={() => handleSort('company')}
                className="cursor-pointer select-none font-semibold text-foreground"
              >
                <div className="flex items-center gap-1.5">
                  <span>Company</span>
                  {sortField === 'company' ? (
                    sortOrder === 'asc' ? (
                      <ArrowUp className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <ArrowDown className="h-3.5 w-3.5 text-primary" />
                    )
                  ) : (
                    <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground opacity-60" />
                  )}
                </div>
              </TableHead>

              <TableHead className="font-semibold text-foreground">Email</TableHead>
              <TableHead className="font-semibold text-foreground">Source</TableHead>

              {/* Score (sortable) */}
              <TableHead
                onClick={() => handleSort('leadScore')}
                className="cursor-pointer select-none font-semibold text-foreground"
              >
                <div className="flex items-center gap-1.5">
                  <span>Score</span>
                  {sortField === 'leadScore' ? (
                    sortOrder === 'asc' ? (
                      <ArrowUp className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <ArrowDown className="h-3.5 w-3.5 text-primary" />
                    )
                  ) : (
                    <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground opacity-60" />
                  )}
                </div>
              </TableHead>

              {/* Status (sortable) */}
              <TableHead
                onClick={() => handleSort('status')}
                className="cursor-pointer select-none font-semibold text-foreground"
              >
                <div className="flex items-center gap-1.5">
                  <span>Status</span>
                  {sortField === 'status' ? (
                    sortOrder === 'asc' ? (
                      <ArrowUp className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <ArrowDown className="h-3.5 w-3.5 text-primary" />
                    )
                  ) : (
                    <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground opacity-60" />
                  )}
                </div>
              </TableHead>

              <TableHead className="font-semibold text-foreground">Stage</TableHead>
              <TableHead className="font-semibold text-foreground">Assigned To</TableHead>

              {/* Last Interaction (sortable) */}
              <TableHead
                onClick={() => handleSort('lastInteractionAt')}
                className="cursor-pointer select-none font-semibold text-foreground"
              >
                <div className="flex items-center gap-1.5">
                  <span>Last Interaction</span>
                  {sortField === 'lastInteractionAt' ? (
                    sortOrder === 'asc' ? (
                      <ArrowUp className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <ArrowDown className="h-3.5 w-3.5 text-primary" />
                    )
                  ) : (
                    <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground opacity-60" />
                  )}
                </div>
              </TableHead>

              <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="h-44 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Users className="h-9 w-9 text-muted-foreground/40 mb-2" />
                    <p className="text-base font-semibold text-foreground">No leads found</p>
                    <p className="text-sm mt-1">Try adjusting your search terms or filter criteria.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearFilters}
                      className="mt-4 gap-1.5"
                    >
                      <X className="h-3.5 w-3.5" />
                      Clear Filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedLeads.map((lead) => {
                const leadName = lead.fullName || `${lead.firstName} ${lead.lastName}`;
                const isSelected = selectedIds.includes(lead.id);
                const scoreValue = lead.leadScore ?? 0;
                const scoreColors = getScoreBadge(scoreValue);
                const statusConfig = getStatusBadge(lead.status);
                const sourceConfig = getSourceBadge(lead.source);

                return (
                  <TableRow
                    key={lead.id}
                    onClick={() => navigate(`/leads/${lead.id}`)}
                    className={cn(
                      'cursor-pointer transition-colors hover:bg-muted/50',
                      isSelected && 'bg-primary/5 hover:bg-primary/10'
                    )}
                  >
                    {/* Checkbox column */}
                    <TableCell
                      className="px-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleSelectLead(lead.id, !!checked)
                        }
                        aria-label={`Select ${leadName}`}
                      />
                    </TableCell>

                    {/* Name column */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 shrink-0 ring-1 ring-border">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {getInitials(leadName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-semibold text-foreground hover:underline">
                            {leadName}
                          </span>
                          <p className="text-xs text-muted-foreground">{lead.title}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Company */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-foreground font-medium">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{lead.company}</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">{lead.industry}</span>
                    </TableCell>

                    {/* Email */}
                    <TableCell>
                      <a
                        href={`mailto:${lead.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-xs font-mono"
                      >
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate max-w-[150px]">{lead.email}</span>
                      </a>
                    </TableCell>

                    {/* Source badge */}
                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                          sourceConfig.className
                        )}
                      >
                        {sourceConfig.label}
                      </span>
                    </TableCell>

                    {/* Score (colored progress bar: 0-30 red, 31-60 yellow, 61-100 green) */}
                    <TableCell>
                      <div className="w-28 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className={cn('font-bold font-mono', scoreColors.text)}>
                            {scoreValue}
                          </span>
                          <span className="flex items-center text-[10px] text-muted-foreground">
                            {lead.scoreTrend === 'up' && (
                              <TrendingUp className="h-3 w-3 text-emerald-500 mr-0.5" />
                            )}
                            {lead.scoreTrend === 'down' && (
                              <TrendingDown className="h-3 w-3 text-rose-500 mr-0.5" />
                            )}
                            {lead.scoreTrend === 'neutral' && (
                              <Minus className="h-3 w-3 text-slate-400 mr-0.5" />
                            )}
                            /100
                          </span>
                        </div>
                        {/* Custom Colored Progress Bar */}
                        <div className={cn('h-1.5 w-full rounded-full overflow-hidden', scoreColors.track)}>
                          <div
                            className={cn('h-full transition-all duration-300', scoreColors.bg)}
                            style={{ width: `${Math.min(100, Math.max(5, scoreValue))}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>

                    {/* Status badge */}
                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs',
                          statusConfig.className
                        )}
                      >
                        {statusConfig.label}
                      </span>
                    </TableCell>

                    {/* Pipeline Stage */}
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-normal">
                        {getStageBadge(lead.pipelineStage)}
                      </Badge>
                    </TableCell>

                    {/* Assigned To */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 text-[10px]">
                          <AvatarFallback className="bg-secondary text-foreground">
                            {getInitials(lead.assignedToName || 'MC')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-foreground truncate max-w-[110px]">
                          {lead.assignedToName || 'Unassigned'}
                        </span>
                      </div>
                    </TableCell>

                    {/* Last Interaction */}
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {formatRelative(lead.lastInteractionAt)}
                      </span>
                    </TableCell>

                    {/* Actions menu */}
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => navigate(`/leads/${lead.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Set Status
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={(e) => handleUpdateStatus(lead.id, 'contacted', e)}
                          >
                            Mark as Contacted
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => handleUpdateStatus(lead.id, 'qualified', e)}
                          >
                            Mark as Qualified
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => handleUpdateStatus(lead.id, 'nurturing', e)}
                          >
                            Move to Nurturing
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => handleDeleteLead(lead.id, e)}
                            className="text-rose-600 focus:text-rose-600 dark:text-rose-400"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Lead
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* 6. Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={sortedLeads.length}
        pageSize={pageSize}
      />

      {/* 7. Create Lead Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Users className="h-5 w-5 text-primary" />
              <span>Create New Lead</span>
            </DialogTitle>
            <DialogDescription>
              Capture new prospect information. Autonomous AI enrichment will automatically generate company intelligence upon creation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmitCreateLead)} className="space-y-4 py-2">
            {/* First & Last Name */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="e.g. Alex"
                  {...register('firstName')}
                  className={errors.firstName ? 'border-destructive' : ''}
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="e.g. Mercer"
                  {...register('lastName')}
                  className={errors.lastName ? 'border-destructive' : ''}
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="email">Work Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="alex.mercer@company.com"
                  {...register('email')}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 012-3456"
                  {...register('phone')}
                />
              </div>
            </div>

            {/* Company & Job Title */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  placeholder="e.g. Vertex Technologies"
                  {...register('company')}
                  className={errors.company ? 'border-destructive' : ''}
                />
                {errors.company && (
                  <p className="text-xs text-destructive">{errors.company.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. VP of Revenue Operations"
                  {...register('title')}
                />
              </div>
            </div>

            {/* Website & Industry */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="https://vertextech.io"
                  {...register('website')}
                  className={errors.website ? 'border-destructive' : ''}
                />
                {errors.website && (
                  <p className="text-xs text-destructive">{errors.website.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="industry">Industry *</Label>
                <Controller
                  control={control}
                  name="industry"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map((ind) => (
                          <SelectItem key={ind} value={ind}>
                            {ind}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.industry && (
                  <p className="text-xs text-destructive">{errors.industry.message}</p>
                )}
              </div>
            </div>

            {/* Source & Assigned To */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="source">Lead Source</Label>
                <Controller
                  control={control}
                  name="source"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="source">
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="campaign">Marketing Campaign</SelectItem>
                        <SelectItem value="cold_outreach">Cold Outreach</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="assignedTo">Assign To</Label>
                <Controller
                  control={control}
                  name="assignedTo"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="assignedTo">
                        <SelectValue placeholder="Assign team member" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.title})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.assignedTo && (
                  <p className="text-xs text-destructive">{errors.assignedTo.message}</p>
                )}
              </div>
            </div>

            {/* Tags (comma separated) */}
            <div className="space-y-1.5">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                placeholder="Enterprise, High Intent, Q4 Close"
                {...register('tags')}
              />
              <p className="text-[11px] text-muted-foreground">
                Separate multiple tags with commas. E.g. &quot;Enterprise, Inbound, Priority&quot;
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="notes">Initial Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add context, qualification details, or next steps for the sales team..."
                rows={3}
                {...register('notes')}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating Lead...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Create Lead</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 8. Import Leads Dialog */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              <span>Import Leads</span>
            </DialogTitle>
            <DialogDescription>
              Upload a CSV file containing your leads or load pre-built demo leads into your workspace.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20 p-6 text-center hover:bg-muted/30 transition-colors">
              <FileSpreadsheet className="h-10 w-10 text-muted-foreground/60 mb-2" />
              <p className="text-sm font-medium text-foreground">Drag and drop your CSV file here</p>
              <p className="text-xs text-muted-foreground mt-1">Supports standard CSV with headers (Name, Email, Company, Phone)</p>
              <Input
                type="file"
                accept=".csv"
                className="mt-4 max-w-xs cursor-pointer"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImportSample();
                  }
                }}
              />
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <span className="relative bg-background px-2 text-xs uppercase text-muted-foreground">
                Or test with sample
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleImportSample}
              className="w-full gap-2 border-primary/30 text-primary hover:bg-primary/5"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Load 2 Demo Enterprise Leads</span>
            </Button>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsImportOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 9. Bulk Tag Dialog */}
      <Dialog open={isBulkTagOpen} onOpenChange={setIsBulkTagOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              <span>Add Tag to Selected Leads</span>
            </DialogTitle>
            <DialogDescription>
              Apply a common tag across all {selectedIds.length} selected leads.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <Label htmlFor="bulkTagInput">Tag Name</Label>
            <Input
              id="bulkTagInput"
              placeholder="e.g. Q4 Target, High Intent, VIP"
              value={bulkTagValue}
              onChange={(e) => setBulkTagValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleBulkAddTag();
                }
              }}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkTagOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkAddTag} disabled={!bulkTagValue.trim()}>
              Apply Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default LeadsPage;
