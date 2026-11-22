import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types';
import {
  Settings,
  Building,
  Users,
  CreditCard,
  Shield,
  Key,
  Bell,
  FileSpreadsheet,
  Check,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  Trash2,
  AlertTriangle,
  Laptop,
  Smartphone,
  ExternalLink,
  Search,
} from 'lucide-react';

interface TeamMemberItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  status: 'active' | 'invited' | 'disabled';
  lastActiveAt: string;
}

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  isCurrent: boolean;
  lastActive: string;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  severity: 'info' | 'warning' | 'security';
}

const INITIAL_TEAM: TeamMemberItem[] = [
  {
    id: 'usr-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@skarworld.io',
    role: 'admin',
    avatar: 'AR',
    status: 'active',
    lastActiveAt: 'Just now',
  },
  {
    id: 'usr-2',
    name: 'Elena Rostova',
    email: 'elena.rostova@skarworld.io',
    role: 'sales_manager',
    avatar: 'ER',
    status: 'active',
    lastActiveAt: '12 minutes ago',
  },
  {
    id: 'usr-3',
    name: 'Marcus Chen',
    email: 'marcus.chen@skarworld.io',
    role: 'sales_rep',
    avatar: 'MC',
    status: 'active',
    lastActiveAt: '1 hour ago',
  },
  {
    id: 'usr-4',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@skarworld.io',
    role: 'sales_rep',
    avatar: 'SJ',
    status: 'active',
    lastActiveAt: '3 hours ago',
  },
  {
    id: 'usr-5',
    name: 'David Kim',
    email: 'david.kim@skarworld.io',
    role: 'sales_rep',
    avatar: 'DK',
    status: 'active',
    lastActiveAt: 'Yesterday',
  },
  {
    id: 'usr-6',
    name: 'Priya Patel',
    email: 'priya.patel@skarworld.io',
    role: 'analyst',
    avatar: 'PP',
    status: 'invited',
    lastActiveAt: 'Never',
  },
];

const INITIAL_AUDIT_LOGS: AuditEntry[] = [
  {
    id: 'aud-01',
    timestamp: '2026-11-22 17:45:12',
    user: 'Alex Rivera',
    action: 'Approved High Value Deal',
    resource: 'Approval #appr-001',
    details: 'Approved 25% annual discount for CloudScale Tech ($145k ARR)',
    severity: 'info',
  },
  {
    id: 'aud-02',
    timestamp: '2026-11-22 16:30:05',
    user: 'Elena Rostova',
    action: 'Modified AI Config',
    resource: 'AI System Prompt',
    details: 'Updated qualification threshold from 70 to 75 points',
    severity: 'info',
  },
  {
    id: 'aud-03',
    timestamp: '2026-11-22 15:10:44',
    user: 'System Bot',
    action: 'API Key Rotated',
    resource: 'Anthropic Claude Token',
    details: 'KMS auto-rotated secondary API secret key',
    severity: 'security',
  },
  {
    id: 'aud-04',
    timestamp: '2026-11-22 14:02:19',
    user: 'Marcus Chen',
    action: 'Created Opportunity',
    resource: 'Opportunity #opp-102',
    details: 'Logged $320k deal for Finovate Capital',
    severity: 'info',
  },
  {
    id: 'aud-05',
    timestamp: '2026-11-22 13:22:50',
    user: 'Sarah Jenkins',
    action: 'Lead Stage Transition',
    resource: 'Lead #lead-003',
    details: 'Moved Nordic Health Systems to Proposal Stage',
    severity: 'info',
  },
  {
    id: 'aud-06',
    timestamp: '2026-11-22 12:15:33',
    user: 'Alex Rivera',
    action: 'Team Member Invited',
    resource: 'User priya.patel@skarworld.io',
    details: 'Assigned role: analyst',
    severity: 'info',
  },
  {
    id: 'aud-07',
    timestamp: '2026-11-22 11:45:20',
    user: 'Security Sentinel',
    action: 'Failed Login Blocked',
    resource: 'Auth Endpoint',
    details: 'IP 185.220.101.5 blocked after 5 invalid attempts',
    severity: 'security',
  },
  {
    id: 'aud-08',
    timestamp: '2026-11-22 10:11:02',
    user: 'David Kim',
    action: 'Outbound Campaign Started',
    resource: 'Campaign #camp-04',
    details: 'Launched Fintech CRO Outbound Sequence (1,250 recipients)',
    severity: 'info',
  },
  {
    id: 'aud-09',
    timestamp: '2026-11-22 09:30:15',
    user: 'Elena Rostova',
    action: 'Discount Rejected',
    resource: 'Approval #appr-005',
    details: 'Rejected 40% discount for Apex Retail Solutions',
    severity: 'warning',
  },
  {
    id: 'aud-10',
    timestamp: '2026-11-21 21:55:01',
    user: 'System Cron',
    action: 'Daily Data Backup',
    resource: 'Postgres Tenant DB',
    details: 'Encrypted snapshot saved to AWS S3 eu-west-1',
    severity: 'info',
  },
  {
    id: 'aud-11',
    timestamp: '2026-11-21 19:40:22',
    user: 'Alex Rivera',
    action: 'Updated Webhook Endpoint',
    resource: 'Integration #int-001',
    details: 'Configured WhatsApp Cloud API inbound listener',
    severity: 'info',
  },
  {
    id: 'aud-12',
    timestamp: '2026-11-21 18:05:44',
    user: 'Marcus Chen',
    action: 'Task Marked Complete',
    resource: 'Task #task-106',
    details: 'Completed legal liability term review',
    severity: 'info',
  },
  {
    id: 'aud-13',
    timestamp: '2026-11-21 16:20:11',
    user: 'Sarah Jenkins',
    action: 'Generated Research Dossier',
    resource: 'Research #res-002',
    details: 'Autonomous brief created for Sarah Jenkins (CTO)',
    severity: 'info',
  },
  {
    id: 'aud-14',
    timestamp: '2026-11-21 14:15:30',
    user: 'Elena Rostova',
    action: 'Product Price Modified',
    resource: 'Product #prod-001',
    details: 'Updated Core SaaS tier pricing to $499/mo',
    severity: 'warning',
  },
  {
    id: 'aud-15',
    timestamp: '2026-11-21 12:44:09',
    user: 'System Bot',
    action: 'Autonomous Lead Qualified',
    resource: 'Lead #lead-008',
    details: 'Score calculated: 88/100 based on BANT criteria',
    severity: 'info',
  },
  {
    id: 'aud-16',
    timestamp: '2026-11-21 11:10:55',
    user: 'Alex Rivera',
    action: '2FA Enforcement Enabled',
    resource: 'Tenant Security Policy',
    details: 'Required hardware/TOTP 2FA for all administrative accounts',
    severity: 'security',
  },
  {
    id: 'aud-17',
    timestamp: '2026-11-21 09:05:18',
    user: 'David Kim',
    action: 'Contact Exported',
    resource: 'Leads Table',
    details: 'Exported 250 qualified prospects to CSV',
    severity: 'warning',
  },
  {
    id: 'aud-18',
    timestamp: '2026-11-20 22:15:00',
    user: 'System Cron',
    action: 'Deliverability Healthcheck',
    resource: 'Amazon SES Domain',
    details: 'Bounce rate measured at 0.42% (Optimal status)',
    severity: 'info',
  },
  {
    id: 'aud-19',
    timestamp: '2026-11-20 18:30:21',
    user: 'Elena Rostova',
    action: 'Created Playbook Rule',
    resource: 'AI Knowledge Base',
    details: 'Added custom Q&A on HIPAA compliant storage enclaves',
    severity: 'info',
  },
  {
    id: 'aud-20',
    timestamp: '2026-11-20 15:45:10',
    user: 'Alex Rivera',
    action: 'Subscription Upgraded',
    resource: 'Billing Plan',
    details: 'Upgraded tenant to Enterprise AI Plan (Unlimited Seats)',
    severity: 'info',
  },
  {
    id: 'aud-21',
    timestamp: '2026-11-20 12:00:00',
    user: 'System Sentinel',
    action: 'Weekly Audit Verification',
    resource: 'Compliance Log Ledger',
    details: 'Hash verification passed across 1,842 event blocks',
    severity: 'info',
  },
];

export function SettingsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<
    'profile' | 'team' | 'billing' | 'security' | 'api' | 'notifications' | 'audit'
  >('profile');

  // 1. Profile State
  const [businessName, setBusinessName] = useState('Skarworld Technologies Inc.');
  const [industry, setIndustry] = useState('Enterprise Software & AI Automation');
  const [website, setWebsite] = useState('https://skarworld.io');
  const [phone, setPhone] = useState('+1 (555) 019-2831');
  const [address, setAddress] = useState('500 Howard Street, Suite 400, San Francisco, CA 94105');
  const [description, setDescription] = useState(
    'Next-generation multi-tenant Autonomous Revenue Operating System accelerating B2B pipeline growth.'
  );
  const [timezone, setTimezone] = useState('America/Los_Angeles');
  const [currency, setCurrency] = useState('USD');

  // 2. Team State
  const [teamMembers, setTeamMembers] = useState<TeamMemberItem[]>(INITIAL_TEAM);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('sales_rep');
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);

  // 3. Billing State
  const [invoices] = useState([
    { id: 'INV-2026-03', date: 'Mar 1, 2026', amount: '$4,250.00', status: 'Paid', plan: 'Enterprise Revenue Pro' },
    { id: 'INV-2026-02', date: 'Feb 1, 2026', amount: '$4,250.00', status: 'Paid', plan: 'Enterprise Revenue Pro' },
    { id: 'INV-2026-01', date: 'Jan 1, 2026', amount: '$4,250.00', status: 'Paid', plan: 'Enterprise Revenue Pro' },
  ]);

  // 4. Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([
    {
      id: 'sess-1',
      device: 'MacBook Pro (16-inch, 2024)',
      browser: 'Chrome 131.0 on macOS Sonoma',
      ip: '198.51.100.42',
      location: 'San Francisco, CA, US',
      isCurrent: true,
      lastActive: 'Active Now',
    },
    {
      id: 'sess-2',
      device: 'iPhone 16 Pro Max',
      browser: 'Safari Mobile on iOS 19',
      ip: '172.56.21.8',
      location: 'San Jose, CA, US',
      isCurrent: false,
      lastActive: '4 hours ago',
    },
    {
      id: 'sess-3',
      device: 'ThinkPad X1 Carbon',
      browser: 'Firefox 133.0 on Linux',
      ip: '198.51.100.99',
      location: 'Austin, TX, US',
      isCurrent: false,
      lastActive: '2 days ago',
    },
  ]);

  // 5. API State
  const [apiKey, setApiKey] = useState('sk_live_rev_89102481902481902481092840');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isRegeneratingKey, setIsRegeneratingKey] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://app.customer.com/api/skarworld-events');
  const [webhookEvents, setWebhookEvents] = useState<string[]>([
    'lead.created',
    'lead.qualified',
    'deal.won',
  ]);

  // 6. Notifications State
  const [notifPreferences, setNotifPreferences] = useState({
    // Email
    emailNewLead: true,
    emailApprovalReq: true,
    emailDailyDigest: false,
    emailSystemAlerts: true,
    // Push
    pushHighValueLead: true,
    pushApprovalDecision: true,
    pushEscalation: true,
    // In-App
    inAppTasks: true,
    inAppMentions: true,
    inAppCampaigns: true,
  });

  // 7. Audit Log State
  const [auditLogs] = useState<AuditEntry[]>(INITIAL_AUDIT_LOGS);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditSeverity, setAuditSeverity] = useState('all');

  // Handlers
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Profile Updated',
      description: 'Organization settings have been saved successfully.',
      variant: 'success',
    });
  };

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteName.trim()) {
      toast({ title: 'Missing Information', description: 'Name and email are required.', variant: 'destructive' });
      return;
    }

    const newMember: TeamMemberItem = {
      id: `usr-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      avatar: inviteName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
      status: 'invited',
      lastActiveAt: 'Never',
    };

    setTeamMembers((prev) => [...prev, newMember]);
    setIsInviteOpen(false);
    setInviteName('');
    setInviteEmail('');
    toast({
      title: 'Invitation Sent',
      description: `Invitation dispatched to ${newMember.email}.`,
      variant: 'success',
    });
  };

  const handleChangeRole = (memberId: string, newRole: UserRole) => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
    toast({ title: 'Role Updated', description: 'User permissions updated.' });
  };

  const handleRemoveMember = () => {
    if (!removingMemberId) return;
    setTeamMembers((prev) => prev.filter((m) => m.id !== removingMemberId));
    toast({ title: 'User Removed', description: 'User access revoked.' });
    setRemovingMemberId(null);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ title: 'Validation Error', description: 'Please complete all password fields.', variant: 'destructive' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: 'Mismatch Error', description: 'New passwords do not match.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Password Changed', description: 'Your credentials have been updated securely.', variant: 'success' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleRevokeSession = (sessionId: string) => {
    setActiveSessions((prev) => prev.filter((s) => s.id !== sessionId));
    toast({ title: 'Session Revoked', description: 'Device logged out.' });
  };

  const handleLogoutAllSessions = () => {
    setActiveSessions((prev) => prev.filter((s) => s.isCurrent));
    toast({ title: 'All Sessions Terminated', description: 'All secondary sessions logged out.' });
  };

  const handleCopyKey = () => {
    navigator.clipboard?.writeText(apiKey);
    toast({ title: 'API Key Copied', description: 'Key saved to clipboard.' });
  };

  const handleRegenerateKey = () => {
    const newKey = `sk_live_rev_${Math.random().toString(36).substring(2)}${Date.now()}`;
    setApiKey(newKey);
    setIsRegeneratingKey(false);
    toast({ title: 'API Key Regenerated', description: 'Previous key has been revoked.', variant: 'warning' });
  };

  const toggleWebhookEvent = (ev: string) => {
    setWebhookEvents((prev) =>
      prev.includes(ev) ? prev.filter((e) => e !== ev) : [...prev, ev]
    );
  };

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Webhook Updated', description: 'Webhook delivery endpoints updated.', variant: 'success' });
  };

  // Filtered Audit Entries
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter((entry) => {
      if (auditSeverity !== 'all' && entry.severity !== auditSeverity) return false;
      if (auditSearch.trim()) {
        const q = auditSearch.toLowerCase();
        return (
          entry.user.toLowerCase().includes(q) ||
          entry.action.toLowerCase().includes(q) ||
          entry.resource.toLowerCase().includes(q) ||
          entry.details.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [auditLogs, auditSeverity, auditSearch]);

  const navItems = [
    { key: 'profile', label: 'Company Profile', icon: Building },
    { key: 'team', label: 'Team Members', icon: Users },
    { key: 'billing', label: 'Billing & Plan', icon: CreditCard },
    { key: 'security', label: 'Security & Auth', icon: Shield },
    { key: 'api', label: 'API & Webhooks', icon: Key },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'audit', label: 'Audit Log Ledger', icon: FileSpreadsheet },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Settings"
        description="Manage workspace organization, team seats, enterprise security, API secrets, and compliance audit logs."
        icon={Settings}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Side Tabs Navigation (Vertical on desktop) */}
        <aside className="w-full lg:w-64 shrink-0 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveTab(item.key)}
                className={cn(
                  'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors text-left',
                  isActive
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {/* 1. PROFILE TAB */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Organization Profile</CardTitle>
                <CardDescription className="text-xs">
                  Public enterprise details, localization parameters, and customer communication channels.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="biz-name">Business Legal Name</Label>
                      <Input
                        id="biz-name"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="industry">Industry Sector</Label>
                      <Input
                        id="industry"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="website">Primary Website URL</Label>
                      <Input
                        id="website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Headquarters Phone</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="address">Physical Headquarters Address</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="org-desc">Organization Description</Label>
                    <Textarea
                      id="org-desc"
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="tz">Operational Timezone</Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger id="tz">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Los_Angeles">Pacific Time (PT - America/Los_Angeles)</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time (ET - America/New_York)</SelectItem>
                          <SelectItem value="Europe/London">London (GMT/BST - Europe/London)</SelectItem>
                          <SelectItem value="Asia/Singapore">Singapore (SGT - Asia/Singapore)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="currency">Base Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger id="currency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($ - US Dollar)</SelectItem>
                          <SelectItem value="EUR">EUR (€ - Euro)</SelectItem>
                          <SelectItem value="GBP">GBP (£ - British Pound)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* 2. TEAM TAB */}
          {activeTab === 'team' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Team Members & Permissions</CardTitle>
                  <CardDescription className="text-xs">
                    Manage team seats, assign managerial approval tiers, and grant role authorizations.
                  </CardDescription>
                </div>
                <Button size="sm" onClick={() => setIsInviteOpen(true)} className="gap-1.5 text-xs">
                  <Plus className="h-3.5 w-3.5" />
                  Invite Member
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b text-muted-foreground uppercase text-2xs font-semibold">
                      <tr>
                        <th className="pb-3">User</th>
                        <th className="pb-3">Role</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Last Active</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {teamMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 flex items-center gap-2.5">
                            <Avatar className="h-7 w-7 text-2xs">
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {member.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-foreground">{member.name}</div>
                              <div className="text-2xs text-muted-foreground">{member.email}</div>
                            </div>
                          </td>
                          <td className="py-3">
                            <Select
                              value={member.role}
                              onValueChange={(val) => handleChangeRole(member.id, val as UserRole)}
                            >
                              <SelectTrigger className="h-7 w-[130px] text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="sales_manager">Sales Manager</SelectItem>
                                <SelectItem value="sales_rep">Sales Rep</SelectItem>
                                <SelectItem value="analyst">Analyst</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-3">
                            <Badge
                              variant={member.status === 'active' ? 'success' : 'outline'}
                              className="text-2xs capitalize"
                            >
                              {member.status}
                            </Badge>
                          </td>
                          <td className="py-3 text-muted-foreground text-2xs">{member.lastActiveAt}</td>
                          <td className="py-3 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => setRemovingMemberId(member.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 3. BILLING TAB */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              {/* Plan Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <Badge variant="indigo" className="mb-1 text-2xs font-semibold">Current Subscription</Badge>
                    <CardTitle className="text-xl font-bold">Enterprise Revenue Pro Plan</CardTitle>
                    <CardDescription className="text-xs">
                      $4,250.00 billed monthly · Renews automatically on April 1, 2026.
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => toast({ title: 'Stripe Portal', description: 'Redirecting to customer billing portal...' })}
                    className="gap-1.5 text-xs"
                  >
                    Manage Subscription
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t pt-4">
                  <div className="space-y-1">
                    <span className="text-2xs font-medium text-muted-foreground uppercase">Team Seats</span>
                    <div className="text-lg font-bold text-foreground">6 / Unlimited</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-2xs font-medium text-muted-foreground uppercase">Monthly AI Credits</span>
                    <div className="text-lg font-bold text-foreground">248k / 500k</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-2xs font-medium text-muted-foreground uppercase">API Volume</span>
                    <div className="text-lg font-bold text-foreground">1.8M / 5M calls</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-2xs font-medium text-muted-foreground uppercase">Storage & Enclaves</span>
                    <div className="text-lg font-bold text-foreground">32 GB / 250 GB</div>
                  </div>
                </CardContent>
              </Card>

              {/* Billing History Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Billing Invoices & Receipts</CardTitle>
                  <CardDescription className="text-xs">
                    Download past tax receipts and payment summaries.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b text-muted-foreground uppercase text-2xs font-semibold">
                        <tr>
                          <th className="pb-3">Invoice</th>
                          <th className="pb-3">Billing Date</th>
                          <th className="pb-3">Plan Entitlement</th>
                          <th className="pb-3">Amount</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Download</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {invoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-3 font-mono font-medium text-foreground">{inv.id}</td>
                            <td className="py-3 text-muted-foreground">{inv.date}</td>
                            <td className="py-3 text-foreground">{inv.plan}</td>
                            <td className="py-3 font-semibold text-foreground">{inv.amount}</td>
                            <td className="py-3">
                              <Badge variant="success" className="text-2xs">{inv.status}</Badge>
                            </td>
                            <td className="py-3 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-primary hover:underline"
                                onClick={() => toast({ title: 'Downloading PDF', description: `Invoice ${inv.id} downloaded.` })}
                              >
                                PDF Receipt
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 4. SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Password Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Change Administrative Password</CardTitle>
                  <CardDescription className="text-xs">
                    Ensure passwords use at least 12 characters including symbols and uppercase letters.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleChangePassword} className="space-y-3 max-w-md">
                    <div className="space-y-1.5">
                      <Label htmlFor="curr-pass">Current Password</Label>
                      <Input
                        id="curr-pass"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="new-pass">New Password</Label>
                      <Input
                        id="new-pass"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="conf-pass">Confirm New Password</Label>
                      <Input
                        id="conf-pass"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <div className="pt-2">
                      <Button type="submit">Update Password</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* 2FA Toggle */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-sm text-foreground flex items-center gap-2">
                        <span>Two-Factor Authentication (2FA)</span>
                        <Badge variant="success" className="text-2xs font-semibold">Enforced</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Require hardware security keys or authenticator apps (TOTP) on all session authentications.
                      </p>
                    </div>
                    <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                  </div>
                </CardContent>
              </Card>

              {/* Active Sessions */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Active Authorized Sessions</CardTitle>
                    <CardDescription className="text-xs">
                      Devices currently authorized to access this tenant.
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogoutAllSessions}
                    className="text-xs text-destructive hover:bg-destructive/10"
                  >
                    Logout All Other Sessions
                  </Button>
                </CardHeader>
                <CardContent className="divide-y divide-border">
                  {activeSessions.map((sess) => (
                    <div key={sess.id} className="py-3 flex items-center justify-between text-xs first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground">
                          {sess.device.includes('iPhone') ? <Smartphone className="h-4 w-4" /> : <Laptop className="h-4 w-4" />}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground flex items-center gap-2">
                            <span>{sess.device}</span>
                            {sess.isCurrent && (
                              <Badge variant="indigo" className="text-2xs">This Device</Badge>
                            )}
                          </div>
                          <span className="text-2xs text-muted-foreground">
                            {sess.browser} · {sess.ip} ({sess.location})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-2xs text-muted-foreground">{sess.lastActive}</span>
                        {!sess.isCurrent && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRevokeSession(sess.id)}
                            className="text-2xs text-destructive hover:bg-destructive/10 h-7"
                          >
                            Revoke
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* 5. API TAB */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              {/* API Key Display */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Secret API Access Key</CardTitle>
                  <CardDescription className="text-xs">
                    Use this secret key to authenticate programmatic requests to the Skarworld REST API.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5 max-w-lg">
                    <Label>Active Secret Key</Label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Input
                          readOnly
                          type={showApiKey ? 'text' : 'password'}
                          value={apiKey}
                          className="font-mono text-xs pr-10 bg-muted/30"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleCopyKey} className="gap-1.5 text-xs h-9">
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setIsRegeneratingKey(true)}
                        className="gap-1.5 text-xs h-9"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Webhook Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Outbound Webhooks</CardTitle>
                  <CardDescription className="text-xs">
                    Receive HTTP POST payloads when CRM and AI pipeline events occur.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveWebhook} className="space-y-4">
                    <div className="space-y-1.5 max-w-lg">
                      <Label htmlFor="webhook-url-input">Endpoint URL</Label>
                      <Input
                        id="webhook-url-input"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        className="font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Subscribed Event Types</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg pt-1">
                        {[
                          { key: 'lead.created', label: 'lead.created (Inbound lead captured)' },
                          { key: 'lead.qualified', label: 'lead.qualified (Crossed score threshold)' },
                          { key: 'deal.won', label: 'deal.won (Contract executed)' },
                          { key: 'approval.requested', label: 'approval.requested (Manager signoff needed)' },
                          { key: 'ai.takeover', label: 'ai.takeover (Human escalation triggered)' },
                        ].map((ev) => (
                          <label
                            key={ev.key}
                            className="flex items-center gap-2 text-xs border rounded-lg p-2.5 cursor-pointer hover:bg-muted/40 transition-colors select-none"
                            onClick={() => toggleWebhookEvent(ev.key)}
                          >
                            <Checkbox checked={webhookEvents.includes(ev.key)} />
                            <span className="font-mono text-2xs">{ev.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button type="submit">Save Webhook Configuration</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 6. NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Notification Preferences</CardTitle>
                <CardDescription className="text-xs">
                  Choose which alerts and digests you receive across email, mobile push, and in-app feeds.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email Section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email Notifications
                  </h4>
                  <div className="divide-y divide-border rounded-lg border">
                    <div className="flex items-center justify-between p-3 text-xs">
                      <span>New lead captured from website / WhatsApp</span>
                      <Switch
                        checked={notifPreferences.emailNewLead}
                        onCheckedChange={(c) => setNotifPreferences((p) => ({ ...p, emailNewLead: c }))}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 text-xs">
                      <span>Commercial approval requests awaiting your signature</span>
                      <Switch
                        checked={notifPreferences.emailApprovalReq}
                        onCheckedChange={(c) => setNotifPreferences((p) => ({ ...p, emailApprovalReq: c }))}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 text-xs">
                      <span>Daily morning pipeline summary & quota progress digest</span>
                      <Switch
                        checked={notifPreferences.emailDailyDigest}
                        onCheckedChange={(c) => setNotifPreferences((p) => ({ ...p, emailDailyDigest: c }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Push Section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Mobile Push Notifications
                  </h4>
                  <div className="divide-y divide-border rounded-lg border">
                    <div className="flex items-center justify-between p-3 text-xs">
                      <span>High-value lead (Deal potential &gt; $100k)</span>
                      <Switch
                        checked={notifPreferences.pushHighValueLead}
                        onCheckedChange={(c) => setNotifPreferences((p) => ({ ...p, pushHighValueLead: c }))}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 text-xs">
                      <span>AI Copilot live human takeover escalations</span>
                      <Switch
                        checked={notifPreferences.pushEscalation}
                        onCheckedChange={(c) => setNotifPreferences((p) => ({ ...p, pushEscalation: c }))}
                      />
                    </div>
                  </div>
                </div>

                {/* In-App Section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    In-App Notification Feed
                  </h4>
                  <div className="divide-y divide-border rounded-lg border">
                    <div className="flex items-center justify-between p-3 text-xs">
                      <span>Task due dates and reminders</span>
                      <Switch
                        checked={notifPreferences.inAppTasks}
                        onCheckedChange={(c) => setNotifPreferences((p) => ({ ...p, inAppTasks: c }))}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 text-xs">
                      <span>Mentions and notes on opportunity timeline</span>
                      <Switch
                        checked={notifPreferences.inAppMentions}
                        onCheckedChange={(c) => setNotifPreferences((p) => ({ ...p, inAppMentions: c }))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 7. AUDIT LOG TAB */}
          {activeTab === 'audit' && (
            <Card>
              <CardHeader className="space-y-3">
                <div>
                  <CardTitle className="text-base font-semibold">Security & Administrative Audit Ledger</CardTitle>
                  <CardDescription className="text-xs">
                    Immutable event log of operational actions, approval signoffs, and security policy modifications.
                  </CardDescription>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search audit records by user, action, resource, or details..."
                      value={auditSearch}
                      onChange={(e) => setAuditSearch(e.target.value)}
                      className="pl-9 h-8 text-xs"
                    />
                  </div>
                  <Select value={auditSeverity} onValueChange={setAuditSeverity}>
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b text-muted-foreground uppercase text-2xs font-semibold">
                      <tr>
                        <th className="pb-3">Timestamp</th>
                        <th className="pb-3">User</th>
                        <th className="pb-3">Action</th>
                        <th className="pb-3">Resource</th>
                        <th className="pb-3">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border font-mono text-2xs">
                      {filteredAuditLogs.map((entry) => (
                        <tr key={entry.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-2.5 whitespace-nowrap text-muted-foreground">
                            {entry.timestamp}
                          </td>
                          <td className="py-2.5 font-semibold text-foreground whitespace-nowrap">
                            {entry.user}
                          </td>
                          <td className="py-2.5 whitespace-nowrap">
                            <span
                              className={cn(
                                'rounded px-1.5 py-0.5 font-semibold',
                                entry.severity === 'security' && 'bg-destructive/10 text-destructive',
                                entry.severity === 'warning' && 'bg-amber-500/10 text-amber-600',
                                entry.severity === 'info' && 'bg-primary/10 text-primary'
                              )}
                            >
                              {entry.action}
                            </span>
                          </td>
                          <td className="py-2.5 text-foreground whitespace-nowrap">
                            {entry.resource}
                          </td>
                          <td className="py-2.5 font-sans text-xs text-muted-foreground max-w-md truncate">
                            {entry.details}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Invite Member Dialog */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInviteUser} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="inv-name">Full Name *</Label>
              <Input
                id="inv-name"
                placeholder="Jane Doe"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inv-email">Work Email *</Label>
              <Input
                id="inv-email"
                type="email"
                placeholder="jane@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inv-role">Assigned Role</Label>
              <Select
                value={inviteRole}
                onValueChange={(val) => setInviteRole(val as UserRole)}
              >
                <SelectTrigger id="inv-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="sales_manager">Sales Manager</SelectItem>
                  <SelectItem value="sales_rep">Sales Representative</SelectItem>
                  <SelectItem value="analyst">RevOps Analyst</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsInviteOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Send Invitation</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Remove Member Alert Dialog */}
      <AlertDialog
        open={!!removingMemberId}
        onOpenChange={(open) => !open && setRemovingMemberId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke team member access?</AlertDialogTitle>
            <AlertDialogDescription>
              This user will immediately lose access to the workspace and all assigned leads will be held in unassigned queue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Regenerate API Key Alert Dialog */}
      <AlertDialog
        open={isRegeneratingKey}
        onOpenChange={setIsRegeneratingKey}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Regenerate API Secret Key?</AlertDialogTitle>
            <AlertDialogDescription>
              Regenerating your secret key will immediately invalidate the current key. Any external background scripts or webhooks using the old key will stop working.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRegenerateKey}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Regenerate Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default SettingsPage;
