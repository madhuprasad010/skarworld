import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Download,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Bot,
  Zap,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Megaphone,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

// Indigo palette
const COLORS = {
  primary: '#4f46e5', // indigo-600
  primaryLight: '#818cf8', // indigo-400
  secondary: '#06b6d4', // cyan-500
  accent: '#10b981', // emerald-500
  warning: '#f59e0b', // amber-500
  destructive: '#ef4444', // red-500
  purple: '#8b5cf6', // purple-500
  slate: '#64748b',
};

const PIE_COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

// 1. Revenue Mock Data
const REVENUE_12_MONTHS = [
  { month: 'Apr 25', revenue: 68000, target: 60000, deals: 14 },
  { month: 'May 25', revenue: 74000, target: 65000, deals: 16 },
  { month: 'Jun 25', revenue: 82000, target: 70000, deals: 19 },
  { month: 'Jul 25', revenue: 89000, target: 80000, deals: 21 },
  { month: 'Aug 25', revenue: 95000, target: 85000, deals: 22 },
  { month: 'Sep 25', revenue: 108000, target: 95000, deals: 25 },
  { month: 'Oct 25', revenue: 116000, target: 100000, deals: 27 },
  { month: 'Nov 25', revenue: 128000, target: 110000, deals: 30 },
  { month: 'Dec 25', revenue: 142000, target: 120000, deals: 34 },
  { month: 'Jan 26', revenue: 156000, target: 135000, deals: 38 },
  { month: 'Feb 26', revenue: 171000, target: 150000, deals: 42 },
  { month: 'Mar 26', revenue: 189000, target: 165000, deals: 46 },
];

const REVENUE_BY_CATEGORY = [
  { category: 'Software (Core SaaS)', revenue: 98000, share: 52 },
  { category: 'Custom Development', revenue: 38000, share: 20 },
  { category: 'Consulting & Arch', revenue: 26000, share: 14 },
  { category: '24/7 SLA Support', revenue: 16000, share: 8 },
  { category: 'Training & Playbooks', revenue: 11000, share: 6 },
];

// 2. Leads Mock Data
const LEAD_ACQUISITION_TREND = [
  { month: 'Oct', website: 140, outbound: 95, whatsapp: 60, referral: 35 },
  { month: 'Nov', website: 165, outbound: 110, whatsapp: 85, referral: 42 },
  { month: 'Dec', website: 190, outbound: 130, whatsapp: 110, referral: 50 },
  { month: 'Jan', website: 220, outbound: 150, whatsapp: 135, referral: 58 },
  { month: 'Feb', website: 260, outbound: 180, whatsapp: 160, referral: 70 },
  { month: 'Mar', website: 310, outbound: 210, whatsapp: 195, referral: 85 },
];

const LEAD_SOURCE_DISTRIBUTION = [
  { name: 'Website Chat', value: 38 },
  { name: 'WhatsApp Direct', value: 24 },
  { name: 'Cold AI Outbound', value: 20 },
  { name: 'Partner Referrals', value: 12 },
  { name: 'Telegram Bot', value: 6 },
];

const CONVERSION_BY_SOURCE = [
  { source: 'Referral', rate: 34.2 },
  { source: 'WhatsApp', rate: 26.8 },
  { source: 'Website Chat', rate: 22.4 },
  { source: 'Telegram', rate: 19.5 },
  { source: 'Cold Outbound', rate: 14.8 },
];

const FUNNEL_STAGES = [
  { stage: 'Total Inbound Leads', count: 1200, dropOff: 0 },
  { stage: 'AI Qualified (BANT)', count: 780, dropOff: 35 },
  { stage: 'Discovery Call Held', count: 460, dropOff: 41 },
  { stage: 'Proposal Issued', count: 240, dropOff: 48 },
  { stage: 'Contract Negotiation', count: 130, dropOff: 46 },
  { stage: 'Closed Won', count: 88, dropOff: 32 },
];

// 3. Pipeline Mock Data
const PIPELINE_BY_STAGE = [
  { stage: 'Discovery', value: 420000, deals: 32 },
  { stage: 'Qualification', value: 310000, deals: 24 },
  { stage: 'Technical Demo', value: 280000, deals: 18 },
  { stage: 'Proposal Review', value: 390000, deals: 15 },
  { stage: 'Negotiation / Legal', value: 260000, deals: 9 },
];

const WIN_RATE_TREND = [
  { month: 'Oct', winRate: 21.5 },
  { month: 'Nov', winRate: 23.2 },
  { month: 'Dec', winRate: 24.8 },
  { month: 'Jan', winRate: 26.5 },
  { month: 'Feb', winRate: 28.1 },
  { month: 'Mar', winRate: 31.4 },
];

const STAGE_VELOCITY = [
  { stage: 'Lead to Discovery', avgDays: 1.8 },
  { stage: 'Discovery to Demo', avgDays: 4.2 },
  { stage: 'Demo to Proposal', avgDays: 3.5 },
  { stage: 'Proposal to Legal', avgDays: 6.8 },
  { stage: 'Legal to Closed Won', avgDays: 5.1 },
];

// 4. Team Leaderboard
const TEAM_MEMBERS_DATA = [
  {
    name: 'Elena Rostova',
    role: 'Head of Enterprise Sales',
    avatar: 'ER',
    leads: 184,
    opportunities: 42,
    revenue: 540000,
    conversionRate: 32.4,
  },
  {
    name: 'Marcus Chen',
    role: 'Sr Enterprise AE',
    avatar: 'MC',
    leads: 162,
    opportunities: 38,
    revenue: 465000,
    conversionRate: 29.8,
  },
  {
    name: 'Alex Rivera',
    role: 'VP Global Revenue',
    avatar: 'AR',
    leads: 120,
    opportunities: 31,
    revenue: 390000,
    conversionRate: 34.0,
  },
  {
    name: 'Sarah Jenkins',
    role: 'Mid-Market AE',
    avatar: 'SJ',
    leads: 145,
    opportunities: 29,
    revenue: 310000,
    conversionRate: 25.6,
  },
  {
    name: 'David Kim',
    role: 'Strategic SDR Specialist',
    avatar: 'DK',
    leads: 210,
    opportunities: 22,
    revenue: 185000,
    conversionRate: 21.2,
  },
];

// 5. Campaigns Mock Data
const CAMPAIGN_ROI_DATA = [
  { name: 'Fintech CRO Outbound', channel: 'Email + WhatsApp', sent: 3400, qualified: 184, pipeline: 480000, roi: 540 },
  { name: 'Series B SaaS Upgrade', channel: 'Email Sequence', sent: 2200, qualified: 130, pipeline: 310000, roi: 420 },
  { name: 'EU GDPR Migration Wave', channel: 'LinkedIn + Web', sent: 1800, qualified: 95, pipeline: 245000, roi: 360 },
  { name: 'Q1 AI Automation Re-engage', channel: 'WhatsApp Broadcast', sent: 1250, qualified: 82, pipeline: 190000, roi: 610 },
];

// 6. AI Performance Mock Data
const AI_ACTIONS_TIMELINE = [
  { day: 'Mon', actions: 1420, qualified: 86, takeovers: 7 },
  { day: 'Tue', actions: 1680, qualified: 104, takeovers: 9 },
  { day: 'Wed', actions: 1940, qualified: 128, takeovers: 11 },
  { day: 'Thu', actions: 1820, qualified: 115, takeovers: 8 },
  { day: 'Fri', actions: 1590, qualified: 96, takeovers: 6 },
  { day: 'Sat', actions: 840, qualified: 42, takeovers: 2 },
  { day: 'Sun', actions: 760, qualified: 38, takeovers: 1 },
];

export function AnalyticsPage() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('revenue');

  // Export CSV Handler
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Value,Target,Growth\n' +
      'Monthly Recurring Revenue,$189000,$165000,+28.4%\n' +
      'Pipeline Value,$1760000,$1500000,+17.3%\n' +
      'Win Rate,31.4%,25.0%,+4.9%\n' +
      'Average Deal Size,$41200,$35000,+17.7%\n' +
      'AI Lead Qualification Rate,65.0%,55.0%,+10.0%\n';

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `skarworld_revenue_analytics_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Analytics Exported',
      description: `Report downloaded as CSV for period (${dateRange}).`,
      variant: 'success',
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Analytics"
        description="Comprehensive revenue telemetry, conversion funnels, sales rep quotas, and AI copilot productivity metrics."
        icon={BarChart3}
        actions={
          <div className="flex items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px] h-9 text-xs">
                <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last quarter</SelectItem>
                <SelectItem value="ytd">Year to date</SelectItem>
                <SelectItem value="12m">Last 12 months</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="gap-1.5 text-xs h-9"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="border-b">
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full max-w-4xl h-auto p-1 bg-muted/60">
            <TabsTrigger value="revenue" className="text-xs">Revenue</TabsTrigger>
            <TabsTrigger value="leads" className="text-xs">Leads</TabsTrigger>
            <TabsTrigger value="pipeline" className="text-xs">Pipeline</TabsTrigger>
            <TabsTrigger value="team" className="text-xs">Team</TabsTrigger>
            <TabsTrigger value="campaigns" className="text-xs">Campaigns</TabsTrigger>
            <TabsTrigger value="ai" className="text-xs">AI Performance</TabsTrigger>
          </TabsList>
        </div>

        {/* 1. REVENUE TAB */}
        <TabsContent value="revenue" className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Monthly Recurring Revenue (MRR)</CardDescription>
                <CardTitle className="text-2xl font-bold text-foreground tracking-tight">$189,000</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-xs text-emerald-600 font-semibold gap-1">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span>+14.5% vs target ($165k)</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Annual Run Rate (ARR)</CardDescription>
                <CardTitle className="text-2xl font-bold text-foreground tracking-tight">$2,268,000</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-xs text-emerald-600 font-semibold gap-1">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span>+178% YoY Growth</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Average Contract Value (ACV)</CardDescription>
                <CardTitle className="text-2xl font-bold text-foreground tracking-tight">$41,200</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-xs text-emerald-600 font-semibold gap-1">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span>+$6,400 per customer</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Net Revenue Retention (NRR)</CardDescription>
                <CardTitle className="text-2xl font-bold text-foreground tracking-tight">138.4%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-xs text-emerald-600 font-semibold gap-1">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span>Top decile SaaS benchmark</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Over Time Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Revenue Growth vs Plan (Last 12 Months)</CardTitle>
              <CardDescription className="text-xs">
                Monthly recognized SaaS revenue against quarterly targets.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_12_MONTHS}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickFormatter={(val) => `$${val / 1000}k`}
                    />
                    <Tooltip
                      formatter={(val: any) => [`$${val.toLocaleString()}`, '']}
                      contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Recognized Revenue"
                      stroke={COLORS.primary}
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#revGrad)"
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      name="Executive Target"
                      stroke={COLORS.slate}
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Revenue by Product Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Revenue Distribution by Product Category</CardTitle>
              <CardDescription className="text-xs">
                Breakdown of active contract revenue generated across software tiers, consulting, and SLAs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={REVENUE_BY_CATEGORY} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `$${v / 1000}k`}
                    />
                    <YAxis dataKey="category" type="category" width={140} tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(val: any) => [`$${val.toLocaleString()}`, 'Revenue']}
                      contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                    />
                    <Bar dataKey="revenue" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. LEADS TAB */}
        <TabsContent value="leads" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lead Acquisition Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Lead Acquisition by Inbound Channel</CardTitle>
                <CardDescription className="text-xs">Monthly new qualified lead volumes across channels.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={LEAD_ACQUISITION_TREND}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      <Line type="monotone" dataKey="website" name="Web Chat" stroke={COLORS.primary} strokeWidth={2} />
                      <Line type="monotone" dataKey="whatsapp" name="WhatsApp" stroke={COLORS.accent} strokeWidth={2} />
                      <Line type="monotone" dataKey="outbound" name="AI Outbound" stroke={COLORS.secondary} strokeWidth={2} />
                      <Line type="monotone" dataKey="referral" name="Referrals" stroke={COLORS.warning} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Lead Source Pie */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Lead Source Volume Share (%)</CardTitle>
                <CardDescription className="text-xs">Relative contribution per omni-channel gateway.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={LEAD_SOURCE_DISTRIBUTION}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={95}
                        paddingAngle={4}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {LEAD_SOURCE_DISTRIBUTION.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: any) => [`${v}%`, 'Share']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conversion Rates & Waterfall Funnel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conversion by source */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Lead-to-Opportunity Conversion Rate (%)</CardTitle>
                <CardDescription className="text-xs">Lead qualification conversion efficiency by channel.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CONVERSION_BY_SOURCE}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="source" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                      <Tooltip formatter={(v: any) => [`${v}%`, 'Conversion Rate']} />
                      <Bar dataKey="rate" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Funnel drop-off */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Revenue Funnel Conversion & Drop-off</CardTitle>
                <CardDescription className="text-xs">Volume progression from lead capture to closed-won.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {FUNNEL_STAGES.map((stg, idx) => {
                  const pct = Math.round((stg.count / FUNNEL_STAGES[0].count) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">{stg.stage}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{stg.count} deals</span>
                          <span className="text-muted-foreground text-2xs">({pct}%)</span>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 3. PIPELINE TAB */}
        <TabsContent value="pipeline" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Total Active Pipeline</CardDescription>
                <CardTitle className="text-2xl font-bold text-foreground">$1,760,000</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-xs text-muted-foreground">98 active qualified opportunities</span>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Average Deal Size</CardDescription>
                <CardTitle className="text-2xl font-bold text-foreground">$41,200</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-xs text-emerald-600 font-medium">+18% increase Q3 vs Q2</span>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Overall Win Rate</CardDescription>
                <CardTitle className="text-2xl font-bold text-foreground">31.4%</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-xs text-emerald-600 font-medium">+5.2% vs industry average</span>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pipeline by stage */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Pipeline Value by Stage ($)</CardTitle>
                <CardDescription className="text-xs">Weighted open opportunity value across stages.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={PIPELINE_BY_STAGE}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="stage" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                      <Tooltip formatter={(v: any) => [`$${v.toLocaleString()}`, 'Pipeline Value']} />
                      <Bar dataKey="value" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Win rate trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Win Rate Trajectory (%)</CardTitle>
                <CardDescription className="text-xs">Monthly progression following AI objection assist deployment.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={WIN_RATE_TREND}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} domain={[15, 35]} tickFormatter={(v) => `${v}%`} />
                      <Tooltip formatter={(v: any) => [`${v}%`, 'Win Rate']} />
                      <Line type="monotone" dataKey="winRate" stroke={COLORS.accent} strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 4. TEAM TAB */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Sales Representative Quota & Performance Leaderboard</CardTitle>
              <CardDescription className="text-xs">Real-time revenue closed, active leads, and conversion efficiency.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b text-muted-foreground uppercase text-2xs font-semibold">
                    <tr>
                      <th className="pb-3">Representative</th>
                      <th className="pb-3">Leads Handled</th>
                      <th className="pb-3">Deals Created</th>
                      <th className="pb-3">Conversion Rate</th>
                      <th className="pb-3 text-right">Revenue Closed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {TEAM_MEMBERS_DATA.map((member, idx) => (
                      <tr key={idx} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 flex items-center gap-2.5">
                          <Avatar className="h-7 w-7 text-2xs">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {member.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-foreground">{member.name}</div>
                            <div className="text-2xs text-muted-foreground">{member.role}</div>
                          </div>
                        </td>
                        <td className="py-3 font-medium text-foreground">{member.leads}</td>
                        <td className="py-3 font-medium text-foreground">{member.opportunities}</td>
                        <td className="py-3">
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
                            {member.conversionRate}%
                          </span>
                        </td>
                        <td className="py-3 text-right font-bold text-foreground">
                          ${member.revenue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. CAMPAIGNS TAB */}
        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Outbound Campaign Performance & ROI</CardTitle>
              <CardDescription className="text-xs">
                Comprehensive pipeline and return on investment across multi-touch AI outreach sequences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b text-muted-foreground uppercase text-2xs font-semibold">
                    <tr>
                      <th className="pb-3">Campaign Name</th>
                      <th className="pb-3">Channel Strategy</th>
                      <th className="pb-3">Prospects Reached</th>
                      <th className="pb-3">Qualified Leads</th>
                      <th className="pb-3">Pipeline Value</th>
                      <th className="pb-3 text-right">Campaign ROI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {CAMPAIGN_ROI_DATA.map((camp, idx) => (
                      <tr key={idx} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 font-semibold text-foreground">{camp.name}</td>
                        <td className="py-3 text-muted-foreground">{camp.channel}</td>
                        <td className="py-3">{camp.sent.toLocaleString()}</td>
                        <td className="py-3 font-medium text-primary">{camp.qualified}</td>
                        <td className="py-3 font-semibold text-foreground">
                          ${camp.pipeline.toLocaleString()}
                        </td>
                        <td className="py-3 text-right">
                          <Badge variant="success" className="font-bold">
                            {camp.roi}% ROI
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 6. AI PERFORMANCE TAB */}
        <TabsContent value="ai" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">AI Autonomous Resolution Rate</CardDescription>
                <CardTitle className="text-2xl font-bold text-foreground">88.4%</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-xs text-muted-foreground">Inquiries resolved without human escalation</span>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Human Takeover Rate</CardDescription>
                <CardTitle className="text-2xl font-bold text-foreground">11.6%</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-xs text-muted-foreground">Escalated to senior AE for complex terms</span>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Avg Initial Response Latency</CardDescription>
                <CardTitle className="text-2xl font-bold text-foreground">2.4 sec</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-xs text-emerald-600 font-medium">99.8% under 5-second SLA</span>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Customer Satisfaction (CSAT)</CardDescription>
                <CardTitle className="text-2xl font-bold text-foreground">4.8 / 5.0</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-xs text-muted-foreground">Based on post-chat sentiment scoring</span>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Autonomous AI Actions & Workflows Executed per Day</CardTitle>
              <CardDescription className="text-xs">
                Daily volume of conversational messages, lead scoring updates, and calendar invites issued.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={AI_ACTIONS_TIMELINE}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="actions" name="Autonomous AI Actions" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="qualified" name="Leads Qualified" fill={COLORS.accent} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="takeovers" name="Human Escalations" fill={COLORS.warning} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AnalyticsPage;
