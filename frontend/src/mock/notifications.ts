import { Notification } from '@/types';

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: 'High-Intent Lead Identified',
    message: 'CloudScale Inc. (Score: 94/100) viewed Enterprise pricing and downloaded the security whitepaper.',
    type: 'lead',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 mins ago
    actionUrl: '/leads/lead_cloudscale_01',
    actor: {
      name: 'SKAR AI Prospector',
    },
  },
  {
    id: 'notif-2',
    title: 'Discount Approval Requested',
    message: 'Jordan Lee requested a 22% ARR discount for Acme Corp ($148,000 / yr). Approval required.',
    type: 'approval',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    actionUrl: '/approvals',
    actor: {
      name: 'Jordan Lee',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces',
    },
  },
  {
    id: 'notif-3',
    title: 'Upcoming Task Due Soon',
    message: 'Prepare tailored ROI presentation for executive committee at Veloce Dynamics.',
    type: 'task',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    actionUrl: '/tasks',
  },
  {
    id: 'notif-4',
    title: 'Campaign Performance Milestone',
    message: 'Outbound campaign "Enterprise Fintech Q4" exceeded 24% positive reply rate (42 meetings booked).',
    type: 'system',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    actionUrl: '/campaigns',
  },
  {
    id: 'notif-5',
    title: 'Contract Terms Review',
    message: 'Legal department approved custom data residency clause for Nordic Bank.',
    type: 'approval',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    actionUrl: '/approvals',
  },
  {
    id: 'notif-6',
    title: 'Salesforce & HubSpot Sync',
    message: 'Bi-directional CRM sync completed: 1,420 pipeline stages and deals updated.',
    type: 'system',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
    actionUrl: '/integrations',
  },
];
