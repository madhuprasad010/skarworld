import { subDays, subHours, formatISO } from 'date-fns';
import type { IntegrationConfig } from '@/types';

export const mockIntegrations: IntegrationConfig[] = [
  // 1. WhatsApp Business (connected)
  {
    id: 'int-001',
    key: 'whatsapp_business',
    name: 'WhatsApp Business Cloud API',
    description: 'Official Meta WhatsApp Business Cloud API integration for automated customer qualification, templates, and 2-way real-time messaging.',
    category: 'communication',
    status: 'connected',
    icon: 'MessageSquare',
    lastSyncAt: formatISO(subMinutes(new Date(), 8)),
    isConfigured: true,
    config: {
      phoneNumberId: '109849201948571',
      wabaId: 'waba_991823746192',
      webhookUrl: 'https://api.skarworld.io/api/v1/webhooks/whatsapp',
      verifiedName: 'SKARWORLD REVENUE OS',
      templatesApproved: 14,
    },
  },

  // 2. Amazon SES (connected)
  {
    id: 'int-002',
    key: 'amazon_ses',
    name: 'Amazon Simple Email Service (SES)',
    description: 'High-deliverability enterprise transactional and sequence email infrastructure with dedicated IP pools and real-time bounce tracking.',
    category: 'email',
    status: 'connected',
    icon: 'Mail',
    lastSyncAt: formatISO(subMinutes(new Date(), 2)),
    isConfigured: true,
    config: {
      awsRegion: 'us-east-1',
      senderEmail: 'sales@skarworld.io',
      dkimVerified: true,
      spfVerified: true,
      dailyQuota: 50000,
      sendingRate: '14 emails/sec',
    },
  },

  // 3. Telegram (disconnected)
  {
    id: 'int-003',
    key: 'telegram_bot',
    name: 'Telegram Bot API',
    description: 'Fast conversational messaging channel for international prospects and Web3 communities with bot token authentication.',
    category: 'communication',
    status: 'disconnected',
    icon: 'Send',
    lastSyncAt: undefined,
    isConfigured: false,
    config: {
      botUsername: '',
      botToken: '',
      webhookEnabled: false,
    },
  },

  // 4. Website Chat (connected)
  {
    id: 'int-004',
    key: 'website_chat',
    name: 'SKAR Interactive Web Chat Widget',
    description: 'Real-time embeddable widget with proactive visitor triggers, intent detection, and instant AI qualification routing.',
    category: 'communication',
    status: 'connected',
    icon: 'Globe',
    lastSyncAt: formatISO(subMinutes(new Date(), 1)),
    isConfigured: true,
    config: {
      widgetId: 'wid_skar_live_88301',
      primaryColor: '#4f46e5',
      greetingMessage: 'Hello! Looking to scale revenue with autonomous sales agents? Ask me anything.',
      requireEmailBeforeChat: false,
      enableSoundAlerts: true,
    },
  },

  // 5. Anthropic Claude (connected)
  {
    id: 'int-005',
    key: 'anthropic_claude',
    name: 'Anthropic Claude (Sonnet 3.5)',
    description: 'Primary cognitive foundation model powering autonomous research, objection resolution, email drafting, and conversational nuance.',
    category: 'ai',
    status: 'connected',
    icon: 'Cpu',
    lastSyncAt: formatISO(subMinutes(new Date(), 5)),
    isConfigured: true,
    config: {
      model: 'claude-3-5-sonnet-20241022',
      maxOutputTokens: 8192,
      temperature: 0.2,
      zeroDataRetention: true,
      throughputMode: 'enterprise_priority',
    },
  },

  // 6. Tavily (connected)
  {
    id: 'int-006',
    key: 'tavily_search',
    name: 'Tavily Search API',
    description: 'AI-optimized deep web search engine used by the Prospect Research Agent to compile dossier intelligence, executive bios, and hiring trends.',
    category: 'search',
    status: 'connected',
    icon: 'Search',
    lastSyncAt: formatISO(subHours(new Date(), 1)),
    isConfigured: true,
    config: {
      searchDepth: 'advanced',
      includeRawContent: false,
      maxResultsPerQuery: 5,
      monthlyCreditsUsed: 1420,
    },
  },

  // 7. Brave Search (disconnected)
  {
    id: 'int-007',
    key: 'brave_search',
    name: 'Brave Search API',
    description: 'Independent privacy-first web index for secondary fallback research and real-time news extraction.',
    category: 'search',
    status: 'disconnected',
    icon: 'Shield',
    lastSyncAt: undefined,
    isConfigured: false,
    config: {
      apiKey: '',
      countryFilter: 'ALL',
      safesearch: 'moderate',
    },
  },

  // 8. Stripe (disconnected)
  {
    id: 'int-008',
    key: 'stripe_billing',
    name: 'Stripe Payments & Invoicing',
    description: 'Payment gateway for instant invoice generation, payment link checkout, subscription billing, and payment verification webhooks.',
    category: 'payment',
    status: 'disconnected',
    icon: 'CreditCard',
    lastSyncAt: undefined,
    isConfigured: false,
    config: {
      publishableKey: '',
      webhookSecret: '',
      enableAutomaticInvoicing: false,
    },
  },
];

// Helper to get subMinutes
function subMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() - minutes * 60000);
}
