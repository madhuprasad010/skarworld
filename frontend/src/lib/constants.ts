import {
  LayoutDashboard,
  Users,
  Kanban,
  MessageSquare,
  Megaphone,
  ShieldCheck,
  CheckSquare,
  Package,
  Search,
  BarChart3,
  Bot,
  Plug2,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import type {
  Role,
  LeadStatus,
  PipelineStage,
  ApprovalType,
  ApprovalStatus,
  Channel,
  TaskPriority,
  TaskStatus,
} from '@/types';

export const APP_NAME = 'SKARWORLD REVENUE OS';
export const APP_DESCRIPTION = 'Multi-tenant AI-Powered Sales & Revenue Automation Platform';
export const APP_VERSION = '1.0.0';

// =============================================================================
// NAVIGATION STRUCTURE
// =============================================================================

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  group: 'Core' | 'Growth' | 'Intelligence' | 'Settings';
  badge?: string;
  roles?: Role[];
}

export const NAVIGATION_ITEMS: NavItem[] = [
  // Core Group
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    group: 'Core',
  },
  {
    title: 'Leads',
    href: '/leads',
    icon: Users,
    group: 'Core',
  },
  {
    title: 'Pipeline',
    href: '/pipeline',
    icon: Kanban,
    group: 'Core',
  },
  {
    title: 'Conversations',
    href: '/conversations',
    icon: MessageSquare,
    group: 'Core',
  },

  // Growth & Execution Group
  {
    title: 'Campaigns',
    href: '/campaigns',
    icon: Megaphone,
    group: 'Growth',
  },
  {
    title: 'Approvals',
    href: '/approvals',
    icon: ShieldCheck,
    group: 'Growth',
  },
  {
    title: 'Tasks',
    href: '/tasks',
    icon: CheckSquare,
    group: 'Growth',
  },
  {
    title: 'Products',
    href: '/products',
    icon: Package,
    group: 'Growth',
  },
  {
    title: 'AI Research',
    href: '/research',
    icon: Search,
    group: 'Growth',
  },

  // Intelligence & Settings
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    group: 'Intelligence',
  },
  {
    title: 'AI Agents',
    href: '/ai-config',
    icon: Bot,
    group: 'Intelligence',
  },
  {
    title: 'Integrations',
    href: '/integrations',
    icon: Plug2,
    group: 'Settings',
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    group: 'Settings',
  },
];

// =============================================================================
// LEAD STATUSES
// =============================================================================

export interface LeadStatusConfig {
  value: LeadStatus;
  label: string;
  color: string;
  badgeClass: string;
}

export const LEAD_STATUSES: Record<string, LeadStatusConfig> = {
  NEW: {
    value: 'NEW',
    label: 'New Lead',
    color: '#3B82F6',
    badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  },
  CONTACTED: {
    value: 'CONTACTED',
    label: 'Contacted',
    color: '#8B5CF6',
    badgeClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  },
  QUALIFIED: {
    value: 'QUALIFIED',
    label: 'Qualified',
    color: '#10B981',
    badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  },
  ENGAGED: {
    value: 'ENGAGED',
    label: 'Engaged',
    color: '#06B6D4',
    badgeClass: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
  },
  PROPOSAL_SENT: {
    value: 'PROPOSAL_SENT',
    label: 'Proposal Sent',
    color: '#F59E0B',
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  },
  NEGOTIATING: {
    value: 'NEGOTIATING',
    label: 'Negotiating',
    color: '#EC4899',
    badgeClass: 'bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300 border-pink-200 dark:border-pink-800',
  },
  CONVERTED: {
    value: 'CONVERTED',
    label: 'Converted',
    color: '#059669',
    badgeClass: 'bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300 border-green-200 dark:border-green-800',
  },
  UNQUALIFIED: {
    value: 'UNQUALIFIED',
    label: 'Unqualified',
    color: '#6B7280',
    badgeClass: 'bg-gray-50 text-gray-700 dark:bg-gray-900/50 dark:text-gray-400 border-gray-200 dark:border-gray-800',
  },
  LOST: {
    value: 'LOST',
    label: 'Lost',
    color: '#EF4444',
    badgeClass: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border-red-200 dark:border-red-800',
  },
};

// =============================================================================
// PIPELINE STAGES
// =============================================================================

export interface PipelineStageDefinition {
  id: PipelineStage;
  name: string;
  order: number;
  probability: number;
  color: string;
  description: string;
}

export const PIPELINE_STAGES: PipelineStageDefinition[] = [
  {
    id: 'LEAD',
    name: 'Lead In',
    order: 1,
    probability: 10,
    color: '#94A3B8',
    description: 'Initial prospective lead identified',
  },
  {
    id: 'DISCOVERY',
    name: 'Discovery',
    order: 2,
    probability: 25,
    color: '#60A5FA',
    description: 'Discovery call and requirements gathering',
  },
  {
    id: 'QUALIFICATION',
    name: 'Qualification',
    order: 3,
    probability: 40,
    color: '#818CF8',
    description: 'BANT criteria verified and budget established',
  },
  {
    id: 'PROPOSAL',
    name: 'Proposal',
    order: 4,
    probability: 60,
    color: '#A78BFA',
    description: 'Custom proposal and pricing presented',
  },
  {
    id: 'NEGOTIATION',
    name: 'Negotiation',
    order: 5,
    probability: 80,
    color: '#F472B6',
    description: 'Terms and contractual negotiations underway',
  },
  {
    id: 'CLOSED_WON',
    name: 'Closed Won',
    order: 6,
    probability: 100,
    color: '#10B981',
    description: 'Deal closed and contract signed successfully',
  },
  {
    id: 'CLOSED_LOST',
    name: 'Closed Lost',
    order: 7,
    probability: 0,
    color: '#EF4444',
    description: 'Opportunity abandoned or lost to competition',
  },
];

// =============================================================================
// APPROVAL TYPES & STATUSES
// =============================================================================

export interface ApprovalTypeConfig {
  value: ApprovalType;
  label: string;
  description: string;
}

export const APPROVAL_TYPES: Record<string, ApprovalTypeConfig> = {
  DISCOUNT: {
    value: 'DISCOUNT',
    label: 'Special Discount',
    description: 'Request for pricing discount exceeding standard authority limit',
  },
  CONTRACT_TERMS: {
    value: 'CONTRACT_TERMS',
    label: 'Contract Terms',
    description: 'Custom SLA or legal term adjustments',
  },
  CUSTOM_PROPOSAL: {
    value: 'CUSTOM_PROPOSAL',
    label: 'Custom Proposal',
    description: 'Non-standard product bundling or custom deliverables',
  },
  CAMPAIGN_LAUNCH: {
    value: 'CAMPAIGN_LAUNCH',
    label: 'Campaign Launch',
    description: 'Outbound campaign activation exceeding budget threshold',
  },
  AGENT_ACTION: {
    value: 'AGENT_ACTION',
    label: 'AI Agent Action',
    description: 'Autonomous action requiring human-in-the-loop sign-off',
  },
  REFUND: {
    value: 'REFUND',
    label: 'Refund Request',
    description: 'Customer credit or payment refund processing',
  },
};

export interface ApprovalStatusConfig {
  value: ApprovalStatus;
  label: string;
  color: string;
  badgeClass: string;
}

export const APPROVAL_STATUSES: Record<string, ApprovalStatusConfig> = {
  PENDING: {
    value: 'PENDING',
    label: 'Pending Review',
    color: '#F59E0B',
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  },
  APPROVED: {
    value: 'APPROVED',
    label: 'Approved',
    color: '#10B981',
    badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  },
  REJECTED: {
    value: 'REJECTED',
    label: 'Rejected',
    color: '#EF4444',
    badgeClass: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border-red-200 dark:border-red-800',
  },
  EXPIRED: {
    value: 'EXPIRED',
    label: 'Expired',
    color: '#6B7280',
    badgeClass: 'bg-gray-50 text-gray-700 dark:bg-gray-900/50 dark:text-gray-400 border-gray-200 dark:border-gray-800',
  },
  CANCELLED: {
    value: 'CANCELLED',
    label: 'Cancelled',
    color: '#9CA3AF',
    badgeClass: 'bg-gray-50 text-gray-600 dark:bg-gray-900/50 dark:text-gray-400 border-gray-200 dark:border-gray-800',
  },
};

// =============================================================================
// CHANNELS
// =============================================================================

export interface ChannelConfig {
  id: Channel;
  label: string;
  color: string;
  bgLight: string;
  badgeClass: string;
}

export const CHANNELS: Record<string, ChannelConfig> = {
  whatsapp: {
    id: 'whatsapp',
    label: 'WhatsApp',
    color: '#25D366',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/30',
    badgeClass: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-950/50 dark:border-emerald-800',
  },
  email: {
    id: 'email',
    label: 'Email',
    color: '#3B82F6',
    bgLight: 'bg-blue-50 dark:bg-blue-950/30',
    badgeClass: 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-950/50 dark:border-blue-800',
  },
  telegram: {
    id: 'telegram',
    label: 'Telegram',
    color: '#0088CC',
    bgLight: 'bg-sky-50 dark:bg-sky-950/30',
    badgeClass: 'text-sky-700 bg-sky-50 border-sky-200 dark:text-sky-300 dark:bg-sky-950/50 dark:border-sky-800',
  },
  web: {
    id: 'web',
    label: 'Web Widget',
    color: '#6366F1',
    bgLight: 'bg-indigo-50 dark:bg-indigo-950/30',
    badgeClass: 'text-indigo-700 bg-indigo-50 border-indigo-200 dark:text-indigo-300 dark:bg-indigo-950/50 dark:border-indigo-800',
  },
  linkedin: {
    id: 'linkedin',
    label: 'LinkedIn',
    color: '#0A66C2',
    bgLight: 'bg-blue-50 dark:bg-blue-950/30',
    badgeClass: 'text-blue-800 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-950/50 dark:border-blue-800',
  },
  sms: {
    id: 'sms',
    label: 'SMS',
    color: '#8B5CF6',
    bgLight: 'bg-purple-50 dark:bg-purple-950/30',
    badgeClass: 'text-purple-700 bg-purple-50 border-purple-200 dark:text-purple-300 dark:bg-purple-950/50 dark:border-purple-800',
  },
};

// =============================================================================
// PRIORITY LEVELS
// =============================================================================

export interface PriorityConfig {
  value: TaskPriority;
  label: string;
  color: string;
  badgeClass: string;
}

export const PRIORITIES: Record<string, PriorityConfig> = {
  LOW: {
    value: 'LOW',
    label: 'Low',
    color: '#6B7280',
    badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  },
  MEDIUM: {
    value: 'MEDIUM',
    label: 'Medium',
    color: '#3B82F6',
    badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  },
  HIGH: {
    value: 'HIGH',
    label: 'High',
    color: '#F59E0B',
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  },
  URGENT: {
    value: 'URGENT',
    label: 'Urgent',
    color: '#EF4444',
    badgeClass: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border-red-200 dark:border-red-800 font-semibold',
  },
};

// =============================================================================
// TASK STATUSES
// =============================================================================

export interface TaskStatusConfig {
  value: TaskStatus;
  label: string;
  badgeClass: string;
}

export const TASK_STATUSES: Record<string, TaskStatusConfig> = {
  TODO: {
    value: 'TODO',
    label: 'To Do',
    badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
  IN_PROGRESS: {
    value: 'IN_PROGRESS',
    label: 'In Progress',
    badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
  },
  COMPLETED: {
    value: 'COMPLETED',
    label: 'Completed',
    badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
  },
  CANCELLED: {
    value: 'CANCELLED',
    label: 'Cancelled',
    badgeClass: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
  },
};

// =============================================================================
// ROLE DEFINITIONS
// =============================================================================

export interface RoleConfig {
  value: Role;
  label: string;
  description: string;
  level: number;
}

export const ROLES: Record<string, RoleConfig> = {
  SUPER_ADMIN: {
    value: 'SUPER_ADMIN',
    label: 'Super Admin',
    description: 'Global system administrator across all platform tenants',
    level: 100,
  },
  TENANT_ADMIN: {
    value: 'TENANT_ADMIN',
    label: 'Tenant Admin',
    description: 'Full workspace administrator for the organization',
    level: 80,
  },
  SALES_MANAGER: {
    value: 'SALES_MANAGER',
    label: 'Sales Manager',
    description: 'Manages team, pipelines, approvals, and AI agent permissions',
    level: 50,
  },
  SALES_REP: {
    value: 'SALES_REP',
    label: 'Sales Representative',
    description: 'Executes deals, manages conversations, leads, and tasks',
    level: 30,
  },
  VIEWER: {
    value: 'VIEWER',
    label: 'Viewer',
    description: 'Read-only access to dashboards, reports, and analytics',
    level: 10,
  },
};

// =============================================================================
// DATE FORMAT STRINGS
// =============================================================================

export const DATE_FORMATS = {
  DISPLAY_DATE: 'MMM d, yyyy',
  DISPLAY_DATE_SHORT: 'MMM d',
  DISPLAY_DATE_TIME: 'MMM d, yyyy h:mm a',
  DISPLAY_DATE_TIME_SHORT: 'MMM d, h:mm a',
  DISPLAY_TIME: 'h:mm a',
  ISO_DATE: 'yyyy-MM-dd',
  ISO_DATE_TIME: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  TABLE_DATE: 'dd MMM yyyy',
  MONTH_YEAR: 'MMMM yyyy',
} as const;

// =============================================================================
// PAGINATION DEFAULTS
// =============================================================================

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// =============================================================================
// AI CONFIGURATION OPTIONS
// =============================================================================

export const SUPPORTED_AI_MODELS = [
  { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet (Recommended)', provider: 'Anthropic' },
  { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus (High Complexity)', provider: 'Anthropic' },
  { id: 'gpt-4o', name: 'GPT-4o (Omni Fast)', provider: 'OpenAI' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Cost Efficient)', provider: 'OpenAI' },
] as const;
