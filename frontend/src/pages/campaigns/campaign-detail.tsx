import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Pause,
  Edit3,
  Trash2,
  Calendar,
  DollarSign,
  Target,
  Send,
  CheckCircle,
  Eye,
  MousePointerClick,
  TrendingUp,
  Smartphone,
  Mail,
  Send as TelegramIcon,
  Globe,
  Sparkles,
  Users,
  MessageSquare,
  BarChart3,
  Copy,
  Check,
  AlertCircle,
  Clock,
  Shield,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { mockCampaigns, type DetailedCampaign, type CampaignDailyMetric } from '@/mock/data/campaigns';
import type { CampaignStatus, ChannelType } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Find campaign by ID or fallback to first
  const initialCampaign = useMemo(() => {
    return mockCampaigns.find((c) => c.id === id) || mockCampaigns[0];
  }, [id]);

  const [campaign, setCampaign] = useState<DetailedCampaign>(initialCampaign);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [editName, setEditName] = useState(campaign.name);
  const [editDescription, setEditDescription] = useState(campaign.description);
  const [editObjectives, setEditObjectives] = useState(campaign.objectives || '');
  const [isCopiedTemplate, setIsCopiedTemplate] = useState<boolean>(false);

  // Toggle status
  const handleToggleStatus = () => {
    const nextStatus: CampaignStatus = campaign.status === 'active' ? 'paused' : 'active';
    setCampaign((prev) => ({ ...prev, status: nextStatus }));
    toast({
      title: nextStatus === 'active' ? 'Campaign Resumed' : 'Campaign Paused',
      description: `"${campaign.name}" is now ${nextStatus}.`,
    });
  };

  // Delete campaign
  const handleDeleteCampaign = () => {
    toast({
      title: 'Campaign Deleted',
      description: `Campaign "${campaign.name}" was successfully decommissioned.`,
      variant: 'destructive',
    });
    navigate('/campaigns');
  };

  // Edit save
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setCampaign((prev) => ({
      ...prev,
      name: editName,
      description: editDescription,
      objectives: editObjectives,
    }));
    setIsEditDialogOpen(false);
    toast({
      title: 'Campaign Updated',
      description: 'Changes have been propagated to active pipelines.',
    });
  };

  // Copy template helper
  const handleCopyTemplate = () => {
    if (campaign.messageTemplate) {
      navigator.clipboard.writeText(campaign.messageTemplate);
      setIsCopiedTemplate(true);
      setTimeout(() => setIsCopiedTemplate(false), 2000);
      toast({
        title: 'Template Copied',
        description: 'Message body copied to clipboard.',
      });
    }
  };

  // Status Badge styling helper
  const getStatusBadge = (status: CampaignStatus) => {
    switch (status) {
      case 'active':
        return (
          <Badge
            variant="outline"
            className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
          >
            <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </Badge>
        );
      case 'paused':
        return (
          <Badge
            variant="outline"
            className="border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold"
          >
            <span className="mr-1.5 h-2 w-2 rounded-full bg-amber-500" />
            Paused
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge
            variant="outline"
            className="border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold"
          >
            <span className="mr-1.5 h-2 w-2 rounded-full bg-blue-500" />
            Scheduled
          </Badge>
        );
      case 'completed':
        return (
          <Badge
            variant="outline"
            className="border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold"
          >
            <span className="mr-1.5 h-2 w-2 rounded-full bg-purple-500" />
            Completed
          </Badge>
        );
      case 'draft':
      default:
        return (
          <Badge variant="outline" className="border-border bg-muted text-muted-foreground font-semibold">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-muted-foreground/60" />
            Draft
          </Badge>
        );
    }
  };

  // Channel badge
  const getChannelBadge = (channel?: ChannelType) => {
    switch (channel) {
      case 'whatsapp':
        return (
          <Badge variant="secondary" className="gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Smartphone className="h-3.5 w-3.5" />
            <span>WhatsApp Outbound</span>
          </Badge>
        );
      case 'email':
        return (
          <Badge variant="secondary" className="gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Mail className="h-3.5 w-3.5" />
            <span>Email Sequence</span>
          </Badge>
        );
      case 'telegram':
        return (
          <Badge variant="secondary" className="gap-1.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <TelegramIcon className="h-3.5 w-3.5" />
            <span>Telegram Channel</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Globe className="h-3.5 w-3.5" />
            <span>Multi-Channel</span>
          </Badge>
        );
    }
  };

  const deliveryRate =
    campaign.metrics.sent > 0
      ? ((campaign.metrics.delivered / campaign.metrics.sent) * 100).toFixed(1)
      : '0.0';
  const openRate =
    campaign.metrics.delivered > 0
      ? ((campaign.metrics.opened / campaign.metrics.delivered) * 100).toFixed(1)
      : '0.0';
  const clickRate =
    campaign.metrics.opened > 0
      ? ((campaign.metrics.clicked / campaign.metrics.opened) * 100).toFixed(1)
      : '0.0';
  const conversionRate =
    campaign.metrics.delivered > 0
      ? ((campaign.metrics.converted / campaign.metrics.delivered) * 100).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-6">
      {/* =========================================================================
          TOP NAVIGATION & HEADER
          ========================================================================= */}
      <div className="flex flex-col gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/campaigns')}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Campaigns</span>
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {campaign.name}
              </h1>
              {getStatusBadge(campaign.status)}
              {getChannelBadge(campaign.channel)}
            </div>
            <p className="max-w-2xl text-xs sm:text-sm text-muted-foreground">
              {campaign.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {(campaign.status === 'active' || campaign.status === 'paused') && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleStatus}
                className={cn(
                  'gap-1.5 text-xs font-semibold',
                  campaign.status === 'active'
                    ? 'border-amber-500/30 text-amber-600 hover:bg-amber-500/10'
                    : 'border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10'
                )}
              >
                {campaign.status === 'active' ? (
                  <>
                    <Pause className="h-3.5 w-3.5" />
                    <span>Pause Campaign</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    <span>Resume Campaign</span>
                  </>
                )}
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditDialogOpen(true)}
              className="gap-1.5 text-xs"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit</span>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Campaign?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete &quot;{campaign.name}&quot;? This will halt active agent dispatches and archive historical delivery events.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteCampaign}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Campaign
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TABS CONTAINER
          ========================================================================= */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="overview" className="gap-2 text-xs font-medium">
            <Layers className="h-3.5 w-3.5" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="audience" className="gap-2 text-xs font-medium">
            <Users className="h-3.5 w-3.5" />
            <span>Audience</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="gap-2 text-xs font-medium">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Messages & Logs</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2 text-xs font-medium">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Analytics & Funnel</span>
          </TabsTrigger>
        </TabsList>

        {/* ---------------------------------------------------------------------
            TAB 1: OVERVIEW
            --------------------------------------------------------------------- */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards Row */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-2xs font-medium uppercase tracking-wider">Dispatched</span>
                <Send className="h-4 w-4 text-primary" />
              </div>
              <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                {campaign.metrics.sent.toLocaleString()}
              </div>
              <div className="mt-1 text-2xs text-muted-foreground">Total outbox dispatches</div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-2xs font-medium uppercase tracking-wider">Delivered</span>
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                {campaign.metrics.delivered.toLocaleString()}
              </div>
              <div className="mt-1 text-2xs text-emerald-600 dark:text-emerald-400 font-medium">
                {deliveryRate}% delivery rate
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-2xs font-medium uppercase tracking-wider">Opened</span>
                <Eye className="h-4 w-4 text-blue-500" />
              </div>
              <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                {campaign.metrics.opened.toLocaleString()}
              </div>
              <div className="mt-1 text-2xs text-blue-600 dark:text-blue-400 font-medium">
                {openRate}% open rate
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-2xs font-medium uppercase tracking-wider">Clicked</span>
                <MousePointerClick className="h-4 w-4 text-purple-500" />
              </div>
              <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                {campaign.metrics.clicked.toLocaleString()}
              </div>
              <div className="mt-1 text-2xs text-purple-600 dark:text-purple-400 font-medium">
                {clickRate}% click-through
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-2xs font-medium uppercase tracking-wider">Converted</span>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                {campaign.metrics.converted.toLocaleString()}
              </div>
              <div className="mt-1 text-2xs text-emerald-600 dark:text-emerald-400 font-medium">
                {conversionRate}% conversion rate
              </div>
            </div>
          </div>

          {/* Campaign Info Card */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-foreground">Campaign Specification</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
              <div className="space-y-1">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5" /> Target Audience
                </span>
                <p className="font-semibold text-foreground">{campaign.targetAudience}</p>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> Objectives
                </span>
                <p className="font-semibold text-foreground">
                  {campaign.objectives || 'Increase sales discovery meetings'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Schedule Window
                </span>
                <p className="font-semibold text-foreground">
                  {campaign.startDate
                    ? format(parseISO(campaign.startDate), 'MMM d, yyyy')
                    : 'Ongoing'}{' '}
                  –{' '}
                  {campaign.endDate
                    ? format(parseISO(campaign.endDate), 'MMM d, yyyy')
                    : 'Continuous'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5" /> Allocated Budget
                </span>
                <p className="font-semibold text-foreground">
                  ${(campaign.budget || 5000).toLocaleString()} USD
                </p>
              </div>
            </div>
          </div>

          {/* Performance Daily Metrics Chart */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">Daily Cadence Performance</h3>
                <p className="text-2xs text-muted-foreground">
                  Daily tracking of delivery, opens, clicks, and commercial meeting conversions.
                </p>
              </div>
              <Badge variant="outline" className="text-3xs font-medium">
                Last 14 Days
              </Badge>
            </div>

            {campaign.dailyMetrics.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-border text-center">
                <Clock className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-xs font-medium text-foreground">No daily telemetry data yet</p>
                <p className="text-3xs text-muted-foreground">
                  Metrics will display as soon as the scheduled sequence triggers.
                </p>
              </div>
            ) : (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={campaign.dailyMetrics}
                    margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: 'currentColor' }}
                      className="text-muted-foreground"
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: 'currentColor' }}
                      className="text-muted-foreground"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        borderRadius: '0.5rem',
                        fontSize: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Line
                      type="monotone"
                      dataKey="delivered"
                      name="Delivered"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="opened"
                      name="Opened"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="clicked"
                      name="Clicked"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="converted"
                      name="Converted"
                      stroke="#f59e0b"
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ---------------------------------------------------------------------
            TAB 2: AUDIENCE
            --------------------------------------------------------------------- */}
        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Audience Criteria Card */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-foreground">Target Audience Profile</h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Segmentation Rule
                  </span>
                  <p className="mt-1 font-medium text-foreground">{campaign.targetAudience}</p>
                </div>

                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Total Enrolled Leads
                  </span>
                  <p className="mt-1 text-xl font-bold text-foreground">
                    {campaign.metrics.sent.toLocaleString()} contacts
                  </p>
                </div>

                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Channel Protocol
                  </span>
                  <div className="mt-1">{getChannelBadge(campaign.channel)}</div>
                </div>

                <div className="rounded-lg border border-border/80 bg-muted/40 p-3 space-y-1.5">
                  <span className="text-2xs font-semibold text-foreground flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-primary" />
                    AI Exclusion Guardrails
                  </span>
                  <p className="text-3xs text-muted-foreground leading-relaxed">
                    Automatically suppresses contacts engaged within the last 14 days, opt-outs, and conflicting internal customer accounts.
                  </p>
                </div>
              </div>
            </div>

            {/* Audience Breakdown by Industry / Segment */}
            <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-2xs">
              <h3 className="text-sm font-bold text-foreground">Audience Segment Performance</h3>
              <p className="text-2xs text-muted-foreground mb-4">
                Conversion yield analyzed across target industry sub-categories.
              </p>

              {campaign.audienceBreakdown.length === 0 ? (
                <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed border-border text-center">
                  <p className="text-xs text-muted-foreground">No segment breakdown available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {campaign.audienceBreakdown.map((item) => (
                    <div key={item.segment} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground">{item.segment}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground">
                            {item.count.toLocaleString()} leads ({item.percentage}%)
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-3xs font-semibold"
                          >
                            {item.conversionRate}% Conv
                          </Badge>
                        </div>
                      </div>
                      <Progress value={item.percentage} className="h-2 bg-muted" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ---------------------------------------------------------------------
            TAB 3: MESSAGES & SENT LOG
            --------------------------------------------------------------------- */}
        <TabsContent value="messages" className="space-y-6">
          {/* Message Template Preview */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">Active Message Template</h3>
                <p className="text-2xs text-muted-foreground">
                  Dynamic variables highlighted below are injected automatically per recipient context.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyTemplate}
                className="h-8 gap-1.5 text-xs"
              >
                {isCopiedTemplate ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Template</span>
                  </>
                )}
              </Button>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground">
              {campaign.messageTemplate || 'No message template configured for this campaign.'}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-2xs text-muted-foreground">
              <span className="font-semibold text-foreground">Supported Token Tags:</span>
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-primary font-mono text-3xs">
                &#123;&#123;first_name&#125;&#125;
              </span>
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-primary font-mono text-3xs">
                &#123;&#123;company&#125;&#125;
              </span>
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-primary font-mono text-3xs">
                &#123;&#123;link&#125;&#125;
              </span>
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-primary font-mono text-3xs">
                &#123;&#123;report_link&#125;&#125;
              </span>
            </div>
          </div>

          {/* Sent Messages Log Table */}
          <div className="rounded-xl border border-border bg-card shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-bold text-foreground">Recent Sent Messages Log</h3>
              <p className="text-2xs text-muted-foreground">
                Audit trail of outbox touchpoints and prospect engagement responses.
              </p>
            </div>

            {campaign.sentLog.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No outbound message logs recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                    <tr>
                      <th className="py-2.5 px-4 font-medium">Recipient</th>
                      <th className="py-2.5 px-4 font-medium">Contact Channel</th>
                      <th className="py-2.5 px-4 font-medium">Status</th>
                      <th className="py-2.5 px-4 font-medium">Dispatched</th>
                      <th className="py-2.5 px-4 font-medium">Outcome Snippet</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {campaign.sentLog.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 font-semibold text-foreground">
                          {log.recipientName}
                        </td>
                        <td className="py-3 px-4 font-mono text-3xs text-muted-foreground">
                          {log.recipientContact}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-3xs font-semibold capitalize',
                              log.status === 'converted' &&
                                'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                              log.status === 'clicked' &&
                                'border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400',
                              log.status === 'read' &&
                                'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400',
                              log.status === 'delivered' &&
                                'border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-400',
                              log.status === 'bounced' &&
                                'border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            )}
                          >
                            {log.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-3xs text-muted-foreground">
                          {log.sentAt}
                        </td>
                        <td className="py-3 px-4 text-xs text-muted-foreground truncate max-w-xs">
                          {log.responseSnippet || 'Delivered to inbox node'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ---------------------------------------------------------------------
            TAB 4: ANALYTICS & CONVERSION FUNNEL
            --------------------------------------------------------------------- */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Conversion Funnel */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-2xs">
              <h3 className="text-sm font-bold text-foreground">Conversion Drop-off Funnel</h3>
              <p className="text-2xs text-muted-foreground mb-4">
                Step-by-step retention from initial outreach send to closed conversion.
              </p>

              <div className="space-y-3">
                {campaign.funnelStages.map((stage, idx) => (
                  <div key={stage.stage} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-3xs font-bold text-primary">
                          {idx + 1}
                        </span>
                        {stage.stage}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">
                          {stage.count.toLocaleString()}
                        </span>
                        <span className="text-3xs text-muted-foreground">
                          ({stage.percentage}%)
                        </span>
                      </div>
                    </div>
                    <Progress value={stage.percentage} className="h-2 bg-muted" />
                  </div>
                ))}
              </div>
            </div>

            {/* Funnel Bar Chart */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-2xs">
              <h3 className="text-sm font-bold text-foreground">Funnel Stage Volume</h3>
              <p className="text-2xs text-muted-foreground mb-4">
                Comparative volume across funnel milestones.
              </p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={campaign.funnelStages}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis
                      dataKey="stage"
                      tick={{ fontSize: 10, fill: 'currentColor' }}
                      className="text-muted-foreground"
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: 'currentColor' }}
                      className="text-muted-foreground"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        borderRadius: '0.5rem',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* =========================================================================
          EDIT CAMPAIGN MODAL
          ========================================================================= */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Edit Campaign Details</DialogTitle>
            <DialogDescription className="text-xs">
              Update campaign objective metadata and target description.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Campaign Name</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Description</label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={2}
                className="resize-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Objectives</label>
              <Input
                value={editObjectives}
                onChange={(e) => setEditObjectives(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <DialogFooter className="mt-4 pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditDialogOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs font-semibold">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
