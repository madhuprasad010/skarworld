import { subDays, subHours, formatISO } from 'date-fns';
import type { TenantSettings, TeamMember, Tenant } from '@/types';

export const mockTenant: Tenant = {
  id: 'tenant-001',
  name: 'SKARWORLD Technologies Inc.',
  slug: 'skarworld',
  plan: 'enterprise',
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
  createdAt: formatISO(subDays(new Date(), 180)),
};

export const mockTenantSettings: TenantSettings = {
  companyName: 'SKARWORLD Technologies Inc.',
  industry: 'Artificial Intelligence & RevOps Software',
  timezone: 'America/New_York',
  currency: 'USD',
  supportEmail: 'ops@skarworld.io',
  autoAssignLeads: true,
  aiAutoReplyEnabled: true,
  slackAlertsEnabled: true,
  emailNotificationsEnabled: true,
  workingHoursStart: '08:00',
  workingHoursEnd: '18:00',
};

export const mockTeamMembers: TeamMember[] = [
  {
    id: 'user-001',
    name: 'Alex Rivera',
    email: 'alex.rivera@skarworld.io',
    role: 'admin',
    avatar: 'AR',
    status: 'active',
    lastActiveAt: formatISO(subHours(new Date(), 1)),
    createdAt: formatISO(subDays(new Date(), 180)),
  },
  {
    id: 'user-002',
    name: 'Elena Rostova',
    email: 'elena.rostova@skarworld.io',
    role: 'sales_manager',
    avatar: 'ER',
    status: 'active',
    lastActiveAt: formatISO(subHours(new Date(), 2)),
    createdAt: formatISO(subDays(new Date(), 150)),
  },
  {
    id: 'user-003',
    name: 'Marcus Chen',
    email: 'marcus.chen@skarworld.io',
    role: 'sales_rep',
    avatar: 'MC',
    status: 'active',
    lastActiveAt: formatISO(subHours(new Date(), 1)),
    createdAt: formatISO(subDays(new Date(), 120)),
  },
  {
    id: 'user-004',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@skarworld.io',
    role: 'sales_rep',
    avatar: 'SJ',
    status: 'active',
    lastActiveAt: formatISO(subHours(new Date(), 3)),
    createdAt: formatISO(subDays(new Date(), 90)),
  },
  {
    id: 'user-005',
    name: 'David Kim',
    email: 'david.kim@skarworld.io',
    role: 'sales_rep',
    avatar: 'DK',
    status: 'active',
    lastActiveAt: formatISO(subHours(new Date(), 4)),
    createdAt: formatISO(subDays(new Date(), 60)),
  },
  {
    id: 'user-006',
    name: 'Priya Patel',
    email: 'priya.patel@skarworld.io',
    role: 'analyst',
    avatar: 'PP',
    status: 'active',
    lastActiveAt: formatISO(subHours(new Date(), 2)),
    createdAt: formatISO(subDays(new Date(), 45)),
  },
];
