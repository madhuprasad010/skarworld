import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Users,
  UserCheck,
  Target,
  TrendingUp,
  DollarSign,
  Sparkles,
  Clock,
  CalendarClock,
  ArrowRight,
  CheckCircle2,
  Phone,
  Mail,
  Video,
  FileText,
  AlertTriangle,
  Download,
  Filter,
  Check,
  Briefcase,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { KPICard } from '@/components/data-display/kpi-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { mockLeads } from '@/mock/data/leads';

// Theme color palette required
const CHART_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#a78bfa',
  '#c4b5fd',
  '#818cf8',
  '#6d28d9',
  '#4f46e5',
  '#4338ca',
];

// 12-Month Revenue Telemetry Mock Data
const revenueTrendData = [
  { month: 'Jan', totalRevenue: 340000, aiRevenue: 95000 },
  { month: 'Feb', totalRevenue: 385000, aiRevenue: 115000 },
  { month: 'Mar', totalRevenue: 420000, aiRevenue: 138000 },
  { month: 'Apr', totalRevenue: 460000, aiRevenue: 155000 },
  { month: 'May', totalRevenue: 510000, aiRevenue: 180000 },
  { month: 'Jun', totalRevenue: 575000, aiRevenue: 210000 },
  { month: 'Jul', totalRevenue: 620000, aiRevenue: 235000 },
  { month: 'Aug', totalRevenue: 680000, aiRevenue: 250000 },
  { month: 'Sep', totalRevenue: 735000, aiRevenue: 275000 },
  { month: 'Oct', totalRevenue: 790000, aiRevenue: 295000 },
  { month: 'Nov', totalRevenue: 820000, aiRevenue: 305000 },
  { month: 'Dec', totalRevenue: 847500, aiRevenue: 312000 },
];

// Lead Acquisition by Source Mock Data
const leadSourceData = [
  { source: 'Website', totalLeads: 425, qualifiedLeads: 185 },
  { source: 'LinkedIn', totalLeads: 310, qualifiedLeads: 130 },
  { source: 'Referral', totalLeads: 195, qualifiedLeads: 125 },
  { source: 'Outreach', totalLeads: 155, qualifiedLeads: 62 },
  { source: 'Campaigns', totalLeads: 110, qualifiedLeads: 45 },
  { source: 'WhatsApp', totalLeads: 85, qualifiedLeads: 38 },
];

// Sales Funnel Data
const salesFunnelData = [
  { stage: 'Captured', count: 1247, percentage: '100%', fill: '#6366f1' },
  { stage: 'Enriched', count: 980, percentage: '78.5%', fill: '#8b5cf6' },
  { stage: 'Qualified', count: 423, percentage: '33.9%', fill: '#a78bfa' },
  { stage: 'Discovery', count: 215, percentage: '17.2%', fill: '#818cf8' },
  { stage: 'Proposal', count: 89, percentage: '7.1%', fill: '#4f46e5' },
  { stage: 'Closed Won', count: 48, percentage: '3.8%', fill: '#4338ca' },
];

// Pipeline Distribution Donut Data
const pipelineDistributionData = [
  { name: 'Enterprise Tier', value: 345000, percentage: '40.7%' },
  { name: 'Mid-Market Core', value: 245000, percentage: '28.9%' },
  { name: 'Growth SMB', value: 138500, percentage: '16.3%' },
  { name: 'Account Expansion', value: 79000, percentage: '9.3%' },
  { name: 'Strategic Alliances', value: 40000, percentage: '4.8%' },
];

// Upcoming Follow-ups Mock Data
const upcomingFollowUps = [
  {
    id: 'task-1',
    leadName: 'Devon Vance',
    company: 'Vanguard Logistics',
    type: 'meeting',
    title: 'Executive Architecture Demo',
    time: 'Today, 2:30 PM',
    priority: 'urgent',
    completed: false,
  },
  {
    id: 'task-2',
    leadName: 'Liam Gallagher',
    company: 'Kestrel Wealth',
    type: 'call',
    title: 'Review SOC2 & SLA Contract Riders',
    time: 'Today, 4:00 PM',
    priority: 'high',
    completed: false,
  },
  {
    id: 'task-3',
    leadName: 'Amara Okonkwo',
    company: 'Apex Health Systems',
    type: 'email',
    title: 'Send Multi-Channel Workflow Proposal',
    time: 'Tomorrow, 9:30 AM',
    priority: 'high',
    completed: false,
  },
  {
    id: 'task-4',
    leadName: 'Sophia Zimmerman',
    company: 'Lumina Brands & Retail',
    type: 'meeting',
    title: 'Follow-up on WhatsApp Agent Pilot',
    time: 'Tomorrow, 11:00 AM',
    priority: 'medium',
    completed: false,
  },
  {
    id: 'task-5',
    leadName: 'Tariq Al-Mansoor',
    company: 'Finix Core Technologies',
    type: 'email',
    title: 'Send Enterprise Security Whitepaper',
    time: 'In 2 days',
    priority: 'medium',
    completed: false,
  },
];

// Pending Approvals Mock Data
const pendingApprovals = [
  {
    id: 'appr-1',
    type: '18% Discount Request',
    customer: 'Vanguard Logistics',
    leadContact: 'Devon Vance',
    value: 120000,
    requestedBy: 'Marcus Chen',
    status: 'pending',
  },
  {
    id: 'appr-2',
    type: 'Custom SLA & SOC2 Rider',
    customer: 'Kestrel Wealth Management',
    leadContact: 'Liam Gallagher',
    value: 145000,
    requestedBy: 'Sarah Jenkins',
    status: 'pending',
  },
  {
    id: 'appr-3',
    type: 'Multi-Year Contract Cap',
    customer: 'Apex Health Systems',
    leadContact: 'Amara Okonkwo',
    value: 185000,
    requestedBy: 'David Kim',
    status: 'pending',
  },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
  isCurrency?: boolean;
}

function CustomTooltip({ active, payload, label, isCurrency = true }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover/95 p-3 shadow-lg backdrop-blur-sm text-xs">
        <p className="font-semibold text-foreground mb-1.5">{label}</p>
        <div className="space-y-1">
          {payload.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground">{item.name}:</span>
              </div>
              <span className="font-mono font-medium text-foreground">
                {isCurrency ? formatCurrency(item.value) : formatNumber(item.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState('30d');
  const [followUps, setFollowUps] = useState(upcomingFollowUps);
  const [approvedItems, setApprovedItems] = useState<string[]>([]);

  // Take first 5 leads from mockLeads
  const recentLeads = mockLeads.slice(0, 5);

  const toggleTask = (id: string) => {
    setFollowUps((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleQuickApprove = (id: string) => {
    setApprovedItems((prev) => [...prev, id]);
  };

  const getSourceBadgeVariant = (source: string) => {
    switch (source.toLowerCase()) {
      case 'website':
        return 'indigo';
      case 'linkedin':
        return 'default';
      case 'referral':
        return 'success';
      case 'campaign':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'qualified':
        return 'success';
      case 'contacted':
        return 'indigo';
      case 'new':
        return 'default';
      case 'nurturing':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="h-3.5 w-3.5 text-blue-500" />;
      case 'email':
        return <Mail className="h-3.5 w-3.5 text-indigo-500" />;
      case 'meeting':
        return <Video className="h-3.5 w-3.5 text-purple-500" />;
      default:
        return <FileText className="h-3.5 w-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header with Date Range Filter and Telemetry Actions */}
      <PageHeader
        title="Executive Revenue Cockpit"
        description="Comprehensive AI pipeline telemetry, deal conversion velocity, and agent performance."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            {/* Live Indicator */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Live Engine Connected</span>
            </div>

            {/* Date Range Selector */}
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px] h-9 text-xs">
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">This Year</SelectItem>
              </SelectContent>
            </Select>

            {/* Export Report Button */}
            <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs">
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export Report</span>
            </Button>
          </div>
        }
      />

      {/* KPI Row (8 cards in 2 rows of 4 on desktop, 2 columns on mobile/tablet) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Leads"
          value="1,247"
          change={12.5}
          changeLabel="vs last month"
          icon={Users}
        />
        <KPICard
          title="Qualified Leads"
          value="423"
          change={8.3}
          changeLabel="vs last month"
          icon={UserCheck}
        />
        <KPICard
          title="Active Opportunities"
          value="89"
          change={15.2}
          changeLabel="vs last month"
          icon={Target}
        />
        <KPICard
          title="Conversion Rate"
          value="34.2%"
          change={2.1}
          changeLabel="vs last month"
          icon={TrendingUp}
        />
        <KPICard
          title="Total Revenue"
          value="$847,500"
          change={22.4}
          changeLabel="vs last month"
          icon={DollarSign}
        />
        <KPICard
          title="AI-Assisted Revenue"
          value="$312,000"
          change={45.6}
          changeLabel="vs last month"
          icon={Sparkles}
        />
        <KPICard
          title="Pending Approvals"
          value="7"
          change={-25.0}
          changeLabel="backlog decrease"
          icon={Clock}
        />
        <KPICard
          title="Follow-ups Due"
          value="23"
          change={5.0}
          changeLabel="scheduled today"
          icon={CalendarClock}
        />
      </section>

      {/* Charts Section (2x2 Grid) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Revenue Over Time (Area Chart) */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Revenue Over Time</CardTitle>
              <CardDescription className="text-xs">
                12-month trajectory showing total enterprise vs AI-assisted revenue
              </CardDescription>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span>Total</span>
              <span className="h-2 w-2 rounded-full bg-[#8b5cf6] ml-2" />
              <span>AI Assisted</span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueTrendData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTotalRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorAiRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.7 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val: number) => `$${val / 1000}k`}
                    tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.7 }}
                    width={50}
                  />
                  <Tooltip
                    content={<CustomTooltip isCurrency={true} />}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalRevenue"
                    name="Total Revenue"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTotalRevenue)"
                  />
                  <Area
                    type="monotone"
                    dataKey="aiRevenue"
                    name="AI-Assisted"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAiRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Lead Acquisition by Source (Bar Chart) */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Lead Acquisition by Source</CardTitle>
              <CardDescription className="text-xs">
                Top conversion channels comparing gross inbound vs AI qualified leads
              </CardDescription>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-[#6366f1]" />
              <span>Total</span>
              <span className="h-2 w-2 rounded-full bg-[#8b5cf6] ml-2" />
              <span>Qualified</span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={leadSourceData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis
                    dataKey="source"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.7 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.7 }}
                    width={40}
                  />
                  <Tooltip content={<CustomTooltip isCurrency={false} />} />
                  <Bar
                    dataKey="totalLeads"
                    name="Total Captured"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="qualifiedLeads"
                    name="AI Qualified"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 3: Sales Funnel (Horizontal Stage Progression) */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Sales Funnel Conversion</CardTitle>
              <CardDescription className="text-xs">
                Step-by-step conversion throughput from initial capture to closed deals
              </CardDescription>
            </div>
            <Badge variant="indigo" size="sm">
              34.2% Net Conv.
            </Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={salesFunnelData}
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
                  <XAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.7 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="stage"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.8 }}
                  />
                  <Tooltip
                    formatter={(val: number) => [`${formatNumber(val)} Prospects`, 'Volume']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                    }}
                  />
                  <Bar dataKey="count" name="Count" radius={[0, 4, 4, 0]}>
                    {salesFunnelData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 4: Pipeline Distribution (Donut Chart) */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Pipeline Distribution</CardTitle>
              <CardDescription className="text-xs">
                Value breakdown across customer tiers and target market segments
              </CardDescription>
            </div>
            <span className="text-xs font-mono font-semibold text-primary">
              $847.5K Total
            </span>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), 'Pipeline Value']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                    }}
                  />
                  <Pie
                    data={pipelineDistributionData}
                    cx="50%"
                    cy="45%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pipelineDistributionData.map((_entry, index) => (
                      <Cell
                        key={`cell-donut-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Activity Section (Recent Leads, Upcoming Follow-ups, Pending Approvals) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity 1: Recent Leads */}
        <Card className="shadow-sm flex flex-col justify-between">
          <div>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">Recent Leads</CardTitle>
                <CardDescription className="text-xs">
                  Latest prospects captured by inbound & AI agents
                </CardDescription>
              </div>
              <Link
                to="/leads"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[11px] h-8">Lead / Company</TableHead>
                    <TableHead className="text-[11px] h-8">Source</TableHead>
                    <TableHead className="text-[11px] h-8 text-right">Score</TableHead>
                    <TableHead className="text-[11px] h-8 text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentLeads.map((lead) => (
                    <TableRow key={lead.id} className="text-xs">
                      <TableCell className="py-2.5 font-medium">
                        <div className="flex flex-col">
                          <span className="text-foreground font-semibold truncate max-w-[120px]">
                            {lead.fullName}
                          </span>
                          <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                            {lead.company}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <Badge
                          variant={getSourceBadgeVariant(lead.source)}
                          size="sm"
                          className="capitalize"
                        >
                          {lead.source}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2.5 text-right font-mono font-semibold">
                        <span
                          className={
                            (lead.leadScore ?? 0) >= 90
                              ? 'text-emerald-500 font-bold'
                              : (lead.leadScore ?? 0) >= 80
                              ? 'text-indigo-500'
                              : 'text-amber-500'
                          }
                        >
                          {lead.leadScore ?? 0}
                        </span>
                      </TableCell>
                      <TableCell className="py-2.5 text-right">
                        <Badge
                          variant={getStatusBadgeVariant(lead.status)}
                          size="sm"
                          className="capitalize"
                        >
                          {lead.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </div>
        </Card>

        {/* Activity 2: Upcoming Follow-ups */}
        <Card className="shadow-sm flex flex-col justify-between">
          <div>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">Upcoming Follow-ups</CardTitle>
                <CardDescription className="text-xs">
                  Critical agent & rep touchpoints scheduled next
                </CardDescription>
              </div>
              <Link
                to="/tasks"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>

            <CardContent className="space-y-3 pt-1">
              {followUps.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-start justify-between gap-3 p-2.5 rounded-lg border transition-colors ${
                    task.completed
                      ? 'bg-muted/40 border-border/50 opacity-60'
                      : 'bg-card border-border hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-start gap-2.5 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                        task.completed
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-muted-foreground/40 hover:border-primary'
                      }`}
                      aria-label="Toggle task completed"
                    >
                      {task.completed && <Check className="h-3 w-3 stroke-[3]" />}
                    </button>
                    <div className="overflow-hidden">
                      <p
                        className={`text-xs font-medium truncate ${
                          task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          {getTaskIcon(task.type)}
                          <span className="truncate max-w-[110px]">{task.leadName}</span>
                        </span>
                        <span>•</span>
                        <span className="font-mono text-[10px]">{task.time}</span>
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant={
                      task.priority === 'urgent'
                        ? 'destructive'
                        : task.priority === 'high'
                        ? 'warning'
                        : 'secondary'
                    }
                    size="sm"
                    className="capitalize shrink-0"
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </div>
        </Card>

        {/* Activity 3: Pending Approvals */}
        <Card className="shadow-sm flex flex-col justify-between">
          <div>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">Pending Approvals</CardTitle>
                <CardDescription className="text-xs">
                  High-value proposals awaiting manager sign-off
                </CardDescription>
              </div>
              <Link
                to="/approvals"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>

            <CardContent className="space-y-3 pt-1">
              {pendingApprovals.map((appr) => {
                const isApproved = approvedItems.includes(appr.id);
                return (
                  <div
                    key={appr.id}
                    className="flex flex-col gap-2 p-3 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-semibold text-foreground">
                          {appr.type}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                          <Briefcase className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium text-foreground">{appr.customer}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-primary">
                        {formatCurrency(appr.value)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-border/60 text-[11px] text-muted-foreground">
                      <span>Req: {appr.requestedBy}</span>
                      {isApproved ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Approved</span>
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="subtle"
                            size="sm"
                            onClick={() => handleQuickApprove(appr.id)}
                            className="h-6 px-2 text-[11px] font-medium"
                          >
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </div>
        </Card>
      </section>
    </div>
  );
}
