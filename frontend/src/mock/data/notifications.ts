import { subDays, subHours, subMinutes, formatISO } from 'date-fns';
import type { Notification } from '@/types';

export const mockNotifications: Notification[] = [
  // 1. Unread - approval_requested
  {
    id: 'notif-001',
    type: 'approval_requested',
    title: 'New Discount Approval Request',
    message: 'Elena Rostova requested approval for a 15% discount on the NordicPay Solutions 24-month agreement ($160,000).',
    read: false,
    entityId: 'appr-001',
    entityType: 'approval',
    tenantId: 'tenant-001',
    createdAt: formatISO(subMinutes(new Date(), 22)),
  },

  // 2. Unread - message_received
  {
    id: 'notif-002',
    type: 'message_received',
    title: 'New WhatsApp Message Received',
    message: 'Devon Vance (Vanguard Logistics) inquired: "Can your AI agent handle routing incoming driver WhatsApp notes straight into our TMS?"',
    read: false,
    entityId: 'conv-001',
    entityType: 'conversation',
    tenantId: 'tenant-001',
    createdAt: formatISO(subMinutes(new Date(), 35)),
  },

  // 3. Unread - task_overdue
  {
    id: 'notif-003',
    type: 'task_overdue',
    title: 'Task Overdue: SOC2 Data Deletion Clause',
    message: 'Urgent task "Resolve compliance inquiry on SOC2 data deletion terms" for Liam Gallagher was due yesterday.',
    read: false,
    entityId: 'task-001',
    entityType: 'task',
    tenantId: 'tenant-001',
    createdAt: formatISO(subHours(new Date(), 2)),
  },

  // 4. Unread - lead_new
  {
    id: 'notif-004',
    type: 'lead_new',
    title: 'New Inbound Lead: Gabriel Rossi',
    message: 'Gabriel Rossi from Rossi Milano Fashion submitted an enterprise demo inquiry via website chat widget.',
    read: false,
    entityId: 'lead-024',
    entityType: 'lead',
    tenantId: 'tenant-001',
    createdAt: formatISO(subHours(new Date(), 3)),
  },

  // 5. Unread - lead_qualified
  {
    id: 'notif-005',
    type: 'lead_qualified',
    title: 'Lead Automatically Qualified by AI',
    message: 'Tariq Al-Mansoor (Gulf CleanTech) scored 78 points. High-intent clean energy project matching enterprise qualification profile.',
    read: false,
    entityId: 'lead-010',
    entityType: 'lead',
    tenantId: 'tenant-001',
    createdAt: formatISO(subHours(new Date(), 5)),
  },

  // 6. Read - task_due
  {
    id: 'notif-006',
    type: 'task_due',
    title: 'Task Due Today: Architectural Review Call',
    message: 'Scheduled call with Tariq Al-Mansoor (Gulf CleanTech Energy) regarding regional AWS Bahrain hosting is due today.',
    read: true,
    entityId: 'task-004',
    entityType: 'task',
    tenantId: 'tenant-001',
    createdAt: formatISO(subHours(new Date(), 8)),
  },

  // 7. Read - approval_decided
  {
    id: 'notif-007',
    type: 'approval_decided',
    title: 'Approval Granted: Horizon BioPharma MSA',
    message: 'Alex Rivera approved the $240,000 enterprise agreement with custom HIPAA BAA terms.',
    read: true,
    entityId: 'appr-003',
    entityType: 'approval',
    tenantId: 'tenant-001',
    createdAt: formatISO(subDays(new Date(), 1)),
  },

  // 8. Read - campaign_completed
  {
    id: 'notif-008',
    type: 'campaign_completed',
    title: 'Campaign Completed: Q3 FinTech Compliance',
    message: 'Campaign concluded with 5,800 emails sent, 51.9% open rate, and 186 qualified meetings converted.',
    read: true,
    entityId: 'camp-003',
    entityType: 'campaign',
    tenantId: 'tenant-001',
    createdAt: formatISO(subDays(new Date(), 2)),
  },

  // 9. Read - system
  {
    id: 'notif-009',
    type: 'system',
    title: 'Anthropic Claude 3.5 Sonnet Latency Optimization',
    message: 'System upgrade: LLM response streaming latency has been reduced by 32% across all tenant conversational bots.',
    read: true,
    tenantId: 'tenant-001',
    createdAt: formatISO(subDays(new Date(), 2)),
  },

  // 10. Read - approval_requested
  {
    id: 'notif-010',
    type: 'approval_requested',
    title: 'Commercial Terms Approval Request',
    message: 'Marcus Chen submitted a Net 30 payment terms request for Solaris Renewable Grid ($190,000).',
    read: true,
    entityId: 'appr-002',
    entityType: 'approval',
    tenantId: 'tenant-001',
    createdAt: formatISO(subDays(new Date(), 2)),
  },

  // 11. Read - message_received
  {
    id: 'notif-011',
    type: 'message_received',
    title: 'Telegram Reply from Liam Gallagher',
    message: 'Liam Gallagher (Kestrel Wealth Management) replied regarding private client human advisor escalation SLA.',
    read: true,
    entityId: 'conv-003',
    entityType: 'conversation',
    tenantId: 'tenant-001',
    createdAt: formatISO(subDays(new Date(), 3)),
  },

  // 12. Read - approval_decided
  {
    id: 'notif-012',
    type: 'approval_decided',
    title: 'Approval Rejected: Unlimited Custom Engineering',
    message: 'Executive desk rejected uncapped developer hours request for Kestrel Wealth; recommend fixed-scope addendum.',
    read: true,
    entityId: 'appr-007',
    entityType: 'approval',
    tenantId: 'tenant-001',
    createdAt: formatISO(subDays(new Date(), 4)),
  },

  // 13. Read - lead_qualified
  {
    id: 'notif-013',
    type: 'lead_qualified',
    title: 'Lead Automatically Qualified by AI',
    message: 'Nathaniel Drake (Uncharted Outdoor Gear) achieved a lead score of 95. Converted into active pipeline opportunity.',
    read: true,
    entityId: 'lead-027',
    entityType: 'lead',
    tenantId: 'tenant-001',
    createdAt: formatISO(subDays(new Date(), 5)),
  },

  // 14. Read - task_due
  {
    id: 'notif-014',
    type: 'task_due',
    title: 'Task Due: Docusign Countersignature Solaris',
    message: 'Send countersigned amendment to Harrison Ford-Smith today.',
    read: true,
    entityId: 'task-008',
    entityType: 'task',
    tenantId: 'tenant-001',
    createdAt: formatISO(subDays(new Date(), 5)),
  },

  // 15. Read - system
  {
    id: 'notif-015',
    type: 'system',
    title: 'Automated Database Backup Successful',
    message: 'Encrypted multi-region snapshot completed at 02:00 UTC. Integrity checks passed (100%).',
    read: true,
    tenantId: 'tenant-001',
    createdAt: formatISO(subDays(new Date(), 6)),
  },

  // 16. Read - lead_new
  {
    id: 'notif-016',
    type: 'lead_new',
    title: 'New Inbound Lead: Victor Nwachukwu',
    message: 'Victor Nwachukwu from Zenith Merchant Commerce signed up for the automated support trial.',
    read: true,
    entityId: 'lead-020',
    entityType: 'lead',
    tenantId: 'tenant-001',
    createdAt: formatISO(subDays(new Date(), 7)),
  },
];
