import React, { useState, useMemo } from 'react';
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  Play,
  Pause,
  Eye,
  Edit3,
  Calendar,
  Send,
  CheckCircle,
  EyeIcon,
  MousePointerClick,
  TrendingUp,
  Smartphone,
  Mail,
  Send as TelegramIcon,
  Globe,
  Sparkles,
  Layers,
  ArrowUpRight,
  MoreVertical,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/shared/page-header';
import { mockCampaigns, type DetailedCampaign } from '@/mock/data/campaigns';
import type { CampaignStatus, ChannelType } from '@/types';
import { createCampaignSchema, type CreateCampaignFormData } from '@/schemas';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function CampaignsPage() {
  const { toast } = useToast();
  const navigate = useNavigate();

  // State
  const [campaigns, setCampaigns] = useState<DetailedCampaign[]>(mockCampaigns);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [editingCampaign, setEditingCampaign] = useState<DetailedCampaign | null>(null);

  // Form setup for New Campaign
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCampaignFormData>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'email',
      targetAudience: '',
      objectives: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      messageTemplate: '',
    },
  });

  // Filter campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((camp) => {
      // Status filter
      if (statusFilter !== 'all' && camp.status !== statusFilter) {
        return false;
      }
      // Channel filter
      if (channelFilter !== 'all' && camp.channel !== channelFilter) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (camp.name || '').toLowerCase().includes(q);
        const matchDesc = (camp.description || '').toLowerCase().includes(q);
        const matchAud = (camp.targetAudience || '').toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchAud) return false;
      }
      return true;
    });
  }, [campaigns, statusFilter, channelFilter, searchQuery]);

  // Aggregate stats across active campaigns
  const aggregateStats = useMemo(() => {
    let totalSent = 0;
    let totalDelivered = 0;
    let totalOpened = 0;
    let totalClicked = 0;
    let totalConverted = 0;

    campaigns.forEach((c) => {
      totalSent += c.metrics.sent;
      totalDelivered += c.metrics.delivered;
      totalOpened += c.metrics.opened;
      totalClicked += c.metrics.clicked;
      totalConverted += c.metrics.converted;
    });

    const avgConversionRate =
      totalDelivered > 0 ? ((totalConverted / totalDelivered) * 100).toFixed(1) : '0.0';

    return {
      totalSent,
      totalDelivered,
      totalOpened,
      totalClicked,
      totalConverted,
      avgConversionRate,
    };
  }, [campaigns]);

  // Status Badge styling helper
  const getStatusBadge = (status: CampaignStatus) => {
    switch (status) {
      case 'active':
        return (
          <Badge
            variant="outline"
            className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
          >
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </Badge>
        );
      case 'paused':
        return (
          <Badge
            variant="outline"
            className="border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium"
          >
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
            Paused
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge
            variant="outline"
            className="border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium"
          >
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
            Scheduled
          </Badge>
        );
      case 'completed':
        return (
          <Badge
            variant="outline"
            className="border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-medium"
          >
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-purple-500" />
            Completed
          </Badge>
        );
      case 'draft':
      default:
        return (
          <Badge variant="outline" className="border-border bg-muted text-muted-foreground font-medium">
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
            Draft
          </Badge>
        );
    }
  };

  // Channel Icon and label helper
  const getChannelBadge = (channel?: ChannelType) => {
    switch (channel) {
      case 'whatsapp':
        return (
          <Badge variant="secondary" className="gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-3xs">
            <Smartphone className="h-3 w-3" />
            <span>WhatsApp</span>
          </Badge>
        );
      case 'email':
        return (
          <Badge variant="secondary" className="gap-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-3xs">
            <Mail className="h-3 w-3" />
            <span>Email</span>
          </Badge>
        );
      case 'telegram':
        return (
          <Badge variant="secondary" className="gap-1 bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-3xs">
            <TelegramIcon className="h-3 w-3" />
            <span>Telegram</span>
          </Badge>
        );
      case 'web_chat':
      default:
        return (
          <Badge variant="secondary" className="gap-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-3xs">
            <Globe className="h-3 w-3" />
            <span>Multi-Channel</span>
          </Badge>
        );
    }
  };

  // Toggle Pause / Resume
  const handleToggleStatus = (campaign: DetailedCampaign) => {
    const newStatus: CampaignStatus = campaign.status === 'active' ? 'paused' : 'active';

    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaign.id ? { ...c, status: newStatus } : c))
    );

    toast({
      title: newStatus === 'active' ? 'Campaign Resumed' : 'Campaign Paused',
      description: `"${campaign.name}" is now ${newStatus}.`,
      variant: 'default',
    });
  };

  // Create Campaign Submit
  const onSubmitCreate = (data: CreateCampaignFormData) => {
    const channelMap: Record<string, ChannelType> = {
      email: 'email',
      whatsapp: 'whatsapp',
      telegram: 'telegram',
      multi_channel: 'web_chat',
    };

    const newCampaign: DetailedCampaign = {
      id: `camp-${Date.now()}`,
      name: data.name,
      description: data.description || 'Custom multi-touch outreach campaign sequence.',
      channel: channelMap[data.type] || 'email',
      status: 'active',
      targetAudience: data.targetAudience || 'Segment criteria defined',
      objectives: data.objectives || 'Accelerate sales pipeline conversions.',
      budget: 5000,
      startDate: data.startDate ? new Date(data.startDate).toISOString() : new Date().toISOString(),
      endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
      tenantId: 'tenant-001',
      createdById: 'user-001',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageTemplate: data.messageTemplate || '',
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
        bounceRate: 0,
        openRate: 0,
        clickRate: 0,
        conversionRate: 0,
      },
      dailyMetrics: [],
      audienceBreakdown: [],
      funnelStages: [],
      sentLog: [],
    };

    setCampaigns((prev) => [newCampaign, ...prev]);
    setIsCreateOpen(false);
    reset();

    toast({
      title: 'Campaign Created & Activated',
      description: `"${newCampaign.name}" has been initialized.`,
    });
  };

  // Format date range
  const formatDateRange = (startStr?: string, endStr?: string) => {
    if (!startStr) return 'Ongoing schedule';
    try {
      const start = format(parseISO(startStr), 'MMM d, yyyy');
      if (!endStr) return `Started ${start}`;
      const end = format(parseISO(endStr), 'MMM d, yyyy');
      return `${start} – ${end}`;
    } catch {
      return 'Ongoing schedule';
    }
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          PAGE HEADER
          ========================================================================= */}
      <PageHeader
        title="Campaigns"
        description="Autonomous multi-channel outbound campaigns powered by AI sequence generation and engagement tracking."
        icon={Megaphone}
        actions={
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="gap-2 shadow-sm font-semibold"
          >
            <Plus className="h-4 w-4" />
            <span>New Campaign</span>
          </Button>
        }
      />

      {/* Aggregate KPI Summary Bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
          <span className="text-2xs font-medium uppercase tracking-wider text-muted-foreground">
            Total Dispatched
          </span>
          <div className="mt-1 text-xl font-bold tracking-tight text-foreground">
            {aggregateStats.totalSent.toLocaleString()}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
          <span className="text-2xs font-medium uppercase tracking-wider text-muted-foreground">
            Delivered
          </span>
          <div className="mt-1 text-xl font-bold tracking-tight text-foreground">
            {aggregateStats.totalDelivered.toLocaleString()}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
          <span className="text-2xs font-medium uppercase tracking-wider text-muted-foreground">
            Opened
          </span>
          <div className="mt-1 text-xl font-bold tracking-tight text-foreground">
            {aggregateStats.totalOpened.toLocaleString()}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
          <span className="text-2xs font-medium uppercase tracking-wider text-muted-foreground">
            Clicked
          </span>
          <div className="mt-1 text-xl font-bold tracking-tight text-foreground">
            {aggregateStats.totalClicked.toLocaleString()}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
          <span className="text-2xs font-medium uppercase tracking-wider text-muted-foreground">
            Converted Deals
          </span>
          <div className="mt-1 text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {aggregateStats.totalConverted.toLocaleString()} ({aggregateStats.avgConversionRate}%)
          </div>
        </div>
      </div>

      {/* =========================================================================
          FILTERS TOOLBAR
          ========================================================================= */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns by name, audience, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-8 text-xs bg-background"
            />
          </div>

          {/* Status Filter */}
          <div className="w-40">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-xs bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Channel Filter */}
          <div className="w-40">
            <Select value={channelFilter} onValueChange={setChannelFilter}>
              <SelectTrigger className="h-9 text-xs bg-background">
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="telegram">Telegram</SelectItem>
                <SelectItem value="web_chat">Multi-Channel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reset */}
        {(statusFilter !== 'all' || channelFilter !== 'all' || searchQuery) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStatusFilter('all');
              setChannelFilter('all');
              setSearchQuery('');
            }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Reset Filters
          </Button>
        )}
      </div>

      {/* =========================================================================
          CAMPAIGN CARDS GRID (NOT TABLE)
          ========================================================================= */}
      {filteredCampaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center bg-card">
          <Megaphone className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <h3 className="text-base font-semibold text-foreground">No campaigns match your filters</h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm">
            Try adjusting your search criteria or create a new autonomous campaign.
          </p>
          <Button
            onClick={() => setIsCreateOpen(true)}
            size="sm"
            className="mt-4 gap-1.5 text-xs font-semibold"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Campaign</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map((camp) => {
            const deliverabilityRate =
              camp.metrics.sent > 0
                ? Math.round((camp.metrics.delivered / camp.metrics.sent) * 100)
                : 0;

            return (
              <div
                key={camp.id}
                className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-2xs transition-all hover:border-border/80 hover:shadow-md"
              >
                {/* Header & Badges */}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    {getStatusBadge(camp.status)}
                    {getChannelBadge(camp.channel)}
                  </div>

                  {/* Title & Description */}
                  <h3
                    onClick={() => navigate(`/campaigns/${camp.id}`)}
                    className="mt-3 cursor-pointer text-sm font-bold text-foreground transition-colors group-hover:text-primary"
                  >
                    {camp.name}
                  </h3>

                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {camp.description}
                  </p>

                  {/* Date Range */}
                  <div className="mt-3 flex items-center gap-1.5 text-3xs text-muted-foreground">
                    <Calendar className="h-3 w-3 text-muted-foreground/70" />
                    <span>{formatDateRange(camp.startDate, camp.endDate)}</span>
                  </div>

                  {/* Delivery Progress Bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-3xs font-medium">
                      <span className="text-muted-foreground">Delivery Rate</span>
                      <span className="font-semibold text-foreground">{deliverabilityRate}%</span>
                    </div>
                    <Progress value={deliverabilityRate} className="h-1.5 bg-muted" />
                  </div>

                  {/* Performance Metrics Row */}
                  <div className="mt-4 grid grid-cols-5 gap-1 rounded-lg border border-border/60 bg-muted/30 p-2 text-center">
                    <div>
                      <div className="text-3xs text-muted-foreground">Sent</div>
                      <div className="text-xs font-bold text-foreground">
                        {camp.metrics.sent >= 1000
                          ? `${(camp.metrics.sent / 1000).toFixed(1)}k`
                          : camp.metrics.sent}
                      </div>
                    </div>
                    <div>
                      <div className="text-3xs text-muted-foreground">Delivered</div>
                      <div className="text-xs font-bold text-foreground">
                        {camp.metrics.delivered >= 1000
                          ? `${(camp.metrics.delivered / 1000).toFixed(1)}k`
                          : camp.metrics.delivered}
                      </div>
                    </div>
                    <div>
                      <div className="text-3xs text-muted-foreground">Opened</div>
                      <div className="text-xs font-bold text-foreground">
                        {camp.metrics.opened >= 1000
                          ? `${(camp.metrics.opened / 1000).toFixed(1)}k`
                          : camp.metrics.opened}
                      </div>
                    </div>
                    <div>
                      <div className="text-3xs text-muted-foreground">Clicked</div>
                      <div className="text-xs font-bold text-foreground">
                        {camp.metrics.clicked >= 1000
                          ? `${(camp.metrics.clicked / 1000).toFixed(1)}k`
                          : camp.metrics.clicked}
                      </div>
                    </div>
                    <div>
                      <div className="text-3xs text-muted-foreground">Won</div>
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {camp.metrics.converted}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/campaigns/${camp.id}`)}
                    className="h-8 gap-1.5 text-xs font-medium"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View Detail</span>
                  </Button>

                  <div className="flex items-center gap-1.5">
                    {(camp.status === 'active' || camp.status === 'paused') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(camp)}
                        className={cn(
                          'h-8 text-xs font-medium gap-1',
                          camp.status === 'active'
                            ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-500/10'
                            : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10'
                        )}
                      >
                        {camp.status === 'active' ? (
                          <>
                            <Pause className="h-3.5 w-3.5" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-3.5 w-3.5" />
                            <span>Resume</span>
                          </>
                        )}
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: 'Edit Campaign Configuration',
                          description: `Editing parameters for ${camp.name}...`,
                        });
                        navigate(`/campaigns/${camp.id}`);
                      }}
                      className="h-8 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          CREATE CAMPAIGN DIALOG
          ========================================================================= */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Launch Outbound Campaign</DialogTitle>
            <DialogDescription className="text-xs">
              Configure multi-touch automated outreach workflows with AI variable personalization.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-4 py-2">
            {/* Campaign Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Campaign Name <span className="text-destructive">*</span>
              </label>
              <Input
                {...register('name')}
                placeholder="e.g. Q1 Autonomous Inbound Reactivation"
                className="h-9 text-xs"
              />
              {errors.name && (
                <p className="text-2xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Channel / Type & Target Audience */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Outreach Channel <span className="text-destructive">*</span>
                </label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Select channel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email Sequence</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp Direct</SelectItem>
                        <SelectItem value="telegram">Telegram Broadcast</SelectItem>
                        <SelectItem value="multi_channel">Omnichannel Multi-Touch</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Target Audience
                </label>
                <Input
                  {...register('targetAudience')}
                  placeholder="e.g. Series B-D CTOs ($20M+ ARR)"
                  className="h-9 text-xs"
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Start Date</label>
                <Input type="date" {...register('startDate')} className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">End Date</label>
                <Input type="date" {...register('endDate')} className="h-9 text-xs" />
              </div>
            </div>

            {/* Campaign Description */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Description</label>
              <Textarea
                {...register('description')}
                rows={2}
                placeholder="Overview of the campaign hypothesis, target persona, and trigger conditions..."
                className="resize-none text-xs"
              />
            </div>

            {/* Message Template */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  Message Template
                </label>
                <span className="text-3xs text-muted-foreground">
                  Variables: &#123;&#123;first_name&#125;&#125;, &#123;&#123;company&#125;&#125;
                </span>
              </div>
              <Textarea
                {...register('messageTemplate')}
                rows={3}
                placeholder="Hi {{first_name}}, I noticed {{company}} is expanding dispatch hubs..."
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
                <span>Launch Campaign</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
