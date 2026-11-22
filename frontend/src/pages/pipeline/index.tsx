import React, { useState, useMemo } from 'react';
import {
  Kanban,
  Plus,
  DollarSign,
  TrendingUp,
  Target,
  Filter,
  Calendar,
  User as UserIcon,
  Search,
  Sparkles,
  ArrowRight,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  Building,
} from 'lucide-react';
import { format, parseISO, isWithinInterval, addDays, startOfDay, endOfDay } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/shared/page-header';
import { mockOpportunities } from '@/mock/data/opportunities';
import { mockUsers } from '@/mock/data/users';
import { mockLeads } from '@/mock/data/leads';
import type { Opportunity, PipelineStage } from '@/types';
import { createOpportunitySchema, type CreateOpportunityFormData } from '@/schemas';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// 8 Stages definition
interface StageConfig {
  key: PipelineStage;
  label: string;
  color: string;
  accentClass: string;
  badgeClass: string;
}

const PIPELINE_STAGES: StageConfig[] = [
  {
    key: 'new',
    label: 'New',
    color: '#64748b',
    accentClass: 'border-t-slate-400',
    badgeClass: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
  },
  {
    key: 'contacted',
    label: 'Contacted',
    color: '#3b82f6',
    accentClass: 'border-t-blue-500',
    badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    key: 'qualified',
    label: 'Qualified',
    color: '#0ea5e9',
    accentClass: 'border-t-sky-500',
    badgeClass: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  },
  {
    key: 'discovery',
    label: 'Discovery',
    color: '#8b5cf6',
    accentClass: 'border-t-purple-500',
    badgeClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  },
  {
    key: 'proposal',
    label: 'Proposal',
    color: '#f59e0b',
    accentClass: 'border-t-amber-500',
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  {
    key: 'negotiation',
    label: 'Negotiation',
    color: '#ec4899',
    accentClass: 'border-t-pink-500',
    badgeClass: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  },
  {
    key: 'won',
    label: 'Won',
    color: '#10b981',
    accentClass: 'border-t-emerald-500 bg-emerald-500/5',
    badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
  },
  {
    key: 'lost',
    label: 'Lost',
    color: '#ef4444',
    accentClass: 'border-t-rose-500 bg-rose-500/5',
    badgeClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30',
  },
];

export default function SalesPipelinePage() {
  const { toast } = useToast();

  // State
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [selectedRep, setSelectedRep] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  // Drag and Drop state
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<PipelineStage | null>(null);

  // React Hook Form for Create Opportunity
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateOpportunityFormData>({
    resolver: zodResolver(createOpportunitySchema),
    defaultValues: {
      title: '',
      leadId: '',
      value: 50000,
      currency: 'USD',
      stage: 'new',
      expectedCloseDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
      assignedTo: 'user-003',
      winProbability: 40,
      notes: '',
    },
  });

  // Filter opportunities based on rep, date range, search query
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      // Rep filter
      if (selectedRep !== 'all' && opp.assignedToId !== selectedRep) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = (opp.title || '').toLowerCase().includes(q);
        const matchesCompany = (opp.company || '').toLowerCase().includes(q);
        const matchesLead = (opp.leadName || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesCompany && !matchesLead) return false;
      }

      // Date range filter
      if (dateRangeFilter !== 'all') {
        const closeDate = parseISO(opp.expectedCloseDate);
        const now = startOfDay(new Date());

        if (dateRangeFilter === '30days') {
          const limit = endOfDay(addDays(now, 30));
          if (closeDate < now || closeDate > limit) return false;
        } else if (dateRangeFilter === '60days') {
          const limit = endOfDay(addDays(now, 60));
          if (closeDate < now || closeDate > limit) return false;
        } else if (dateRangeFilter === 'this_quarter') {
          const limit = endOfDay(addDays(now, 90));
          if (closeDate < now || closeDate > limit) return false;
        }
      }

      return true;
    });
  }, [opportunities, selectedRep, dateRangeFilter, searchQuery]);

  // Aggregate pipeline metrics
  const stats = useMemo(() => {
    let totalActiveValue = 0;
    let weightedValue = 0;
    let wonValue = 0;
    let lostValue = 0;
    let activeDealsCount = 0;

    filteredOpportunities.forEach((opp) => {
      if (opp.stage === 'won') {
        wonValue += opp.value;
      } else if (opp.stage === 'lost') {
        lostValue += opp.value;
      } else {
        totalActiveValue += opp.value;
        weightedValue += opp.value * (opp.probability / 100);
        activeDealsCount++;
      }
    });

    const totalClosedValue = wonValue + lostValue;
    const winRate = totalClosedValue > 0 ? (wonValue / totalClosedValue) * 100 : 0;

    return {
      totalActiveValue,
      weightedValue,
      activeDealsCount,
      wonValue,
      winRate,
    };
  }, [filteredOpportunities]);

  // Currency formatting helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Border color based on win probability
  const getProbabilityBorderClass = (prob: number) => {
    if (prob >= 70) return 'border-l-emerald-500';
    if (prob >= 40) return 'border-l-amber-500';
    return 'border-l-blue-500';
  };

  const getProbabilityBadgeVariant = (prob: number) => {
    if (prob >= 70)
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    if (prob >= 40)
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
  };

  // Move opportunity between stages
  const handleMoveOpportunity = (oppId: string, targetStage: PipelineStage) => {
    setOpportunities((prev) => {
      const opp = prev.find((o) => o.id === oppId);
      if (!opp || opp.stage === targetStage) return prev;

      let newProb = opp.probability;
      if (targetStage === 'won') newProb = 100;
      else if (targetStage === 'lost') newProb = 0;
      else if (targetStage === 'proposal' && newProb < 60) newProb = 70;
      else if (targetStage === 'negotiation' && newProb < 75) newProb = 85;

      toast({
        title: 'Deal Stage Updated',
        description: `"${opp.title}" moved to ${targetStage.toUpperCase()}.`,
      });

      return prev.map((o) =>
        o.id === oppId
          ? {
              ...o,
              stage: targetStage,
              probability: newProb,
              updatedAt: new Date().toISOString(),
            }
          : o
      );
    });
  };

  // Submit new opportunity
  const onSubmitCreate = (data: CreateOpportunityFormData) => {
    const selectedLead = mockLeads.find((l) => l.id === data.leadId);
    const assignedUser = mockUsers.find((u) => u.id === data.assignedTo);

    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      title: data.title,
      leadId: data.leadId,
      leadName: selectedLead ? selectedLead.fullName : 'New Prospect',
      company: selectedLead ? selectedLead.company : 'Company Inc',
      value: Number(data.value),
      stage: data.stage,
      probability: data.winProbability ?? 40,
      expectedCloseDate: new Date(data.expectedCloseDate).toISOString(),
      assignedToId: data.assignedTo ?? 'user-003',
      assignedToName: assignedUser ? assignedUser.name : 'Marcus Chen',
      priority: data.value > 100000 ? 'high' : 'medium',
      tenantId: 'tenant-001',
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOpportunities((prev) => [newOpp, ...prev]);
    setIsCreateOpen(false);
    reset();

    toast({
      title: 'Opportunity Created',
      description: `"${newOpp.title}" added to ${newOpp.stage.toUpperCase()} column.`,
      variant: 'default',
    });
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          PAGE HEADER & SUMMARY
          ========================================================================= */}
      <PageHeader
        title="Sales Pipeline"
        description="Visual Kanban pipeline management with real-time probability weighting and instant drag-and-drop."
        icon={Kanban}
        actions={
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="gap-2 shadow-sm font-semibold"
          >
            <Plus className="h-4 w-4" />
            <span>New Opportunity</span>
          </Button>
        }
      />

      {/* Pipeline KPI Cards Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Total Pipeline */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Active Pipeline</span>
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {formatCurrency(stats.totalActiveValue)}
          </div>
          <div className="mt-1 text-2xs text-muted-foreground">
            {stats.activeDealsCount} active commercial deals
          </div>
        </div>

        {/* Weighted Pipeline */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Weighted Forecast</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {formatCurrency(stats.weightedValue)}
          </div>
          <div className="mt-1 text-2xs text-emerald-600 dark:text-emerald-400 font-medium">
            Probability weighted forecast
          </div>
        </div>

        {/* Closed Won */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Closed Won</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {formatCurrency(stats.wonValue)}
          </div>
          <div className="mt-1 text-2xs text-muted-foreground">
            Revenue recognized this cycle
          </div>
        </div>

        {/* Win Rate */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Pipeline Win Rate</span>
            <Target className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {stats.winRate.toFixed(1)}%
          </div>
          <div className="mt-1 text-2xs text-muted-foreground">
            Ratio of Won vs Closed deals
          </div>
        </div>
      </div>

      {/* =========================================================================
          TOOLBAR / FILTERS
          ========================================================================= */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search deals, company, or lead..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-8 text-xs bg-background"
            />
          </div>

          {/* Rep Filter */}
          <div className="w-48">
            <Select value={selectedRep} onValueChange={setSelectedRep}>
              <SelectTrigger className="h-9 text-xs bg-background">
                <SelectValue placeholder="All Sales Reps" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sales Reps</SelectItem>
                {mockUsers
                  .filter((u) => u.role === 'sales_rep' || u.role === 'sales_manager')
                  .map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <div className="w-44">
            <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
              <SelectTrigger className="h-9 text-xs bg-background">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Close Dates</SelectItem>
                <SelectItem value="30days">Next 30 Days</SelectItem>
                <SelectItem value="60days">Next 60 Days</SelectItem>
                <SelectItem value="this_quarter">Next 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Clear Filters (if active) */}
        {(selectedRep !== 'all' || dateRangeFilter !== 'all' || searchQuery) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedRep('all');
              setDateRangeFilter('all');
              setSearchQuery('');
            }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Reset Filters
          </Button>
        )}
      </div>

      {/* =========================================================================
          KANBAN BOARD: 8 Columns with Drag & Drop
          ========================================================================= */}
      <div className="overflow-x-auto pb-4 scrollbar-thin">
        <div className="flex gap-4 min-w-[1920px]">
          {PIPELINE_STAGES.map((stage) => {
            const columnDeals = filteredOpportunities.filter((o) => o.stage === stage.key);
            const columnTotalValue = columnDeals.reduce((sum, item) => sum + item.value, 0);
            const isDropTarget = dragOverStage === stage.key;

            return (
              <div
                key={stage.key}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  if (dragOverStage !== stage.key) {
                    setDragOverStage(stage.key);
                  }
                }}
                onDragLeave={() => {
                  if (dragOverStage === stage.key) {
                    setDragOverStage(null);
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const oppId = e.dataTransfer.getData('text/plain') || draggingId;
                  if (oppId) {
                    handleMoveOpportunity(oppId, stage.key);
                  }
                  setDragOverStage(null);
                  setDraggingId(null);
                }}
                className={cn(
                  'flex w-[240px] shrink-0 flex-col rounded-xl border border-border bg-card/50 p-2.5 transition-all duration-200',
                  stage.accentClass,
                  'border-t-2',
                  isDropTarget && 'ring-2 ring-primary ring-offset-2 bg-primary/5 border-dashed'
                )}
              >
                {/* Column Header */}
                <div className="mb-2 flex items-center justify-between px-1 py-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground">
                      {stage.label}
                    </span>
                    <span
                      className={cn(
                        'flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-3xs font-semibold',
                        stage.badgeClass
                      )}
                    >
                      {columnDeals.length}
                    </span>
                  </div>

                  <span className="text-2xs font-semibold text-muted-foreground">
                    {formatCurrency(columnTotalValue)}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex flex-1 flex-col gap-2 min-h-[480px]">
                  {columnDeals.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-border/60 p-4 text-center">
                      <p className="text-3xs text-muted-foreground">No deals in this stage</p>
                      <p className="text-3xs text-muted-foreground/60 mt-0.5">
                        Drag cards here to update
                      </p>
                    </div>
                  ) : (
                    columnDeals.map((opp) => {
                      const isDragging = draggingId === opp.id;

                      return (
                        <div
                          key={opp.id}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', opp.id);
                            e.dataTransfer.effectAllowed = 'move';
                            setDraggingId(opp.id);
                          }}
                          onDragEnd={() => {
                            setDraggingId(null);
                            setDragOverStage(null);
                          }}
                          className={cn(
                            'group relative cursor-grab rounded-lg border border-border bg-card p-3 shadow-2xs transition-all hover:shadow-md hover:border-border/80 active:cursor-grabbing',
                            'border-l-4',
                            getProbabilityBorderClass(opp.probability),
                            isDragging && 'opacity-40 scale-95 border-dashed ring-2 ring-primary'
                          )}
                        >
                          {/* Company & Priority */}
                          <div className="flex items-start justify-between gap-1">
                            <span className="truncate text-3xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {opp.company}
                            </span>
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-3xs font-semibold border px-1.5 py-0',
                                getProbabilityBadgeVariant(opp.probability)
                              )}
                            >
                              {opp.probability}%
                            </Badge>
                          </div>

                          {/* Deal Title */}
                          <h4 className="mt-1 line-clamp-2 text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                            {opp.title}
                          </h4>

                          {/* Deal Value */}
                          <div className="mt-2 text-sm font-bold tracking-tight text-foreground">
                            {formatCurrency(opp.value)}
                          </div>

                          {/* Footer: Lead / Rep / Close Date */}
                          <div className="mt-2.5 flex items-center justify-between border-t border-border/50 pt-2 text-2xs text-muted-foreground">
                            {/* Close Date */}
                            <span className="flex items-center gap-1 text-3xs" title="Expected Close">
                              <Calendar className="h-3 w-3 text-muted-foreground/70" />
                              {format(parseISO(opp.expectedCloseDate), 'MMM d')}
                            </span>

                            {/* Assigned Rep Avatar */}
                            <div className="flex items-center gap-1.5" title={`Rep: ${opp.assignedToName || 'Unassigned'}`}>
                              <Avatar className="h-5 w-5 text-3xs">
                                <AvatarFallback className="bg-primary/10 text-primary text-3xs font-bold">
                                  {(opp.assignedToName || 'Unassigned')
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="truncate max-w-[65px] text-3xs font-medium text-foreground">
                                {(opp.assignedToName || 'Unassigned').split(' ')[0]}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          CREATE OPPORTUNITY DIALOG
          ========================================================================= */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Create New Opportunity</DialogTitle>
            <DialogDescription className="text-xs">
              Add a new commercial deal to your pipeline. All fields will sync with AI forecasting models.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-4 py-2">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Deal Title <span className="text-destructive">*</span>
              </label>
              <Input
                {...register('title')}
                placeholder="e.g. Enterprise Voice Agent SLA"
                className="h-9 text-xs"
              />
              {errors.title && (
                <p className="text-2xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* Lead & Value Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Lead Selector */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Associated Lead <span className="text-destructive">*</span>
                </label>
                <Controller
                  name="leadId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Select prospect..." />
                      </SelectTrigger>
                      <SelectContent>
                        {mockLeads.map((lead) => (
                          <SelectItem key={lead.id} value={lead.id}>
                            {lead.fullName} ({lead.company})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.leadId && (
                  <p className="text-2xs text-destructive">{errors.leadId.message}</p>
                )}
              </div>

              {/* Deal Value */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Deal Value (USD) <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  {...register('value', { valueAsNumber: true })}
                  placeholder="50000"
                  className="h-9 text-xs"
                />
                {errors.value && (
                  <p className="text-2xs text-destructive">{errors.value.message}</p>
                )}
              </div>
            </div>

            {/* Stage & Probability Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Stage */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Initial Stage <span className="text-destructive">*</span>
                </label>
                <Controller
                  name="stage"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {PIPELINE_STAGES.map((s) => (
                          <SelectItem key={s.key} value={s.key}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.stage && (
                  <p className="text-2xs text-destructive">{errors.stage.message}</p>
                )}
              </div>

              {/* Win Probability % */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Win Probability (%)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  {...register('winProbability', { valueAsNumber: true })}
                  placeholder="40"
                  className="h-9 text-xs"
                />
                {errors.winProbability && (
                  <p className="text-2xs text-destructive">{errors.winProbability.message}</p>
                )}
              </div>
            </div>

            {/* Expected Close Date & Assigned To */}
            <div className="grid grid-cols-2 gap-3">
              {/* Expected Close Date */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Expected Close Date <span className="text-destructive">*</span>
                </label>
                <Input
                  type="date"
                  {...register('expectedCloseDate')}
                  className="h-9 text-xs"
                />
                {errors.expectedCloseDate && (
                  <p className="text-2xs text-destructive">{errors.expectedCloseDate.message}</p>
                )}
              </div>

              {/* Assigned To */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Assigned Rep</label>
                <Controller
                  name="assignedTo"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Assign rep" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockUsers
                          .filter((u) => u.role === 'sales_rep' || u.role === 'sales_manager')
                          .map((u) => (
                            <SelectItem key={u.id} value={u.id}>
                              {u.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Deal Notes / Context</label>
              <Textarea
                {...register('notes')}
                rows={3}
                placeholder="Key discovery takeaways, technical constraints, decision makers..."
                className="resize-none text-xs"
              />
            </div>

            <DialogFooter className="mt-4 pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCreateOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="text-xs font-semibold gap-1.5"
              >
                <span>Create Opportunity</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
