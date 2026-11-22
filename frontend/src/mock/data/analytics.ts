import { subDays, subMonths, format, formatISO } from 'date-fns';
import type {
  RevenueDataPoint,
  LeadAcquisitionDataPoint,
  ConversionFunnelStage,
  PipelineDistributionItem,
  CampaignPerformanceItem,
  AIAgentActivityItem,
  LeadSourcePerformanceItem,
  SalesRepPerformanceItem,
  DashboardKPIs,
} from '@/types';

// 1. Revenue Over Time (Last 12 Months: $50k - $200k range)
export const mockRevenueOverTime: RevenueDataPoint[] = [
  { month: 'Dec 2025', revenue: 62000, target: 55000, dealsCount: 6 },
  { month: 'Jan 2026', revenue: 74500, target: 70000, dealsCount: 8 },
  { month: 'Feb 2026', revenue: 89000, target: 80000, dealsCount: 9 },
  { month: 'Mar 2026', revenue: 104000, target: 95000, dealsCount: 11 },
  { month: 'Apr 2026', revenue: 118000, target: 110000, dealsCount: 13 },
  { month: 'May 2026', revenue: 132500, target: 125000, dealsCount: 15 },
  { month: 'Jun 2026', revenue: 147000, target: 140000, dealsCount: 16 },
  { month: 'Jul 2026', revenue: 139000, target: 145000, dealsCount: 14 },
  { month: 'Aug 2026', revenue: 156000, target: 150000, dealsCount: 17 },
  { month: 'Sep 2026', revenue: 168000, target: 160000, dealsCount: 18 },
  { month: 'Oct 2026', revenue: 184500, target: 175000, dealsCount: 20 },
  { month: 'Nov 2026', revenue: 198000, target: 185000, dealsCount: 22 },
];

// 2. Lead Acquisition by Source (Last 6 Months)
export const mockLeadAcquisition: LeadAcquisitionDataPoint[] = [
  {
    month: 'Jun 2026',
    website: 48,
    referral: 22,
    linkedin: 36,
    whatsapp: 28,
    campaign: 42,
    cold_outreach: 20,
  },
  {
    month: 'Jul 2026',
    website: 54,
    referral: 26,
    linkedin: 40,
    whatsapp: 32,
    campaign: 46,
    cold_outreach: 24,
  },
  {
    month: 'Aug 2026',
    website: 62,
    referral: 30,
    linkedin: 48,
    whatsapp: 38,
    campaign: 52,
    cold_outreach: 28,
  },
  {
    month: 'Sep 2026',
    website: 71,
    referral: 34,
    linkedin: 55,
    whatsapp: 45,
    campaign: 60,
    cold_outreach: 31,
  },
  {
    month: 'Oct 2026',
    website: 84,
    referral: 41,
    linkedin: 63,
    whatsapp: 54,
    campaign: 68,
    cold_outreach: 36,
  },
  {
    month: 'Nov 2026',
    website: 96,
    referral: 48,
    linkedin: 74,
    whatsapp: 62,
    campaign: 78,
    cold_outreach: 42,
  },
];

// 3. Conversion Funnel (Stages with counts & percentages)
export const mockConversionFunnel: ConversionFunnelStage[] = [
  { stage: 'Total Inbound & Sourced', count: 1250, conversionRate: 100, dropOffRate: 0 },
  { stage: 'Engaged & Contacted', count: 875, conversionRate: 70.0, dropOffRate: 30.0 },
  { stage: 'AI Qualified Leads', count: 520, conversionRate: 41.6, dropOffRate: 40.5 },
  { stage: 'Discovery Workshop Held', count: 290, conversionRate: 23.2, dropOffRate: 44.2 },
  { stage: 'Proposal / Solution Delivered', count: 165, conversionRate: 13.2, dropOffRate: 43.1 },
  { stage: 'Contract Negotiation', count: 98, conversionRate: 7.84, dropOffRate: 40.6 },
  { stage: 'Closed Won Enterprise Deal', count: 64, conversionRate: 5.12, dropOffRate: 34.7 },
];

// 4. Pipeline Distribution by Stage with total dollar value and counts
export const mockPipelineDistribution: PipelineDistributionItem[] = [
  { stage: 'New', count: 4, totalValue: 273000, percentage: 9.6 },
  { stage: 'Contacted', count: 6, totalValue: 417000, percentage: 14.7 },
  { stage: 'Qualified', count: 5, totalValue: 490000, percentage: 17.3 },
  { stage: 'Discovery', count: 4, totalValue: 660000, percentage: 23.3 },
  { stage: 'Proposal', count: 6, totalValue: 880000, percentage: 31.1 },
  { stage: 'Negotiation', count: 4, totalValue: 725000, percentage: 25.6 },
  { stage: 'Won', count: 3, totalValue: 580000, percentage: 20.5 },
  { stage: 'Lost', count: 2, totalValue: 53000, percentage: 1.9 },
];

// 5. Campaign Performance Metrics
export const mockCampaignPerformance: CampaignPerformanceItem[] = [
  {
    id: 'camp-001',
    name: 'Enterprise AI RevOps Benchmark Outreach',
    channel: 'Email',
    sent: 3420,
    opened: 1820,
    clicked: 684,
    converted: 94,
    roi: 480,
  },
  {
    id: 'camp-002',
    name: 'Luxury Real Estate VIP Concierge Invitation',
    channel: 'WhatsApp',
    sent: 1240,
    opened: 1115,
    clicked: 592,
    converted: 142,
    roi: 720,
  },
  {
    id: 'camp-003',
    name: 'Q3 FinTech Compliance & Automated Qualification',
    channel: 'Email',
    sent: 5800,
    opened: 2980,
    clicked: 1120,
    converted: 186,
    roi: 540,
  },
  {
    id: 'camp-004',
    name: 'Crypto & Web3 Growth Lead Sprint',
    channel: 'Telegram',
    sent: 890,
    opened: 540,
    clicked: 180,
    converted: 24,
    roi: 210,
  },
  {
    id: 'camp-008',
    name: 'Autumn Product Launch Live Webcast',
    channel: 'Web Chat',
    sent: 14200,
    opened: 6800,
    clicked: 3100,
    converted: 540,
    roi: 890,
  },
  {
    id: 'camp-006',
    name: 'Healthcare & Clinical Intake Modernization',
    channel: 'Email',
    sent: 2150,
    opened: 1240,
    clicked: 480,
    converted: 68,
    roi: 410,
  },
];

// 6. AI Agent Activity (Last 30 Days)
export const mockAIAgentActivity: AIAgentActivityItem[] = Array.from({ length: 30 }).map((_, i) => {
  const daysAgo = 29 - i;
  const dateStr = format(subDays(new Date(), daysAgo), 'MMM dd');
  // Generate realistic growing wave activity
  const baseFactor = 1 + i * 0.02;
  const variance = Math.sin(i * 0.8) * 15;
  return {
    date: dateStr,
    automatedReplies: Math.round(180 * baseFactor + variance),
    leadsQualified: Math.round(24 * baseFactor + (variance / 4)),
    tasksGenerated: Math.round(38 * baseFactor + (variance / 3)),
    researchCompleted: Math.round(16 * baseFactor + (variance / 5)),
  };
});

// 7. Lead Source Performance
export const mockLeadSourcePerformance: LeadSourcePerformanceItem[] = [
  {
    source: 'Website Inbound',
    leadsCount: 420,
    qualifiedCount: 235,
    wonCount: 38,
    conversionRate: 9.05,
    avgDealSize: 112000,
  },
  {
    source: 'Executive Referral',
    leadsCount: 165,
    qualifiedCount: 142,
    wonCount: 44,
    conversionRate: 26.67,
    avgDealSize: 168000,
  },
  {
    source: 'LinkedIn Social Selling',
    leadsCount: 310,
    qualifiedCount: 168,
    wonCount: 27,
    conversionRate: 8.71,
    avgDealSize: 128000,
  },
  {
    source: 'WhatsApp Concierge',
    leadsCount: 275,
    qualifiedCount: 180,
    wonCount: 36,
    conversionRate: 13.09,
    avgDealSize: 145000,
  },
  {
    source: 'Marketing Campaigns',
    leadsCount: 380,
    qualifiedCount: 195,
    wonCount: 29,
    conversionRate: 7.63,
    avgDealSize: 94000,
  },
  {
    source: 'Cold AI Outreach',
    leadsCount: 220,
    qualifiedCount: 92,
    wonCount: 14,
    conversionRate: 6.36,
    avgDealSize: 115000,
  },
];

// 8. Sales Rep Performance
export const mockSalesRepPerformance: SalesRepPerformanceItem[] = [
  {
    repId: 'user-003',
    name: 'Marcus Chen',
    avatar: 'MC',
    leadsAssigned: 46,
    dealsWon: 14,
    revenueClosed: 1420000,
    quotaAttainment: 118.3,
    avgCycleDays: 28,
  },
  {
    repId: 'user-002',
    name: 'Elena Rostova',
    avatar: 'ER',
    leadsAssigned: 28,
    dealsWon: 10,
    revenueClosed: 1180000,
    quotaAttainment: 124.2,
    avgCycleDays: 32,
  },
  {
    repId: 'user-004',
    name: 'Sarah Jenkins',
    avatar: 'SJ',
    leadsAssigned: 42,
    dealsWon: 9,
    revenueClosed: 895000,
    quotaAttainment: 99.4,
    avgCycleDays: 35,
  },
  {
    repId: 'user-005',
    name: 'David Kim',
    avatar: 'DK',
    leadsAssigned: 38,
    dealsWon: 6,
    revenueClosed: 540000,
    quotaAttainment: 90.0,
    avgCycleDays: 38,
  },
];

// 9. Dashboard KPIs
export const mockDashboardKPIs: DashboardKPIs = {
  totalRevenue: {
    value: 1980000,
    change: 18.4,
    isPositive: true,
  },
  activeLeads: {
    value: 342,
    change: 12.8,
    isPositive: true,
  },
  pipelineValue: {
    value: 3840000,
    change: 24.6,
    isPositive: true,
  },
  winRate: {
    value: 31.4,
    change: 4.2,
    isPositive: true,
  },
  avgDealSize: {
    value: 135000,
    change: 8.9,
    isPositive: true,
  },
  aiHoursSaved: {
    value: 1240,
    change: 34.2,
    isPositive: true,
  },
};
