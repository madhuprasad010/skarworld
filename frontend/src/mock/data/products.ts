import { subDays, formatISO } from 'date-fns';
import type { Product } from '@/types';

export const mockProducts: Product[] = [
  // 1. Software - Monthly / Annual
  {
    id: 'prod-001',
    name: 'SKAR Autonomous Sales Engine (Enterprise)',
    code: 'SKAR-ASE-ENT',
    category: 'Software',
    description: 'Enterprise autonomous revenue automation platform featuring multi-agent lead research, omnichannel conversational engagement, predictive scoring, and bidirectional CRM synchronization.',
    pricingModel: 'annual',
    basePrice: 75000,
    currency: 'USD',
    billingPeriod: 'per year',
    features: [
      'Autonomous multi-agent orchestration (Research, SDR, AE, Closer)',
      'Omnichannel support: WhatsApp Cloud, Telegram, Email, and Web Chat',
      'Unlimited leads and pipeline opportunity tracking',
      'Advanced predictive lead scoring with continuous calibration',
      'SOC2 Type II, HIPAA BAA compliance, and dedicated tenant isolation',
      'Real-time revenue intelligence dashboard and custom KPI builder',
    ],
    faq: [
      {
        question: 'How fast can an enterprise connect and go live?',
        answer: 'Standard onboarding takes 5-7 business days, including CRM mapping and communication channel verification.',
      },
      {
        question: 'Can we bring our own Anthropic or OpenAI API keys?',
        answer: 'Yes! You can either use our pre-optimized high-throughput LLM gateway or supply your own enterprise model keys.',
      },
    ],
    isActive: true,
    tenantId: 'tenant-001',
    createdAt: formatISO(subDays(new Date(), 120)),
    updatedAt: formatISO(subDays(new Date(), 10)),
  },

  // 2. Software - Per User
  {
    id: 'prod-002',
    name: 'SKAR Revenue OS — Growth Edition',
    code: 'SKAR-ROS-GROWTH',
    category: 'Software',
    description: 'Ideal for scaling B2B teams wanting AI-assisted inbound triage, conversational sales qualification, and automated meeting scheduling.',
    pricingModel: 'per_user',
    basePrice: 199,
    currency: 'USD',
    billingPeriod: 'per user / month',
    features: [
      'AI-assisted co-pilot for sales reps (real-time objection handling prompts)',
      'Up to 10,000 automated monthly conversations',
      'Integration with HubSpot, Salesforce, and Pipedrive',
      'Automated task generation and follow-up reminders',
      'Standard analytics and conversion funnel charts',
    ],
    faq: [
      {
        question: 'Is there a minimum seat requirement?',
        answer: 'Growth Edition starts at a minimum of 5 user seats billed annually or monthly.',
      },
      {
        question: 'Are WhatsApp messages included?',
        answer: 'Yes, up to 2,500 active customer conversations per month are included at no extra charge.',
      },
    ],
    isActive: true,
    tenantId: 'tenant-001',
    createdAt: formatISO(subDays(new Date(), 100)),
    updatedAt: formatISO(subDays(new Date(), 15)),
  },

  // 3. Software - Monthly
  {
    id: 'prod-003',
    name: 'SKAR Conversational Web Chat Widget & Lead Bot',
    code: 'SKAR-WIDGET-PRO',
    category: 'Software',
    description: 'Ultra-lightweight embeddable web chat widget that engages website visitors 24/7, answers questions via RAG, and converts traffic into qualified leads.',
    pricingModel: 'monthly',
    basePrice: 499,
    currency: 'USD',
    billingPeriod: 'per month',
    features: [
      'Sub-50ms lightweight script embed with zero performance penalty',
      'Full brand customization with dark/light theme switching',
      'Live website visitor tracking and intent-based trigger popups',
      'Automated calendar scheduling via Google Calendar & Outlook',
      'Instant human rep handoff with audio chime alerts',
    ],
    faq: [
      {
        question: 'Does the widget work with Single Page Apps (React/Next.js/Vue)?',
        answer: 'Yes, it provides a universal script tag and React SDK hook for effortless SPA integration.',
      },
    ],
    isActive: true,
    tenantId: 'tenant-001',
    createdAt: formatISO(subDays(new Date(), 90)),
    updatedAt: formatISO(subDays(new Date(), 8)),
  },

  // 4. Consulting - One Time
  {
    id: 'prod-004',
    name: 'RevOps Architecture & Funnel Optimization Audit',
    code: 'SRV-REVOPS-AUDIT',
    category: 'Consulting',
    description: 'Comprehensive 2-week strategic review of your enterprise revenue architecture, sales stages, qualification criteria, and automation bottlenecks.',
    pricingModel: 'one_time',
    basePrice: 15000,
    currency: 'USD',
    features: [
      'Full audit of sales pipeline conversion velocity across all stages',
      'Custom AI prompt engineering and qualification matrix design',
      'Data hygiene and CRM enrichment strategy blueprint',
      'Executive findings presentation and 60-day implementation roadmap',
    ],
    faq: [
      {
        question: 'Who conducts this audit?',
        answer: 'Our Senior RevOps Architects with prior leadership experience at high-growth enterprise SaaS firms.',
      },
    ],
    isActive: true,
    tenantId: 'tenant-001',
    createdAt: formatISO(subDays(new Date(), 110)),
    updatedAt: formatISO(subDays(new Date(), 20)),
  },

  // 5. Consulting - Monthly Retainer
  {
    id: 'prod-005',
    name: 'Fractional AI RevOps Director Advisory',
    code: 'SRV-FRAC-REVOPS',
    category: 'Consulting',
    description: 'Ongoing dedicated monthly advisory guiding enterprise sales leadership on autonomous workflows, AI guardrail calibration, and revenue forecasting.',
    pricingModel: 'monthly',
    basePrice: 8500,
    currency: 'USD',
    billingPeriod: 'per month',
    features: [
      'Weekly 60-minute executive review and strategy sprint',
      'Continuous prompt tuning and autonomous agent parameter tweaking',
      'Priority access to RevOps engineering squad',
      'Quarterly Board and CRO reporting pack generation',
    ],
    faq: [
      {
        question: 'What is the minimum contract commitment?',
        answer: 'Advisory packages are offered on a 3-month initial commitment, transitioning to month-to-month thereafter.',
      },
    ],
    isActive: true,
    tenantId: 'tenant-001',
    createdAt: formatISO(subDays(new Date(), 80)),
    updatedAt: formatISO(subDays(new Date(), 5)),
  },

  // 6. Custom Development - Custom
  {
    id: 'prod-006',
    name: 'Bespoke ERP & TMS Enterprise Connector Development',
    code: 'SRV-CUSTOM-INT',
    category: 'Custom Development',
    description: 'Dedicated engineering sprints to build secure, bidirectional real-time adapters between SKAR Revenue OS and proprietary legacy systems (SAP, NetSuite, custom TMS/HIS).',
    pricingModel: 'custom',
    basePrice: 25000,
    currency: 'USD',
    billingPeriod: 'per connector scope',
    features: [
      'Custom bidirectional API connectors and webhook listeners',
      'End-to-end sandbox testing and validation report',
      'Dedicated integration documentation and API schema definitions',
      'Production deployment assistance and zero-downtime rollover',
      '30 days post-launch hypercare monitoring',
    ],
    faq: [
      {
        question: 'How long does a custom connector take to build?',
        answer: 'Most standard legacy adapters are delivered and verified within 3-4 sprint weeks.',
      },
    ],
    isActive: true,
    tenantId: 'tenant-001',
    createdAt: formatISO(subDays(new Date(), 140)),
    updatedAt: formatISO(subDays(new Date(), 12)),
  },

  // 7. Custom Development - One Time
  {
    id: 'prod-007',
    name: 'Dedicated Private LLM Fine-Tuning & Knowledge Embedding',
    code: 'SRV-LLM-TUNE',
    category: 'Custom Development',
    description: 'Custom fine-tuning and domain-specific knowledge embedding of corporate sales playbooks, objection battlecards, and product catalogs into private vector indexes.',
    pricingModel: 'one_time',
    basePrice: 35000,
    currency: 'USD',
    features: [
      'Data preparation and cleaning of historic high-converting sales calls',
      'Domain fine-tuning with strict brand tone and compliance guardrails',
      'Custom vector database architecture (pgvector / Qdrant)',
      'Automated evaluation benchmark against ground-truth objection transcripts',
    ],
    faq: [
      {
        question: 'Will our proprietary data be shared or leak into public models?',
        answer: 'Never. Data is processed strictly in isolated tenant sandboxes with zero external model training guarantees.',
      },
    ],
    isActive: true,
    tenantId: 'tenant-001',
    createdAt: formatISO(subDays(new Date(), 75)),
    updatedAt: formatISO(subDays(new Date(), 14)),
  },

  // 8. Training - One Time
  {
    id: 'prod-008',
    name: 'Enterprise Sales Team AI Co-Pilot BootCamp',
    code: 'SRV-TRAIN-BOOTCAMP',
    category: 'Training',
    description: 'Intensive 3-day live virtual workshop training your SDRs, AEs, and sales managers on maximizing productivity with AI-driven co-pilot workflows.',
    pricingModel: 'one_time',
    basePrice: 6500,
    currency: 'USD',
    features: [
      'Interactive hands-on roleplay with AI customer personas',
      'Advanced prompt engineering for personalized outbound research',
      'Best practices for human-in-the-loop approval management',
      'Certification of completion for all participating reps',
    ],
    faq: [
      {
        question: 'How many attendees can participate per cohort?',
        answer: 'Each cohort is capped at 25 participants to guarantee personalized instructor feedback.',
      },
    ],
    isActive: true,
    tenantId: 'tenant-001',
    createdAt: formatISO(subDays(new Date(), 65)),
    updatedAt: formatISO(subDays(new Date(), 18)),
  },

  // 9. Training - Per User
  {
    id: 'prod-009',
    name: 'Self-Paced RevOps University & Certification Portal',
    code: 'SRV-TRAIN-UNIV',
    category: 'Training',
    description: 'On-demand video curriculum, interactive labs, and quarterly continuing education certifications for RevOps professionals.',
    pricingModel: 'per_user',
    basePrice: 49,
    currency: 'USD',
    billingPeriod: 'per user / month',
    features: [
      'Over 60 hours of video lessons and architecture blueprints',
      'Automated sandbox grading environment',
      'Access to private RevOps community Slack channel',
      'Verified digital LinkedIn credential badges upon course completion',
    ],
    faq: [
      {
        question: 'Can new team members access courses upon hiring?',
        answer: 'Yes, licenses can be reassigned between staff members as team composition changes.',
      },
    ],
    isActive: true,
    tenantId: 'tenant-001',
    createdAt: formatISO(subDays(new Date(), 50)),
    updatedAt: formatISO(subDays(new Date(), 10)),
  },

  // 10. Support - Monthly
  {
    id: 'prod-010',
    name: 'Mission Critical 24/7 Enterprise Platinum Support SLA',
    code: 'SRV-SUPP-PLAT',
    category: 'Support',
    description: 'Round-the-clock priority technical support with dedicated Technical Account Manager (TAM) and 15-minute emergency response guarantee.',
    pricingModel: 'monthly',
    basePrice: 3500,
    currency: 'USD',
    billingPeriod: 'per month',
    features: [
      '15-minute response SLA for Severity 1 outages',
      'Dedicated Slack/Teams shared channel directly with senior RevOps engineers',
      'Monthly uptime and response SLA audit reports',
      'Quarterly proactive architecture wellness reviews',
    ],
    faq: [
      {
        question: 'What is covered under Severity 1 incidents?',
        answer: 'Any outage affecting omnichannel message delivery or CRM sync queues triggers immediate engineer escalation.',
      },
    ],
    isActive: true,
    tenantId: 'tenant-001',
    createdAt: formatISO(subDays(new Date(), 95)),
    updatedAt: formatISO(subDays(new Date(), 4)),
  },

  // 11. Support - Annual
  {
    id: 'prod-011',
    name: 'Standard Business Hours Support & Maintenance',
    code: 'SRV-SUPP-STD',
    category: 'Support',
    description: 'Standard business hours ticketing support (8am - 8pm EST) with guaranteed 4-hour initial response time and software updates.',
    pricingModel: 'annual',
    basePrice: 12000,
    currency: 'USD',
    billingPeriod: 'per year',
    features: [
      'Email and ticketing support with 4-hour response SLA',
      'Access to knowledge base and developer API documentation',
      'Automatic software updates, minor releases, and security patches',
      'Standard business hours ticketing support',
    ],
    faq: [
      {
        question: 'Is this required for software license holders?',
        answer: 'Standard support is bundled with all Enterprise software subscriptions; this SKU is for custom on-prem deployments.',
      },
    ],
    isActive: true,
    tenantId: 'tenant-001',
    createdAt: formatISO(subDays(new Date(), 130)),
    updatedAt: formatISO(subDays(new Date(), 22)),
  },
];
