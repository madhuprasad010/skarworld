import { subDays, addDays, formatISO } from 'date-fns';
import type { Campaign, ChannelType, CampaignStatus } from '@/types';

export interface CampaignDailyMetric {
  date: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
}

export interface CampaignSentLogItem {
  id: string;
  recipientName: string;
  recipientContact: string;
  channel: ChannelType;
  status: 'sent' | 'delivered' | 'read' | 'clicked' | 'converted' | 'bounced';
  sentAt: string;
  responseSnippet?: string;
}

export interface DetailedCampaign extends Campaign {
  objectives?: string;
  messageTemplate?: string;
  dailyMetrics: CampaignDailyMetric[];
  sentLog: CampaignSentLogItem[];
  audienceBreakdown: {
    segment: string;
    count: number;
    percentage: number;
    conversionRate: number;
  }[];
  funnelStages: {
    stage: string;
    count: number;
    percentage: number;
  }[];
}

export const mockCampaigns: DetailedCampaign[] = [
  {
    id: 'camp-001',
    name: 'Q4 Enterprise Executive Outreach',
    description: 'Autonomous multi-touch cold engagement targeting VP/CTO decision makers across logistics and supply chain.',
    channel: 'email',
    status: 'active',
    targetAudience: 'Logistics & Supply Chain VPs, CTOs ($50M+ ARR)',
    objectives: 'Generate 40 qualified demo bookings for Q4 sales pipeline.',
    budget: 15000,
    startDate: formatISO(subDays(new Date(), 14)),
    endDate: formatISO(addDays(new Date(), 16)),
    tenantId: 'tenant-001',
    createdById: 'user-003',
    createdAt: formatISO(subDays(new Date(), 15)),
    updatedAt: formatISO(subDays(new Date(), 1)),
    messageTemplate: `Hi {{first_name}},\n\nI noticed {{company}} has expanded regional fleet hubs recently. Most logistics CTOs we speak with lose ~18% in delivery margin due to manual driver dispatch calls and missed ETA alerts.\n\nSKARWORLD REVENUE OS deploys autonomous voice and WhatsApp agents that triage dispatch communications in real-time with sub-300ms response times.\n\nWould you be open to a 10-minute preview of how we automated dispatch for Vanguard?\n\nBest regards,\nMarcus Chen\nVP Enterprise Growth, SKARWORLD`,
    metrics: {
      sent: 2450,
      delivered: 2380,
      opened: 1428,
      clicked: 684,
      converted: 112,
      bounceRate: 2.8,
      openRate: 60.0,
      clickRate: 28.7,
      conversionRate: 4.7,
    },
    dailyMetrics: [
      { date: 'Nov 08', sent: 180, delivered: 175, opened: 98, clicked: 44, converted: 8 },
      { date: 'Nov 09', sent: 210, delivered: 204, opened: 122, clicked: 58, converted: 10 },
      { date: 'Nov 10', sent: 195, delivered: 189, opened: 115, clicked: 51, converted: 9 },
      { date: 'Nov 11', sent: 230, delivered: 224, opened: 140, clicked: 69, converted: 12 },
      { date: 'Nov 12', sent: 220, delivered: 213, opened: 131, clicked: 62, converted: 11 },
      { date: 'Nov 13', sent: 240, delivered: 234, opened: 144, clicked: 72, converted: 14 },
      { date: 'Nov 14', sent: 215, delivered: 209, opened: 128, clicked: 60, converted: 9 },
      { date: 'Nov 15', sent: 250, delivered: 243, opened: 152, clicked: 77, converted: 13 },
      { date: 'Nov 16', sent: 205, delivered: 199, opened: 119, clicked: 54, converted: 8 },
      { date: 'Nov 17', sent: 260, delivered: 252, opened: 161, clicked: 81, converted: 15 },
      { date: 'Nov 18', sent: 245, delivered: 238, opened: 147, clicked: 70, converted: 12 },
    ],
    audienceBreakdown: [
      { segment: 'Third-Party Logistics (3PL)', count: 980, percentage: 40, conversionRate: 5.4 },
      { segment: 'Freight & Fleet Management', count: 735, percentage: 30, conversionRate: 4.8 },
      { segment: 'Cold Chain & Refrigerated', count: 490, percentage: 20, conversionRate: 3.9 },
      { segment: 'Warehouse Automation', count: 245, percentage: 10, conversionRate: 3.2 },
    ],
    funnelStages: [
      { stage: 'Sent', count: 2450, percentage: 100 },
      { stage: 'Delivered', count: 2380, percentage: 97.1 },
      { stage: 'Opened', count: 1428, percentage: 58.3 },
      { stage: 'Clicked', count: 684, percentage: 27.9 },
      { stage: 'Converted (Booked)', count: 112, percentage: 4.6 },
    ],
    sentLog: [
      {
        id: 'log-001',
        recipientName: 'Devon Vance',
        recipientContact: 'devon.vance@vanguardlogistics.com',
        channel: 'email',
        status: 'converted',
        sentAt: '2 hours ago',
        responseSnippet: 'Booked demo meeting via calendar embed.',
      },
      {
        id: 'log-002',
        recipientName: 'Claire Beaumont',
        recipientContact: 'claire@luminacloud.com',
        channel: 'email',
        status: 'clicked',
        sentAt: '3 hours ago',
        responseSnippet: 'Clicked architecture whitepaper download link.',
      },
      {
        id: 'log-003',
        recipientName: 'Robert Lang',
        recipientContact: 'rlang@apexsupply.io',
        channel: 'email',
        status: 'read',
        sentAt: '5 hours ago',
      },
      {
        id: 'log-004',
        recipientName: 'Michelle Wu',
        recipientContact: 'mwu@crossroadsfleet.com',
        channel: 'email',
        status: 'delivered',
        sentAt: '7 hours ago',
      },
      {
        id: 'log-005',
        recipientName: 'Arthur Pendelton',
        recipientContact: 'arthur@cobaltmedia.com',
        channel: 'email',
        status: 'bounced',
        sentAt: '9 hours ago',
        responseSnippet: 'Mailbox full or temporarily unreachable.',
      },
    ],
  },
  {
    id: 'camp-002',
    name: 'Healthcare AI Patient Reminders Blitz',
    description: 'High-conversion WhatsApp cadence for hospital patient engagement leaders and health network directors.',
    channel: 'whatsapp',
    status: 'active',
    targetAudience: 'Hospital Networks & Ambulatory Care Operations',
    objectives: 'Drive 25 pilot signups for outpatient conversational SMS/WhatsApp agents.',
    budget: 8500,
    startDate: formatISO(subDays(new Date(), 8)),
    endDate: formatISO(addDays(new Date(), 22)),
    tenantId: 'tenant-001',
    createdById: 'user-004',
    createdAt: formatISO(subDays(new Date(), 9)),
    updatedAt: formatISO(subDays(new Date(), 1)),
    messageTemplate: `Hi {{first_name}},\n\nNo-shows cost hospital networks over $150k per clinic every year. Apex Health reduced appointment no-shows by 42% in 60 days using SKARWORLD's HIPAA-compliant conversational WhatsApp assistant.\n\nWould you like a 3-minute video showing how patient scheduling integrates directly with Epic and Cerner?\n\nSarah Jenkins\nHealthcare Practice Lead, SKARWORLD`,
    metrics: {
      sent: 1820,
      delivered: 1790,
      opened: 1350,
      clicked: 540,
      converted: 88,
      bounceRate: 1.6,
      openRate: 74.2,
      clickRate: 29.7,
      conversionRate: 4.8,
    },
    dailyMetrics: [
      { date: 'Nov 14', sent: 220, delivered: 218, opened: 165, clicked: 66, converted: 11 },
      { date: 'Nov 15', sent: 260, delivered: 256, opened: 194, clicked: 78, converted: 13 },
      { date: 'Nov 16', sent: 240, delivered: 236, opened: 178, clicked: 72, converted: 12 },
      { date: 'Nov 17', sent: 280, delivered: 275, opened: 210, clicked: 84, converted: 14 },
      { date: 'Nov 18', sent: 300, delivered: 295, opened: 228, clicked: 92, converted: 15 },
    ],
    audienceBreakdown: [
      { segment: 'Ambulatory Care Centers', count: 728, percentage: 40, conversionRate: 5.6 },
      { segment: 'Multi-Specialty Health Networks', count: 546, percentage: 30, conversionRate: 4.9 },
      { segment: 'Diagnostic Imaging Groups', count: 364, percentage: 20, conversionRate: 4.1 },
      { segment: 'Private Surgical Clinics', count: 182, percentage: 10, conversionRate: 3.8 },
    ],
    funnelStages: [
      { stage: 'Sent', count: 1820, percentage: 100 },
      { stage: 'Delivered', count: 1790, percentage: 98.3 },
      { stage: 'Opened', count: 1350, percentage: 74.2 },
      { stage: 'Clicked', count: 540, percentage: 29.7 },
      { stage: 'Converted', count: 88, percentage: 4.8 },
    ],
    sentLog: [
      {
        id: 'log-101',
        recipientName: 'Amara Okonkwo',
        recipientContact: '+1 (617) 555-8910',
        channel: 'whatsapp',
        status: 'converted',
        sentAt: '1 hour ago',
        responseSnippet: 'Requested formal BAA and sandbox API keys.',
      },
      {
        id: 'log-102',
        recipientName: 'Dr. Gregory Vance',
        recipientContact: '+1 (312) 555-0199',
        channel: 'whatsapp',
        status: 'read',
        sentAt: '4 hours ago',
      },
    ],
  },
  {
    id: 'camp-003',
    name: 'FinTech Deal Flow Telegram Sourcing',
    description: 'Direct Telegram channel broadcast and 1-on-1 direct outreach for private equity and venture capital partners.',
    channel: 'telegram',
    status: 'paused',
    targetAudience: 'PE Associates & VC Deal Sourcing Leads',
    objectives: 'Drive investment memo automated ingestion pipeline onboarding.',
    budget: 6000,
    startDate: formatISO(subDays(new Date(), 20)),
    endDate: formatISO(subDays(new Date(), 2)),
    tenantId: 'tenant-001',
    createdById: 'user-003',
    createdAt: formatISO(subDays(new Date(), 21)),
    updatedAt: formatISO(subDays(new Date(), 2)),
    messageTemplate: `Hi {{first_name}},\n\nReviewing 100+ pitch decks a week? Our AI deal triage bot reads incoming PDFs, extracts cap tables and ARR growth rates, and drops instant 1-pagers directly into your Telegram workspace.\n\nTake a look at a 60-second walkthrough: {{link}}`,
    metrics: {
      sent: 950,
      delivered: 940,
      opened: 720,
      clicked: 310,
      converted: 45,
      bounceRate: 1.0,
      openRate: 75.8,
      clickRate: 32.6,
      conversionRate: 4.7,
    },
    dailyMetrics: [
      { date: 'Nov 02', sent: 150, delivered: 148, opened: 114, clicked: 49, converted: 7 },
      { date: 'Nov 03', sent: 200, delivered: 198, opened: 152, clicked: 65, converted: 10 },
      { date: 'Nov 04', sent: 220, delivered: 218, opened: 168, clicked: 72, converted: 11 },
      { date: 'Nov 05', sent: 180, delivered: 178, opened: 136, clicked: 58, converted: 8 },
      { date: 'Nov 06', sent: 200, delivered: 198, opened: 150, clicked: 66, converted: 9 },
    ],
    audienceBreakdown: [
      { segment: 'Growth Equity Funds', count: 475, percentage: 50, conversionRate: 5.2 },
      { segment: 'Early Stage VCs', count: 285, percentage: 30, conversionRate: 4.5 },
      { segment: 'Family Offices', count: 190, percentage: 20, conversionRate: 3.7 },
    ],
    funnelStages: [
      { stage: 'Sent', count: 950, percentage: 100 },
      { stage: 'Delivered', count: 940, percentage: 98.9 },
      { stage: 'Opened', count: 720, percentage: 75.8 },
      { stage: 'Clicked', count: 310, percentage: 32.6 },
      { stage: 'Converted', count: 45, percentage: 4.7 },
    ],
    sentLog: [
      {
        id: 'log-201',
        recipientName: 'Julian Thorne',
        recipientContact: '@julian_thorne_cap',
        channel: 'telegram',
        status: 'converted',
        sentAt: 'Yesterday',
        responseSnippet: 'Signed up for 25-seat license negotiation.',
      },
    ],
  },
  {
    id: 'camp-004',
    name: 'SaaS Inbound Demo Re-engagement',
    description: 'Multi-touch omnichannel follow-up for stale website demo requests and inactive trial users.',
    channel: 'web_chat',
    status: 'scheduled',
    targetAudience: 'Stalled inbound demos older than 30 days',
    objectives: 'Reactivate 15% of cold demo requests with new AI pricing models.',
    budget: 4500,
    startDate: formatISO(addDays(new Date(), 3)),
    endDate: formatISO(addDays(new Date(), 25)),
    tenantId: 'tenant-001',
    createdById: 'user-005',
    createdAt: formatISO(subDays(new Date(), 2)),
    updatedAt: formatISO(subDays(new Date(), 1)),
    messageTemplate: `Hi {{first_name}},\n\nWe recently rolled out our 2.0 release featuring autonomous negotiation copilots and instant WhatsApp voice agent provisioning.\n\nWe have credited your account with 5,000 free AI triage tokens. Would you like to reactivate your test workspace?\n\nDavid Kim\nSKARWORLD Operations`,
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
    audienceBreakdown: [
      { segment: 'High ACV Inbounds', count: 320, percentage: 45, conversionRate: 0 },
      { segment: 'Self-Serve Trials', count: 280, percentage: 40, conversionRate: 0 },
      { segment: 'Webinar Attendees', count: 110, percentage: 15, conversionRate: 0 },
    ],
    funnelStages: [
      { stage: 'Targeted Leads', count: 710, percentage: 100 },
      { stage: 'Scheduled for Send', count: 710, percentage: 100 },
    ],
    sentLog: [],
  },
  {
    id: 'camp-005',
    name: 'Q3 Enterprise AI Benchmark Report',
    description: 'Educational content asset distribution nurturing C-suite leaders with industry AI adoption trends.',
    channel: 'email',
    status: 'completed',
    targetAudience: 'Chief Revenue Officers & VPs of Sales',
    objectives: 'Distribute report to 5,000 contacts and qualify top 5% intent signals.',
    budget: 12000,
    startDate: formatISO(subDays(new Date(), 60)),
    endDate: formatISO(subDays(new Date(), 15)),
    tenantId: 'tenant-001',
    createdById: 'user-002',
    createdAt: formatISO(subDays(new Date(), 65)),
    updatedAt: formatISO(subDays(new Date(), 15)),
    messageTemplate: `Hi {{first_name}},\n\nWe just published our benchmark on How 250 Enterprise Sales Teams Use Autonomous AI in 2026.\n\nKey finding: Teams with real-time omnichannel AI triage close deals 3.4x faster.\n\nDownload the full 32-page report here: {{report_link}}`,
    metrics: {
      sent: 5120,
      delivered: 5010,
      opened: 3120,
      clicked: 1450,
      converted: 230,
      bounceRate: 2.1,
      openRate: 61.0,
      clickRate: 28.3,
      conversionRate: 4.5,
    },
    dailyMetrics: [
      { date: 'Oct 01', sent: 500, delivered: 490, opened: 300, clicked: 140, converted: 22 },
      { date: 'Oct 02', sent: 600, delivered: 588, opened: 366, clicked: 172, converted: 27 },
      { date: 'Oct 03', sent: 550, delivered: 538, opened: 332, clicked: 155, converted: 25 },
      { date: 'Oct 04', sent: 650, delivered: 636, opened: 395, clicked: 184, converted: 29 },
      { date: 'Oct 05', sent: 700, delivered: 686, opened: 425, clicked: 198, converted: 31 },
    ],
    audienceBreakdown: [
      { segment: 'Enterprise CROs ($100M+)', count: 2048, percentage: 40, conversionRate: 5.1 },
      { segment: 'VP of Sales ($25M-$100M)', count: 1792, percentage: 35, conversionRate: 4.6 },
      { segment: 'Head of RevOps', count: 1280, percentage: 25, conversionRate: 3.8 },
    ],
    funnelStages: [
      { stage: 'Sent', count: 5120, percentage: 100 },
      { stage: 'Delivered', count: 5010, percentage: 97.8 },
      { stage: 'Opened', count: 3120, percentage: 60.9 },
      { stage: 'Clicked', count: 1450, percentage: 28.3 },
      { stage: 'Converted', count: 230, percentage: 4.5 },
    ],
    sentLog: [],
  },
  {
    id: 'camp-006',
    name: 'Cold Outbound RevOps Series - Phase 2',
    description: 'Upcoming sequence focusing on revenue operations leaders looking to consolidate CRM tooling.',
    channel: 'email',
    status: 'draft',
    targetAudience: 'RevOps Directors at Series B-D startups',
    objectives: 'Establish baseline response rates across new messaging angles.',
    budget: 5000,
    startDate: formatISO(addDays(new Date(), 10)),
    endDate: formatISO(addDays(new Date(), 30)),
    tenantId: 'tenant-001',
    createdById: 'user-005',
    createdAt: formatISO(subDays(new Date(), 1)),
    updatedAt: formatISO(subDays(new Date(), 1)),
    messageTemplate: `Hi {{first_name}},\n\nQuick question: is {{company}} still managing separate tools for WhatsApp outreach, email sequencers, and pipeline forecasting?\n\nSKARWORLD consolidates your entire sales execution stack into a single autonomous revenue engine.\n\nWorth a quick look?`,
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
  },
];
