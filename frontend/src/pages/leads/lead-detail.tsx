import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  ExternalLink,
  Edit3,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Calendar,
  Clock,
  Send,
  MessageSquare,
  Plus,
  Trash2,
  X,
  FileText,
  PhoneCall,
  GitCommit,
  UserCheck,
  CheckSquare,
  Square,
  DollarSign,
  AlertCircle,
  Briefcase,
  Share2,
  Check,
  RefreshCw,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import {
  formatDistanceToNow,
  parseISO,
  format,
  subDays,
  addDays,
  formatISO,
} from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

import { mockLeads } from '@/mock/data/leads';
import { mockUsers } from '@/mock/data/users';
import type {
  Lead,
  LeadStatus,
  LeadSource,
  PipelineStage,
  ChannelType,
} from '@/types';
import { cn } from '@/lib/utils';

// =============================================================================
// Interfaces for Detail Page Specific State
// =============================================================================

export type ActivityType =
  | 'note_added'
  | 'email_sent'
  | 'call_made'
  | 'stage_changed'
  | 'score_updated'
  | 'meeting_scheduled';

export interface TimelineEntry {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  userName: string;
  userAvatar: string;
}

export interface ConversationSnippet {
  id: string;
  channel: ChannelType;
  senderName: string;
  senderType: 'user' | 'lead';
  content: string;
  timestamp: string;
}

export interface LeadOpportunity {
  id: string;
  title: string;
  value: number;
  stage: PipelineStage;
  probability: number;
  closeDate: string;
}

export interface LeadTask {
  id: string;
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  completed: boolean;
  assignedToName: string;
}

// =============================================================================
// Helpers
// =============================================================================

function getScoreColor(score: number) {
  if (score <= 30) {
    return {
      text: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-500',
      stroke: '#f43f5e',
      badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    };
  }
  if (score <= 60) {
    return {
      text: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500',
      stroke: '#f59e0b',
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    };
  }
  return {
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500',
    stroke: '#10b981',
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  };
}

function getStatusBadge(status: LeadStatus) {
  switch (status) {
    case 'new':
      return {
        label: 'New Prospect',
        className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      };
    case 'contacted':
      return {
        label: 'Contacted',
        className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      };
    case 'qualified':
      return {
        label: 'Qualified',
        className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      };
    case 'unqualified':
      return {
        label: 'Unqualified',
        className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      };
    case 'nurturing':
      return {
        label: 'Nurturing',
        className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      };
    default:
      return {
        label: status,
        className: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
      };
  }
}

function getStageBadge(stage: PipelineStage) {
  const map: Partial<Record<PipelineStage, string>> = {
    new: 'New Lead',
    contacted: 'Contacted',
    qualified: 'Qualified',
    discovery: 'Discovery',
    proposal: 'Proposal',
    negotiation: 'Negotiation',
    won: 'Closed Won',
    lost: 'Closed Lost',
  };
  return map[stage] || stage;
}

function getSourceLabel(source: LeadSource | string) {
  switch (source) {
    case 'website':
      return 'Direct Website Inbound';
    case 'referral':
      return 'Executive Referral';
    case 'linkedin':
      return 'LinkedIn Outreach';
    case 'whatsapp':
      return 'WhatsApp Omnichannel';
    case 'campaign':
      return 'Marketing Campaign';
    case 'cold_outreach':
    case 'cold-outreach':
      return 'Cold Outbound';
    default:
      return source;
  }
}

function getInitials(name: string): string {
  if (!name) return 'LD';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatSafeDate(dateStr?: string, pattern = 'MMM dd, yyyy'): string {
  if (!dateStr) return 'Not set';
  try {
    return format(parseISO(dateStr), pattern);
  } catch {
    return dateStr;
  }
}

function formatSafeRelative(dateStr?: string): string {
  if (!dateStr) return 'Never';
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
}

// =============================================================================
// Lead Detail Component
// =============================================================================

export function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Find initial lead by ID, fallback to mockLeads[0]
  const initialLead = useMemo(() => {
    return mockLeads.find((l) => l.id === id) || mockLeads[0];
  }, [id]);

  // Main Lead State
  const [lead, setLead] = useState<Lead>(initialLead);
  const [locationStr, setLocationStr] = useState('San Francisco, CA, USA');

  // Activity Timeline State (8-10 initial mock entries)
  const [timeline, setTimeline] = useState<TimelineEntry[]>([
    {
      id: 'tl-1',
      type: 'meeting_scheduled',
      title: 'Technical Demonstration Confirmed',
      description: 'Scheduled with Devon Vance and Enterprise Architecture team for deep dive into autonomous workflows.',
      timestamp: formatISO(subDays(new Date(), 1)),
      userName: 'Marcus Chen',
      userAvatar: 'MC',
    },
    {
      id: 'tl-2',
      type: 'note_added',
      title: 'Discovery Call Notes',
      description: 'Customer pain point: Current CRM data entry requires 12 hours/week per sales rep. Seeking AI voice and chat agents for tier 1 routing.',
      timestamp: formatISO(subDays(new Date(), 2)),
      userName: 'Marcus Chen',
      userAvatar: 'MC',
    },
    {
      id: 'tl-3',
      type: 'stage_changed',
      title: 'Pipeline Stage Updated',
      description: 'Stage advanced from Discovery to Proposal with $120,000 estimated ACV.',
      timestamp: formatISO(subDays(new Date(), 3)),
      userName: 'Marcus Chen',
      userAvatar: 'MC',
    },
    {
      id: 'tl-4',
      type: 'score_updated',
      title: 'AI Lead Score Increased to 94',
      description: 'Lead visited pricing calculator 4 times and downloaded SOC2 Compliance Whitepaper.',
      timestamp: formatISO(subDays(new Date(), 4)),
      userName: 'AI Engine',
      userAvatar: 'AI',
    },
    {
      id: 'tl-5',
      type: 'email_sent',
      title: 'Custom Proposal Sent',
      description: 'Sent email: "SKARWORLD Enterprise Blueprint & SLA Terms for Vanguard Logistics".',
      timestamp: formatISO(subDays(new Date(), 6)),
      userName: 'Marcus Chen',
      userAvatar: 'MC',
    },
    {
      id: 'tl-6',
      type: 'call_made',
      title: 'Inbound Discovery Call (32 mins)',
      description: 'Reviewed integration requirements with existing Snowflake and Salesforce instances.',
      timestamp: formatISO(subDays(new Date(), 9)),
      userName: 'Sarah Jenkins',
      userAvatar: 'SJ',
    },
    {
      id: 'tl-7',
      type: 'note_added',
      title: 'Security & Compliance Assessment',
      description: 'Passed initial security screening. Infosec requested self-hosted agent cluster documentation.',
      timestamp: formatISO(subDays(new Date(), 12)),
      userName: 'Elena Rostova',
      userAvatar: 'ER',
    },
    {
      id: 'tl-8',
      type: 'meeting_scheduled',
      title: 'Introductory Exploratory Sync',
      description: 'Intro call following high-scoring inbound form submission on website.',
      timestamp: formatISO(subDays(new Date(), 18)),
      userName: 'David Kim',
      userAvatar: 'DK',
    },
    {
      id: 'tl-9',
      type: 'email_sent',
      title: 'Automated AI Introduction',
      description: 'Omnichannel agent dispatched introduction sequence with calendar invite.',
      timestamp: formatISO(subDays(new Date(), 22)),
      userName: 'AI Agent',
      userAvatar: 'AI',
    },
  ]);

  // AI Research State
  const [isGeneratingResearch, setIsGeneratingResearch] = useState(false);
  const [researchTimestamp, setResearchTimestamp] = useState('Today at 09:30 AM (GPT-4o Deep Intel)');
  const [researchFindings, setResearchFindings] = useState<string[]>([
    'High Buying Intent: Active RFPs out for AI agent orchestration and sales pipeline automation.',
    'Executive Sponsorship: CTO Devon Vance directly evaluating vendors with $250k allocated Q4 budget.',
    'Technical Environment: Modern stack running AWS, Snowflake, and Zendesk with friction in manual routing.',
    'Expansion Trajectory: Growing sales & operations headcount by 42% YoY across North American hubs.',
    'Competitor Vulnerability: Disenchanted with legacy CRM add-ons due to high latency and lack of autonomous actions.',
  ]);

  // Conversation History State (3 messages)
  const [conversations, setConversations] = useState<ConversationSnippet[]>([
    {
      id: 'msg-1',
      channel: 'whatsapp',
      senderName: 'Marcus Chen',
      senderType: 'user',
      content:
        'Hi Devon, Marcus here from SKARWORLD. Sending over the updated SLA architecture and latency benchmark charts we reviewed.',
      timestamp: formatISO(subDays(new Date(), 1)),
    },
    {
      id: 'msg-2',
      channel: 'email',
      senderName: lead.fullName,
      senderType: 'lead',
      content:
        'Marcus, thanks for following up so promptly. Our infosec lead reviewed the SOC2 package and gave positive preliminary clearance.',
      timestamp: formatISO(subDays(new Date(), 2)),
    },
    {
      id: 'msg-3',
      channel: 'whatsapp',
      senderName: lead.fullName,
      senderType: 'lead',
      content:
        'Can we ensure our custom CRM webhook payload will be handled in real-time? Looking forward to tomorrow’s architecture call.',
      timestamp: formatISO(subDays(new Date(), 3)),
    },
  ]);

  // Associated Opportunities State
  const [opportunities, setOpportunities] = useState<LeadOpportunity[]>([
    {
      id: 'opp-1',
      title: `${lead.company} - Enterprise Agent Fleet Deployment`,
      value: lead.estimatedValue || 120000,
      stage: lead.pipelineStage,
      probability: 75,
      closeDate: format(addDays(new Date(), 24), 'yyyy-MM-dd'),
    },
    {
      id: 'opp-2',
      title: `${lead.company} - AI Voice Add-on Pilot`,
      value: 28000,
      stage: 'discovery',
      probability: 50,
      closeDate: format(addDays(new Date(), 45), 'yyyy-MM-dd'),
    },
  ]);

  // Follow-up Tasks State
  const [tasks, setTasks] = useState<LeadTask[]>([
    {
      id: 'tsk-1',
      title: 'Send updated enterprise security & data sovereignty addendum',
      dueDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      priority: 'high',
      completed: false,
      assignedToName: lead.assignedToName || 'Marcus Chen',
    },
    {
      id: 'tsk-2',
      title: 'Prepare custom interactive dashboard for tomorrow’s executive demo',
      dueDate: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
      priority: 'urgent',
      completed: false,
      assignedToName: lead.assignedToName || 'Marcus Chen',
    },
    {
      id: 'tsk-3',
      title: 'Check in on procurement legal approval with Devon Vance',
      dueDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
      priority: 'medium',
      completed: false,
      assignedToName: lead.assignedToName || 'Marcus Chen',
    },
  ]);

  // Score breakdown state
  const [scoreBreakdown, setScoreBreakdown] = useState({
    engagement: { score: 35, max: 40 },
    fit: { score: 28, max: 30 },
    behavior: { score: 20, max: 30 },
  });
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Dialog & Form UI states
  const [isEditLeadOpen, setIsEditLeadOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isCreateOppOpen, setIsCreateOppOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isSendMessageOpen, setIsSendMessageOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isViewAllChatOpen, setIsViewAllChatOpen] = useState(false);

  // Edit lead form state
  const [editForm, setEditForm] = useState({
    firstName: lead.firstName,
    lastName: lead.lastName,
    title: lead.title,
    company: lead.company,
    email: lead.email,
    phone: lead.phone,
    website: 'https://vanguardlogistics.com',
    industry: lead.industry,
    location: locationStr,
    estimatedValue: lead.estimatedValue || 120000,
  });

  // Note composer state
  const [noteContent, setNoteContent] = useState('');
  const [noteType, setNoteType] = useState<ActivityType>('note_added');

  // Opportunity create form state
  const [newOppForm, setNewOppForm] = useState({
    title: `${lead.company} - Expansion License`,
    value: 65000,
    stage: 'discovery' as PipelineStage,
    probability: 60,
    closeDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
  });

  // Task create form state
  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    dueDate: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
  });

  // Send message form state
  const [sendMessageForm, setSendMessageForm] = useState({
    channel: 'whatsapp' as ChannelType,
    subject: '',
    message: '',
  });

  // Schedule follow-up state
  const [scheduleForm, setScheduleForm] = useState({
    date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    time: '14:00',
    title: 'Strategy & Architecture Alignment Call',
    notes: '',
  });

  // New tag input state
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  // Circular Score calculation
  const scoreColors = getScoreColor(lead.leadScore);
  const radius = 54;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (lead.leadScore / 100) * circumference;

  // ---------------------------------------------------------------------------
  // Action Handlers
  // ---------------------------------------------------------------------------

  const handleEditLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLead((prev) => ({
      ...prev,
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      fullName: `${editForm.firstName} ${editForm.lastName}`.trim(),
      title: editForm.title,
      company: editForm.company,
      email: editForm.email,
      phone: editForm.phone,
      industry: editForm.industry,
      estimatedValue: Number(editForm.estimatedValue),
    }));
    setLocationStr(editForm.location);
    setIsEditLeadOpen(false);
    toast({
      title: 'Lead Profile Updated',
      description: 'Contact and company records have been saved.',
    });
  };

  const handleGenerateResearch = () => {
    setIsGeneratingResearch(true);
    setTimeout(() => {
      setIsGeneratingResearch(false);
      setResearchTimestamp(`Today at ${format(new Date(), 'hh:mm a')} (Live Enriched)`);
      setResearchFindings((prev) => [
        `Live Signal (${format(new Date(), 'HH:mm')}): Company filed Form 8-K signaling infrastructure transformation initiatives.`,
        ...prev.slice(0, 4),
      ]);
      toast({
        title: 'AI Intelligence Refreshed',
        description: 'New verified signals synthesized from live data connectors.',
      });
    }, 1200);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    const newEntry: TimelineEntry = {
      id: `tl-${Date.now()}`,
      type: noteType,
      title:
        noteType === 'call_made'
          ? 'Call Log Recorded'
          : noteType === 'email_sent'
          ? 'Email Activity Logged'
          : 'Sales Note Added',
      description: noteContent.trim(),
      timestamp: formatISO(new Date()),
      userName: lead.assignedToName || 'Marcus Chen',
      userAvatar: getInitials(lead.assignedToName || 'MC'),
    };

    setTimeline([newEntry, ...timeline]);
    setNoteContent('');
    setIsAddNoteOpen(false);

    toast({
      title: 'Activity Logged',
      description: 'Your note was posted to the chronological timeline.',
    });
  };

  const handleRecalculateScore = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
      const newScore = Math.min(99, Math.max(65, lead.leadScore + (lead.leadScore > 90 ? -2 : 4)));
      setLead((prev) => ({
        ...prev,
        leadScore: newScore,
        scoreTrend: 'up',
      }));
      setScoreBreakdown({
        engagement: { score: 37, max: 40 },
        fit: { score: 29, max: 30 },
        behavior: { score: 22, max: 30 },
      });
      // Add timeline entry
      setTimeline((prev) => [
        {
          id: `tl-${Date.now()}`,
          type: 'score_updated',
          title: `AI Score Recalculated (${newScore}/100)`,
          description: 'Recalculated based on latest content engagement, email opens, and hiring signals.',
          timestamp: formatISO(new Date()),
          userName: 'AI Engine',
          userAvatar: 'AI',
        },
        ...prev,
      ]);
      toast({
        title: 'Score Recalculated',
        description: `Lead score re-weighted to ${newScore}/100.`,
      });
    }, 900);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setLead((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
    toast({
      title: 'Tag Removed',
      description: `Tag "${tagToRemove}" removed.`,
    });
  };

  const handleAddTagSubmit = () => {
    if (!newTagInput.trim()) return;
    const tag = newTagInput.trim();
    if (!lead.tags.includes(tag)) {
      setLead((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      toast({
        title: 'Tag Added',
        description: `Added "${tag}" to lead tags.`,
      });
    }
    setNewTagInput('');
    setIsAddingTag(false);
  };

  const handleChangeStage = (newStage: PipelineStage) => {
    setLead((prev) => ({
      ...prev,
      pipelineStage: newStage,
    }));
    // Add timeline entry
    setTimeline((prev) => [
      {
        id: `tl-${Date.now()}`,
        type: 'stage_changed',
        title: `Pipeline Stage Moved to ${getStageBadge(newStage)}`,
        description: `Stage updated by ${lead.assignedToName || 'Marcus Chen'}.`,
        timestamp: formatISO(new Date()),
        userName: lead.assignedToName || 'Marcus Chen',
        userAvatar: getInitials(lead.assignedToName || 'MC'),
      },
      ...prev,
    ]);
    toast({
      title: 'Stage Updated',
      description: `Lead moved to ${getStageBadge(newStage)}.`,
    });
  };

  const handleQualifyLead = () => {
    setLead((prev) => ({
      ...prev,
      status: 'qualified',
      pipelineStage: 'qualified',
      leadScore: Math.max(88, prev.leadScore),
    }));
    setTimeline((prev) => [
      {
        id: `tl-${Date.now()}`,
        type: 'stage_changed',
        title: 'Lead Formally Qualified',
        description: 'Meets ICP threshold for enterprise tier qualification.',
        timestamp: formatISO(new Date()),
        userName: lead.assignedToName || 'Marcus Chen',
        userAvatar: getInitials(lead.assignedToName || 'MC'),
      },
      ...prev,
    ]);
    toast({
      title: 'Lead Qualified',
      description: `${lead.fullName} has been confirmed as a Qualified opportunity.`,
    });
  };

  const handleReassignUser = (user: (typeof mockUsers)[0]) => {
    setLead((prev) => ({
      ...prev,
      assignedToId: user.id,
      assignedToName: user.name,
    }));
    toast({
      title: 'Lead Reassigned',
      description: `Assigned to ${user.name} (${user.title}).`,
    });
  };

  const handleCreateOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    const newOpp: LeadOpportunity = {
      id: `opp-${Date.now()}`,
      title: newOppForm.title,
      value: Number(newOppForm.value),
      stage: newOppForm.stage,
      probability: Number(newOppForm.probability),
      closeDate: newOppForm.closeDate,
    };
    setOpportunities([newOpp, ...opportunities]);
    setIsCreateOppOpen(false);
    toast({
      title: 'Opportunity Created',
      description: `Created "${newOpp.title}" ($${newOpp.value.toLocaleString()}).`,
    });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskForm.title.trim()) return;

    const newTask: LeadTask = {
      id: `tsk-${Date.now()}`,
      title: newTaskForm.title.trim(),
      dueDate: newTaskForm.dueDate,
      priority: newTaskForm.priority,
      completed: false,
      assignedToName: lead.assignedToName || 'Marcus Chen',
    };
    setTasks([newTask, ...tasks]);
    setNewTaskForm({
      title: '',
      dueDate: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
      priority: 'medium',
    });
    setIsCreateTaskOpen(false);
    toast({
      title: 'Follow-up Task Scheduled',
      description: `Task assigned for ${formatSafeDate(newTask.dueDate)}.`,
    });
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendMessageForm.message.trim()) return;

    const newSnippet: ConversationSnippet = {
      id: `msg-${Date.now()}`,
      channel: sendMessageForm.channel,
      senderName: lead.assignedToName || 'Marcus Chen',
      senderType: 'user',
      content: sendMessageForm.message.trim(),
      timestamp: formatISO(new Date()),
    };

    setConversations([newSnippet, ...conversations.slice(0, 2)]);

    // Add to timeline
    setTimeline((prev) => [
      {
        id: `tl-${Date.now()}`,
        type: sendMessageForm.channel === 'email' ? 'email_sent' : 'note_added',
        title: `Outbound ${sendMessageForm.channel === 'whatsapp' ? 'WhatsApp Message' : 'Email'} Dispatched`,
        description: sendMessageForm.message.trim(),
        timestamp: formatISO(new Date()),
        userName: lead.assignedToName || 'Marcus Chen',
        userAvatar: getInitials(lead.assignedToName || 'MC'),
      },
      ...prev,
    ]);

    setSendMessageForm({
      channel: 'whatsapp',
      subject: '',
      message: '',
    });
    setIsSendMessageOpen(false);

    toast({
      title: 'Message Sent',
      description: 'Your communication was delivered via the omnichannel connector.',
    });
  };

  const handleScheduleFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    setLead((prev) => ({
      ...prev,
      nextFollowUpDate: formatISO(new Date(`${scheduleForm.date}T${scheduleForm.time}:00`)),
    }));

    setTimeline((prev) => [
      {
        id: `tl-${Date.now()}`,
        type: 'meeting_scheduled',
        title: scheduleForm.title,
        description: `Scheduled for ${formatSafeDate(scheduleForm.date)} at ${scheduleForm.time}. ${scheduleForm.notes}`,
        timestamp: formatISO(new Date()),
        userName: lead.assignedToName || 'Marcus Chen',
        userAvatar: getInitials(lead.assignedToName || 'MC'),
      },
      ...prev,
    ]);

    setIsScheduleOpen(false);
    toast({
      title: 'Follow-up Scheduled',
      description: `Event set for ${scheduleForm.date} at ${scheduleForm.time}. Calendar invites sent.`,
    });
  };

  const statusConfig = getStatusBadge(lead.status);

  return (
    <div className="space-y-6">
      {/* 1. Breadcrumbs / Top Navigation */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/leads')}
            className="h-9 w-9 shadow-xs"
            aria-label="Back to leads list"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {lead.fullName}
              </h1>
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                  statusConfig.className
                )}
              >
                {statusConfig.label}
              </span>
              <Badge variant="outline" className="text-xs">
                {getStageBadge(lead.pipelineStage)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {lead.title} at <span className="font-medium text-foreground">{lead.company}</span>
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSendMessageOpen(true)}
            className="gap-1.5 shadow-xs"
          >
            <Send className="h-4 w-4 text-primary" />
            <span>Message</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsScheduleOpen(true)}
            className="gap-1.5 shadow-xs"
          >
            <Calendar className="h-4 w-4" />
            <span>Schedule</span>
          </Button>

          {lead.status !== 'qualified' && (
            <Button
              size="sm"
              onClick={handleQualifyLead}
              className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Qualify Lead</span>
            </Button>
          )}

          <Button
            size="sm"
            onClick={() => setIsEditLeadOpen(true)}
            className="gap-1.5 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Lead</span>
          </Button>
        </div>
      </div>

      {/* 2. Main 2/3 + 1/3 Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* =================================================================== */}
        {/* LEFT COLUMN (2/3)                                                   */}
        {/* =================================================================== */}
        <div className="space-y-6 lg:col-span-2">
          {/* Card 1: Contact & Company Card */}
          <Card className="shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 ring-2 ring-primary/20 text-lg font-bold">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(lead.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl font-bold">{lead.fullName}</CardTitle>
                    <p className="text-sm font-medium text-muted-foreground">{lead.title}</p>
                    <div className="mt-1 flex items-center gap-2 text-sm text-foreground font-semibold">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{lead.company}</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditLeadOpen(true)}
                  className="gap-1.5"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-2">
              <div className="grid grid-cols-1 gap-4 rounded-xl border border-border bg-muted/20 p-4 sm:grid-cols-2">
                {/* Email */}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Work Email</p>
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors hover:underline truncate block"
                    >
                      {lead.email}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Direct Phone</p>
                    <a
                      href={`tel:${lead.phone}`}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors hover:underline truncate block"
                    >
                      {lead.phone}
                    </a>
                  </div>
                </div>

                {/* Website */}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Corporate Site</p>
                    <a
                      href={editForm.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors hover:underline truncate"
                    >
                      <span>{editForm.website.replace(/^https?:\/\//, '')}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </div>
                </div>

                {/* Industry & Location */}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Industry & Location</p>
                    <p className="text-sm font-medium text-foreground truncate">
                      {lead.industry} • {locationStr}
                    </p>
                  </div>
                </div>
              </div>

              {lead.notes && (
                <div className="mt-4 rounded-lg border border-border/80 bg-background p-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Context & Lead Notes
                  </p>
                  <p className="text-sm text-foreground">{lead.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 2: AI Research Summary Card */}
          <Card className="border-primary/20 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 h-28 w-28 bg-primary/5 rounded-bl-full pointer-events-none" />

            <CardHeader className="pb-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">AI Company Intelligence Dossier</CardTitle>
                    <CardDescription className="text-xs">
                      Continuous real-time enrichment via 24 live data channels
                    </CardDescription>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateResearch}
                  disabled={isGeneratingResearch}
                  className="gap-2 border-primary/30 text-primary hover:bg-primary/5 shadow-xs"
                >
                  {isGeneratingResearch ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Generate Research</span>
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-1">
              {/* Executive Summary */}
              <div className="rounded-lg bg-muted/30 p-3.5 border border-border/60">
                <p className="text-sm text-foreground leading-relaxed">
                  <strong className="text-foreground">{lead.company}</strong> is a high-growth leader in the {lead.industry.toLowerCase()} vertical.
                  They have scaled past 450 enterprise clients and are undergoing a strategic automation overhaul to eliminate manual CRM triage. CTO {lead.fullName} holds full technical and budgetary sign-off for autonomous sales operations software.
                </p>
              </div>

              {/* Key Findings Bullet Points */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Key Strategic Findings
                </p>
                <div className="space-y-2">
                  {researchFindings.map((finding, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 rounded-lg border border-border/50 bg-card p-2.5 text-xs text-foreground transition-colors hover:border-primary/30"
                    >
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="leading-snug">{finding}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Last researched timestamp */}
              <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border pt-3">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>Last verified: {researchTimestamp}</span>
                </span>
                <span className="font-mono text-primary font-medium">Model: SKAR-DeepIntel-v2</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Activity Timeline */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Activity Timeline</CardTitle>
                  <CardDescription className="text-xs">
                    Chronological audit of all automated &amp; human touchpoints
                  </CardDescription>
                </div>

                <Button
                  size="sm"
                  onClick={() => setIsAddNoteOpen(true)}
                  className="gap-1.5 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Note</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
                {timeline.map((entry) => {
                  let IconComponent = FileText;
                  let iconColor = 'text-primary bg-primary/10 border-primary/20';

                  switch (entry.type) {
                    case 'meeting_scheduled':
                      IconComponent = Calendar;
                      iconColor = 'text-blue-600 bg-blue-500/10 border-blue-500/20';
                      break;
                    case 'email_sent':
                      IconComponent = Mail;
                      iconColor = 'text-sky-600 bg-sky-500/10 border-sky-500/20';
                      break;
                    case 'call_made':
                      IconComponent = PhoneCall;
                      iconColor = 'text-amber-600 bg-amber-500/10 border-amber-500/20';
                      break;
                    case 'stage_changed':
                      IconComponent = GitCommit;
                      iconColor = 'text-purple-600 bg-purple-500/10 border-purple-500/20';
                      break;
                    case 'score_updated':
                      IconComponent = TrendingUp;
                      iconColor = 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20';
                      break;
                    default:
                      IconComponent = FileText;
                      iconColor = 'text-primary bg-primary/10 border-primary/20';
                  }

                  return (
                    <div key={entry.id} className="relative group">
                      {/* Timeline dot icon */}
                      <div
                        className={cn(
                          'absolute -left-[30px] top-0.5 flex h-7 w-7 items-center justify-center rounded-full border shadow-xs transition-transform group-hover:scale-110',
                          iconColor
                        )}
                      >
                        <IconComponent className="h-3.5 w-3.5" />
                      </div>

                      {/* Content */}
                      <div className="rounded-lg border border-border bg-card p-3.5 shadow-2xs transition-colors hover:border-border/80">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-semibold text-foreground">
                            {entry.title}
                          </h4>
                          <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                            {formatSafeRelative(entry.timestamp)}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                          {entry.description}
                        </p>

                        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <Avatar className="h-4 w-4 text-[9px]">
                            <AvatarFallback className="bg-muted text-foreground">
                              {entry.userAvatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground">{entry.userName}</span>
                          <span>•</span>
                          <span>{formatSafeDate(entry.timestamp, 'MMM d, h:mm a')}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Conversation History Card */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">Omnichannel Conversations</CardTitle>
                    <CardDescription className="text-xs">
                      Recent interactions across WhatsApp, Email, and Web chat
                    </CardDescription>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsViewAllChatOpen(true)}
                  className="gap-1.5 shadow-xs text-xs"
                >
                  <span>View All Conversations</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {conversations.map((msg) => (
                <div
                  key={msg.id}
                  className="flex flex-col gap-2 rounded-xl border border-border bg-muted/20 p-3.5 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                          msg.channel === 'whatsapp'
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/20'
                        )}
                      >
                        {msg.channel}
                      </span>
                      <span className="text-xs font-semibold text-foreground">
                        {msg.senderName}
                      </span>
                      {msg.senderType === 'lead' ? (
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                          Prospect
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                          Team
                        </Badge>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {formatSafeRelative(msg.timestamp)}
                    </span>
                  </div>

                  <p className="text-xs text-foreground leading-relaxed pl-1">
                    &quot;{msg.content}&quot;
                  </p>
                </div>
              ))}

              <div className="pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSendMessageOpen(true)}
                  className="w-full gap-2 border border-dashed border-border text-xs text-primary hover:bg-primary/5"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Quick Reply via WhatsApp or Email</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN (1/3)                                                  */}
        {/* =================================================================== */}
        <div className="space-y-6">
          {/* Card 1: Lead Score Card */}
          <Card className="shadow-xs text-center">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">AI Lead Score</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRecalculateScore}
                  disabled={isRecalculating}
                  className="h-8 gap-1 text-xs text-primary"
                >
                  <RefreshCw className={cn('h-3 w-3', isRecalculating && 'animate-spin')} />
                  <span>Recalculate</span>
                </Button>
              </div>
              <CardDescription className="text-xs">
                Predictive conversion probability
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              {/* Circular Gauge */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative flex items-center justify-center">
                  <svg className="h-36 w-36 -rotate-90 transform" viewBox="0 0 128 128">
                    {/* Background Ring */}
                    <circle
                      cx="64"
                      cy="64"
                      r={radius}
                      stroke="currentColor"
                      strokeWidth={strokeWidth}
                      fill="transparent"
                      className="text-muted/40"
                    />
                    {/* Dynamic Colored Ring */}
                    <circle
                      cx="64"
                      cy="64"
                      r={radius}
                      stroke={scoreColors.stroke}
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>

                  {/* Centered Number */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={cn('text-3xl font-extrabold font-mono tracking-tight', scoreColors.text)}>
                      {lead.leadScore}
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
                      out of 100
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>High Purchase Velocity (+8 pts)</span>
                </div>
              </div>

              {/* Breakdown Bars */}
              <div className="space-y-3 rounded-lg border border-border/70 bg-muted/20 p-3 text-left">
                {/* Engagement */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Engagement</span>
                    <span className="font-mono text-foreground font-semibold">
                      {scoreBreakdown.engagement.score}/{scoreBreakdown.engagement.max}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{
                        width: `${(scoreBreakdown.engagement.score / scoreBreakdown.engagement.max) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Fit */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">ICP Fit</span>
                    <span className="font-mono text-foreground font-semibold">
                      {scoreBreakdown.fit.score}/{scoreBreakdown.fit.max}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${(scoreBreakdown.fit.score / scoreBreakdown.fit.max) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Behavior */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Behavior Intent</span>
                    <span className="font-mono text-foreground font-semibold">
                      {scoreBreakdown.behavior.score}/{scoreBreakdown.behavior.max}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${(scoreBreakdown.behavior.score / scoreBreakdown.behavior.max) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Details Card */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Lead Metadata</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3.5 text-xs">
              {/* Status */}
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-muted-foreground">Status</span>
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                    statusConfig.className
                  )}
                >
                  {statusConfig.label}
                </span>
              </div>

              {/* Pipeline Stage */}
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-muted-foreground">Pipeline Stage</span>
                <Badge variant="outline" className="font-normal text-xs">
                  {getStageBadge(lead.pipelineStage)}
                </Badge>
              </div>

              {/* Source */}
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-muted-foreground">Lead Source</span>
                <span className="font-medium text-foreground">{getSourceLabel(lead.source)}</span>
              </div>

              {/* Assigned To */}
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-muted-foreground">Assigned Rep</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1.5 font-medium text-foreground hover:text-primary transition-colors">
                      <Avatar className="h-5 w-5 text-[9px]">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(lead.assignedToName || 'MC')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{lead.assignedToName || 'Marcus Chen'}</span>
                      <ChevronDown className="h-3 w-3 opacity-60" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="text-xs">Reassign Lead</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {mockUsers.map((user) => (
                      <DropdownMenuItem
                        key={user.id}
                        onClick={() => handleReassignUser(user)}
                        className="gap-2 text-xs"
                      >
                        <Avatar className="h-5 w-5 text-[9px]">
                          <AvatarFallback>{user.avatar}</AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Created Date */}
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-muted-foreground">Created Date</span>
                <span className="font-medium text-foreground">
                  {formatSafeDate(lead.createdAt)}
                </span>
              </div>

              {/* Last Interaction */}
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-muted-foreground">Last Interaction</span>
                <span className="font-medium text-foreground">
                  {formatSafeRelative(lead.lastInteractionAt)}
                </span>
              </div>

              {/* Next Follow-up */}
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-muted-foreground">Next Follow-up</span>
                <span className="font-medium text-primary">
                  {formatSafeDate(lead.nextFollowUpDate)}
                </span>
              </div>

              {/* Tags with remove button */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">Tags</span>
                  {!isAddingTag && (
                    <button
                      type="button"
                      onClick={() => setIsAddingTag(true)}
                      className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-0.5"
                    >
                      <Plus className="h-3 w-3" />
                      Add Tag
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {lead.tags && lead.tags.length > 0 ? (
                    lead.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="gap-1 px-2 py-0.5 text-[11px] font-normal"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-muted-foreground hover:text-foreground"
                          aria-label={`Remove tag ${tag}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground italic">No tags assigned</span>
                  )}
                </div>

                {isAddingTag && (
                  <div className="flex items-center gap-1.5 pt-1">
                    <Input
                      placeholder="New tag..."
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTagSubmit();
                        }
                      }}
                      className="h-7 text-xs"
                      autoFocus
                    />
                    <Button size="sm" className="h-7 px-2 text-xs" onClick={handleAddTagSubmit}>
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-1.5 text-xs"
                      onClick={() => setIsAddingTag(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Quick Actions Card */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2.5">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 h-9 text-xs"
                onClick={() => setIsSendMessageOpen(true)}
              >
                <MessageSquare className="h-4 w-4 text-primary" />
                <span>Start Conversation</span>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-2 h-9 text-xs"
                onClick={() => setIsScheduleOpen(true)}
              >
                <Calendar className="h-4 w-4 text-emerald-600" />
                <span>Schedule Follow-up</span>
              </Button>

              {/* Change Stage Dropdown */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">Change Pipeline Stage</label>
                <Select
                  value={lead.pipelineStage}
                  onValueChange={(val) => handleChangeStage(val as PipelineStage)}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Advance Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="discovery">Discovery</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="won">Closed Won</SelectItem>
                    <SelectItem value="lost">Closed Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {lead.status !== 'qualified' && (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 h-9 text-xs border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                  onClick={handleQualifyLead}
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Qualify Lead Immediately</span>
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full justify-start gap-2 h-9 text-xs"
                onClick={() => setIsCreateTaskOpen(true)}
              >
                <CheckSquare className="h-4 w-4 text-indigo-600" />
                <span>Create Task</span>
              </Button>
            </CardContent>
          </Card>

          {/* Card 4: Associated Opportunities Card */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Associated Deals</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCreateOppOpen(true)}
                  className="h-7 px-2 text-xs text-primary gap-1"
                >
                  <Plus className="h-3 w-3" />
                  <span>New Deal</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-2.5">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="rounded-lg border border-border bg-card p-3 shadow-2xs space-y-1.5 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs font-semibold text-foreground leading-snug">
                      {opp.title}
                    </h5>
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {opp.stage}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                    <span className="font-bold text-foreground font-mono">
                      ${opp.value.toLocaleString()}
                    </span>
                    <span className="text-[11px]">Prob: {opp.probability}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Card 5: Follow-up Tasks Card */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Follow-up Tasks</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCreateTaskOpen(true)}
                  className="h-7 px-2 text-xs text-primary gap-1"
                >
                  <Plus className="h-3 w-3" />
                  <span>Create Task</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-2.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    'flex items-start gap-2.5 rounded-lg border border-border bg-card p-2.5 transition-colors',
                    task.completed && 'opacity-60 bg-muted/30'
                  )}
                >
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleToggleTask(task.id)}
                    className="mt-0.5"
                    aria-label={`Mark task completed: ${task.title}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'text-xs font-medium text-foreground leading-snug',
                        task.completed && 'line-through text-muted-foreground'
                      )}
                    >
                      {task.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>Due {formatSafeDate(task.dueDate, 'MMM d')}</span>
                      <span>•</span>
                      <span
                        className={cn(
                          'font-semibold uppercase tracking-wider',
                          task.priority === 'urgent' && 'text-rose-600',
                          task.priority === 'high' && 'text-amber-600',
                          task.priority === 'medium' && 'text-blue-600',
                          task.priority === 'low' && 'text-slate-500'
                        )}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* DIALOGS                                                               */}
      {/* ===================================================================== */}

      {/* 1. Edit Lead Modal */}
      <Dialog open={isEditLeadOpen} onOpenChange={setIsEditLeadOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-primary" />
              <span>Edit Lead Profile</span>
            </DialogTitle>
            <DialogDescription>
              Update contact info, company details, or estimated pipeline value.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditLeadSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="editFirstName">First Name</Label>
                <Input
                  id="editFirstName"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editLastName">Last Name</Label>
                <Input
                  id="editLastName"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="editCompany">Company</Label>
                <Input
                  id="editCompany"
                  value={editForm.company}
                  onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editTitle">Job Title</Label>
                <Input
                  id="editTitle"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="editEmail">Email Address</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editPhone">Phone</Label>
                <Input
                  id="editPhone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="editWebsite">Website</Label>
                <Input
                  id="editWebsite"
                  value={editForm.website}
                  onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editLocation">Location</Label>
                <Input
                  id="editLocation"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="editValue">Estimated ACV ($ USD)</Label>
              <Input
                id="editValue"
                type="number"
                value={editForm.estimatedValue}
                onChange={(e) =>
                  setEditForm({ ...editForm, estimatedValue: Number(e.target.value) })
                }
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsEditLeadOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Add Note Modal */}
      <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Add Activity Note</span>
            </DialogTitle>
            <DialogDescription>
              Record call summaries, demo feedback, or discovery notes.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddNote} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="noteCategory">Activity Type</Label>
              <Select
                value={noteType}
                onValueChange={(val) => setNoteType(val as ActivityType)}
              >
                <SelectTrigger id="noteCategory">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="note_added">General Note</SelectItem>
                  <SelectItem value="call_made">Phone / Discovery Call</SelectItem>
                  <SelectItem value="email_sent">Email Touchpoint</SelectItem>
                  <SelectItem value="meeting_scheduled">Meeting Note</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="noteTextArea">Note Description</Label>
              <Textarea
                id="noteTextArea"
                placeholder="Enter detailed observations, requirements, or next action items..."
                rows={4}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddNoteOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!noteContent.trim()}>
                Save to Timeline
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 3. Send Message Dialog */}
      <Dialog open={isSendMessageOpen} onOpenChange={setIsSendMessageOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              <span>Send Omnichannel Message</span>
            </DialogTitle>
            <DialogDescription>
              Dispatches directly to {lead.fullName} via verified enterprise connectors.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSendMessage} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="sendChannel">Channel</Label>
              <Select
                value={sendMessageForm.channel}
                onValueChange={(val) =>
                  setSendMessageForm({ ...sendMessageForm, channel: val as ChannelType })
                }
              >
                <SelectTrigger id="sendChannel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp Business API</SelectItem>
                  <SelectItem value="email">Corporate Email</SelectItem>
                  <SelectItem value="web_chat">Website Chat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {sendMessageForm.channel === 'email' && (
              <div className="space-y-1.5">
                <Label htmlFor="emailSubject">Subject</Label>
                <Input
                  id="emailSubject"
                  placeholder="e.g. Follow up on our AI Architecture Discussion"
                  value={sendMessageForm.subject}
                  onChange={(e) =>
                    setSendMessageForm({ ...sendMessageForm, subject: e.target.value })
                  }
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="messageContent">Message Body</Label>
              <Textarea
                id="messageContent"
                placeholder="Type your message or ask AI to draft a contextual proposal..."
                rows={4}
                value={sendMessageForm.message}
                onChange={(e) =>
                  setSendMessageForm({ ...sendMessageForm, message: e.target.value })
                }
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsSendMessageOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!sendMessageForm.message.trim()} className="gap-2">
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 4. Schedule Follow-up Dialog */}
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Schedule Follow-up</span>
            </DialogTitle>
            <DialogDescription>
              Book next meeting or calendar reminder with {lead.fullName}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleScheduleFollowUp} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="eventTitle">Event Title</Label>
              <Input
                id="eventTitle"
                value={scheduleForm.title}
                onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="eventDate">Date</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="eventTime">Time</Label>
                <Input
                  id="eventTime"
                  type="time"
                  value={scheduleForm.time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="eventNotes">Agenda Notes</Label>
              <Textarea
                id="eventNotes"
                placeholder="Key talking points or deliverables to prepare..."
                rows={3}
                value={scheduleForm.notes}
                onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsScheduleOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Schedule Event</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 5. Create Opportunity Modal */}
      <Dialog open={isCreateOppOpen} onOpenChange={setIsCreateOppOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span>Create Opportunity Deal</span>
            </DialogTitle>
            <DialogDescription>
              Attach a new revenue pipeline deal to this prospect account.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateOpportunity} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="oppTitle">Deal Name</Label>
              <Input
                id="oppTitle"
                value={newOppForm.title}
                onChange={(e) => setNewOppForm({ ...newOppForm, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="oppValue">Value ($ USD)</Label>
                <Input
                  id="oppValue"
                  type="number"
                  value={newOppForm.value}
                  onChange={(e) =>
                    setNewOppForm({ ...newOppForm, value: Number(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="oppProb">Probability (%)</Label>
                <Input
                  id="oppProb"
                  type="number"
                  min={0}
                  max={100}
                  value={newOppForm.probability}
                  onChange={(e) =>
                    setNewOppForm({ ...newOppForm, probability: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="oppStage">Pipeline Stage</Label>
                <Select
                  value={newOppForm.stage}
                  onValueChange={(val) =>
                    setNewOppForm({ ...newOppForm, stage: val as PipelineStage })
                  }
                >
                  <SelectTrigger id="oppStage">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discovery">Discovery</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="won">Closed Won</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="oppCloseDate">Expected Close</Label>
                <Input
                  id="oppCloseDate"
                  type="date"
                  value={newOppForm.closeDate}
                  onChange={(e) =>
                    setNewOppForm({ ...newOppForm, closeDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOppOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Deal</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 6. Create Task Modal */}
      <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-primary" />
              <span>Create Follow-up Task</span>
            </DialogTitle>
            <DialogDescription>
              Assign an action item to your team for this lead.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTask} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="taskTitle">Task Summary</Label>
              <Input
                id="taskTitle"
                placeholder="e.g. Send revised security agreement"
                value={newTaskForm.title}
                onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="taskDue">Due Date</Label>
                <Input
                  id="taskDue"
                  type="date"
                  value={newTaskForm.dueDate}
                  onChange={(e) =>
                    setNewTaskForm({ ...newTaskForm, dueDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="taskPriority">Priority</Label>
                <Select
                  value={newTaskForm.priority}
                  onValueChange={(val) =>
                    setNewTaskForm({
                      ...newTaskForm,
                      priority: val as 'low' | 'medium' | 'high' | 'urgent',
                    })
                  }
                >
                  <SelectTrigger id="taskPriority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateTaskOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!newTaskForm.title.trim()}>
                Create Task
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 7. View All Conversations Modal */}
      <Dialog open={isViewAllChatOpen} onOpenChange={setIsViewAllChatOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span>Full Omnichannel Thread with {lead.fullName}</span>
            </DialogTitle>
            <DialogDescription>
              Continuous communication log synced with WhatsApp and Email.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3">
            {conversations.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex flex-col gap-1 rounded-xl p-3 max-w-[85%]',
                  msg.senderType === 'user'
                    ? 'ml-auto bg-primary text-primary-foreground'
                    : 'mr-auto bg-muted border border-border text-foreground'
                )}
              >
                <div className="flex items-center justify-between gap-2 text-[11px] opacity-80">
                  <span className="font-semibold">{msg.senderName}</span>
                  <span>{formatSafeDate(msg.timestamp, 'MMM d, h:mm a')}</span>
                </div>
                <p className="text-xs leading-relaxed mt-0.5">{msg.content}</p>
                <span className="text-[10px] uppercase font-mono opacity-60 self-end mt-1">
                  via {msg.channel}
                </span>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsViewAllChatOpen(false);
                setIsSendMessageOpen(true);
              }}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              <span>Reply</span>
            </Button>
            <Button onClick={() => setIsViewAllChatOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default LeadDetailPage;
