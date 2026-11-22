import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Approval, ApprovalStatus, ApprovalType } from '@/types';
import { format, parseISO, isPast } from 'date-fns';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  DollarSign,
  Calendar,
  User,
  MessageSquareQuote,
  Clock,
  History,
  Tag,
  Building,
  Check,
} from 'lucide-react';

interface ExtendedApprovalAIRecommendation {
  action: 'recommend_approval' | 'recommend_rejection' | 'require_higher_margin';
  confidence: number;
  rationale: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface ExtendedApproval extends Omit<Approval, 'aiRecommendation' | 'createdAt'> {
  createdAt: string;
  deadline: string;
  conversationContext: string;
  aiRecommendation: ExtendedApprovalAIRecommendation;
  auditTrail: {
    id: string;
    action: string;
    actor: string;
    timestamp: string;
    comments?: string;
  }[];
}

const INITIAL_APPROVALS: ExtendedApproval[] = [
  {
    id: 'appr-001',
    type: 'discount',
    title: '25% Annual Prepayment Discount Request',
    requestedById: 'user-003',
    requestedByName: 'Marcus Chen',
    leadId: 'lead-001',
    leadName: 'Sarah Jenkins',
    company: 'CloudScale Tech',
    opportunityId: 'opp-101',
    status: 'pending',
    amount: 145000,
    discountPercent: 25,
    terms: 'Multi-year commitment (24 months) paid upfront in exchange for 25% discount on Enterprise tier licenses.',
    reason: 'Customer is comparing with competitor and insists on 25% discount to execute contract before fiscal quarter end.',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 14).toISOString(), // 14 hours left
    conversationContext:
      'Sarah Jenkins (CTO): "We have executive signoff for $145,000 upfront, but only if you can hit our 25% enterprise discount benchmark. Otherwise we will proceed with Datadog."',
    aiRecommendation: {
      action: 'recommend_approval',
      confidence: 94,
      rationale:
        'CloudScale has an estimated LTV of $380,000. Upfront 24-month cash payment eliminates churn risk and increases net present value by 18.4%.',
      riskLevel: 'low',
    },
    tenantId: 'tenant-001',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    auditTrail: [
      {
        id: 'aud-1',
        action: 'Created approval request',
        actor: 'Marcus Chen',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        comments: 'Submitted for manager review prior to sending revised proposal.',
      },
    ],
  },
  {
    id: 'appr-002',
    type: 'high_value_proposal',
    title: 'Tier-1 Enterprise Custom Deployment Proposal',
    requestedById: 'user-002',
    requestedByName: 'Elena Rostova',
    leadId: 'lead-002',
    leadName: 'Michael Chang',
    company: 'Finovate Capital',
    opportunityId: 'opp-102',
    status: 'pending',
    amount: 320000,
    terms: 'Dedicated VPC cluster deployment in AWS us-east-1, custom SOC-2 Type II audit report rights, and 99.99% uptime guarantee with financial remedies.',
    reason: 'Deal size exceeds standard $250k AE authorization ceiling and includes customized SLA penalty terms.',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(),
    conversationContext:
      'Michael Chang (VP Tech): "Our legal counsel demands a 99.99% uptime guarantee with 10% SLA credit per hour of outage. If agreed, we sign by Thursday."',
    aiRecommendation: {
      action: 'require_higher_margin',
      confidence: 86,
      rationale:
        'Financial penalties on 99.99% SLA represent moderate liability. Recommend countering with standard 99.9% uptime SLA with capped credits.',
      riskLevel: 'medium',
    },
    tenantId: 'tenant-001',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    auditTrail: [
      {
        id: 'aud-2',
        action: 'Created high-value proposal request',
        actor: 'Elena Rostova',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      },
    ],
  },
  {
    id: 'appr-003',
    type: 'custom_pricing',
    title: 'Custom API Volume Over-Quota Pricing Waiver',
    requestedById: 'user-004',
    requestedByName: 'Sarah Jenkins',
    leadId: 'lead-003',
    leadName: 'Emma Watson',
    company: 'Nordic Health Systems',
    opportunityId: 'opp-103',
    status: 'pending',
    amount: 85000,
    discountPercent: 15,
    terms: 'Waive overage charges up to 5,000,000 monthly API calls during initial 6-month ramp-up phase.',
    reason: 'Nordic Health needs migration cushion while deprecating legacy telemetry pipeline.',
    deadline: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // overdue!
    conversationContext:
      'Emma Watson: "We cannot sign if there is risk of surprise bandwidth or API tier overage fees while our engineering team finishes the cutover."',
    aiRecommendation: {
      action: 'recommend_approval',
      confidence: 91,
      rationale:
        'Infrastructure cost for 5M API calls is less than $180/mo. Customer has $85k recurring contract value with 98% retention probability.',
      riskLevel: 'low',
    },
    tenantId: 'tenant-001',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    auditTrail: [
      {
        id: 'aud-3',
        action: 'Created approval request',
        actor: 'Sarah Jenkins',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
      },
    ],
  },
  {
    id: 'appr-004',
    type: 'commercial_commitment',
    title: 'Custom Feature Delivery Commitment (White-label Portal)',
    requestedById: 'user-003',
    requestedByName: 'Marcus Chen',
    leadId: 'lead-004',
    leadName: 'David Vance',
    company: 'Horizon Logistics',
    opportunityId: 'opp-104',
    status: 'approved',
    amount: 195000,
    terms: 'Deliver white-labeled client tracking portal within 45 days of contract execution or permit contract cancellation.',
    reason: 'Customer requires white-labeling to rollout to 300 downstream regional freight agents.',
    deadline: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    conversationContext:
      'David Vance: "We must have our logo and custom domain live before our annual shipper conference on Oct 15th."',
    aiRecommendation: {
      action: 'recommend_approval',
      confidence: 89,
      rationale:
        'White-label portal code branch is already 80% complete on roadmap sprint 14. Delivery within 45 days is feasible.',
      riskLevel: 'low',
    },
    reviewedById: 'user-001',
    reviewedByName: 'Alex Rivera',
    reviewComments: 'Approved after syncing with VP of Product. Roadmap allocation confirmed.',
    reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    tenantId: 'tenant-001',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    auditTrail: [
      {
        id: 'aud-4a',
        action: 'Created commercial commitment request',
        actor: 'Marcus Chen',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
      },
      {
        id: 'aud-4b',
        action: 'Approved request',
        actor: 'Alex Rivera',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        comments: 'Approved after syncing with VP of Product. Roadmap allocation confirmed.',
      },
    ],
  },
  {
    id: 'appr-005',
    type: 'discount',
    title: '40% Discount with Net 90 Payment Terms',
    requestedById: 'user-005',
    requestedByName: 'David Kim',
    leadId: 'lead-005',
    leadName: 'Rachel Green',
    company: 'Apex Retail Solutions',
    opportunityId: 'opp-105',
    status: 'rejected',
    amount: 60000,
    discountPercent: 40,
    terms: '40% discount off standard list price with Net 90 day billing terms on first invoice.',
    reason: 'Prospect claims tight cash flow before holiday quarter.',
    deadline: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    conversationContext:
      'Rachel Green: "Can you do 40% discount and allow us to pay in 90 days after peak season sales?"',
    aiRecommendation: {
      action: 'recommend_rejection',
      confidence: 96,
      rationale:
        '40% margin erosion combined with Net 90 poses high working capital strain and sets unfavorable precedent. Competitor alternatives do not offer similar terms.',
      riskLevel: 'high',
    },
    reviewedById: 'user-001',
    reviewedByName: 'Alex Rivera',
    reviewComments: 'Rejected. Maximum allowable discount on standard mid-market is 15%. Counter with 15% and Net 30.',
    reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    tenantId: 'tenant-001',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    auditTrail: [
      {
        id: 'aud-5a',
        action: 'Created discount request',
        actor: 'David Kim',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
      },
      {
        id: 'aud-5b',
        action: 'Rejected request',
        actor: 'Alex Rivera',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        comments: 'Rejected. Maximum allowable discount on standard mid-market is 15%. Counter with 15% and Net 30.',
      },
    ],
  },
];

export function ApprovalsPage() {
  const { toast } = useToast();
  const [approvals, setApprovals] = useState<ExtendedApproval[]>(INITIAL_APPROVALS);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [expandedId, setExpandedId] = useState<string | null>('appr-001');

  // Decision Modal State
  const [decisionModal, setDecisionModal] = useState<{
    open: boolean;
    approval: ExtendedApproval | null;
    action: 'approved' | 'rejected' | 'changes_requested' | null;
  }>({
    open: false,
    approval: null,
    action: null,
  });
  const [decisionComments, setDecisionComments] = useState('');

  // Expand / Collapse card
  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Counts
  const counts = useMemo(() => {
    return {
      pending: approvals.filter((a) => a.status === 'pending').length,
      approved: approvals.filter((a) => a.status === 'approved').length,
      rejected: approvals.filter((a) => a.status === 'rejected').length,
      all: approvals.length,
    };
  }, [approvals]);

  // Filtered List
  const filteredApprovals = useMemo(() => {
    return approvals.filter((appr) => {
      if (activeTab === 'pending') return appr.status === 'pending';
      if (activeTab === 'approved') return appr.status === 'approved';
      if (activeTab === 'rejected') return appr.status === 'rejected';
      return true;
    });
  }, [approvals, activeTab]);

  // Open Decision Dialog
  const openDecisionDialog = (
    approval: ExtendedApproval,
    action: 'approved' | 'rejected' | 'changes_requested'
  ) => {
    setDecisionModal({
      open: true,
      approval,
      action,
    });
    setDecisionComments('');
  };

  // Confirm Decision
  const handleConfirmDecision = () => {
    if (!decisionModal.approval || !decisionModal.action) return;

    const targetApproval = decisionModal.approval;
    const action = decisionModal.action;
    const actionLabel =
      action === 'approved' ? 'Approved' : action === 'rejected' ? 'Rejected' : 'Changes Requested';

    const newAuditEntry = {
      id: `aud-${Date.now()}`,
      action: `${actionLabel} request`,
      actor: 'Alex Rivera (VP Revenue)',
      timestamp: new Date().toISOString(),
      comments: decisionComments.trim() || undefined,
    };

    setApprovals((prev) =>
      prev.map((item) => {
        if (item.id === targetApproval.id) {
          return {
            ...item,
            status: action as ApprovalStatus,
            reviewedById: 'user-001',
            reviewedByName: 'Alex Rivera',
            reviewComments: decisionComments.trim() || undefined,
            reviewedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            auditTrail: [...item.auditTrail, newAuditEntry],
          };
        }
        return item;
      })
    );

    toast({
      title: `Approval ${actionLabel}`,
      description: `Request for "${targetApproval.company}" has been marked as ${actionLabel.toLowerCase()}.`,
      variant: action === 'approved' ? 'success' : action === 'rejected' ? 'destructive' : 'default',
    });

    setDecisionModal({ open: false, approval: null, action: null });
  };

  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="success" className="gap-1 font-medium capitalize">
            <CheckCircle2 className="h-3 w-3" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="gap-1 font-medium capitalize">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      case 'changes_requested':
        return (
          <Badge variant="warning" className="gap-1 font-medium capitalize">
            <AlertTriangle className="h-3 w-3" />
            Changes Requested
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge variant="indigo" className="gap-1 font-medium capitalize">
            <Clock className="h-3 w-3" />
            Pending Review
          </Badge>
        );
    }
  };

  const getTypeBadge = (type: ApprovalType) => {
    const labels: Record<string, string> = {
      discount: 'Discount',
      custom_pricing: 'Custom Pricing',
      high_value_proposal: 'High Value Deal',
      commercial_commitment: 'Commercial Commitment',
      final_commitment: 'Final Commitment',
      DISCOUNT: 'Discount',
      CONTRACT_TERMS: 'Contract Terms',
      CUSTOM_PROPOSAL: 'Custom Proposal',
      CAMPAIGN_LAUNCH: 'Campaign Launch',
      AGENT_ACTION: 'Agent Action',
      REFUND: 'Refund',
    };
    return (
      <Badge variant="outline" className="font-normal text-muted-foreground">
        {labels[type] || type}
      </Badge>
    );
  };

  const getDeadlineDisplay = (deadlineStr: string, isPending: boolean) => {
    const date = parseISO(deadlineStr);
    const past = isPast(date);
    if (!isPending) {
      return (
        <span className="text-muted-foreground text-xs">
          Expired: {format(date, 'MMM d, h:mm a')}
        </span>
      );
    }
    if (past) {
      return (
        <span className="inline-flex items-center gap-1 font-semibold text-destructive text-xs">
          <AlertTriangle className="h-3.5 w-3.5" />
          Urgent: Overdue ({format(date, 'MMM d, h:mm a')})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400 text-xs">
        <Clock className="h-3.5 w-3.5" />
        Deadline: {format(date, 'MMM d, h:mm a')}
      </span>
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Approval Center"
        description="Review executive sign-offs, custom discounts, high-value commitments, and AI revenue recommendations."
        icon={ShieldCheck}
      />

      {/* Tabs */}
      <div className="border-b pb-4">
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as typeof activeTab)}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="pending" className="gap-2">
              Pending
              {counts.pending > 0 && (
                <Badge variant="indigo" className="ml-1 px-1.5 py-0 text-xs font-semibold">
                  {counts.pending}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2">
              Approved
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                {counts.approved}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              Rejected
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                {counts.rejected}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-2">
              All
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                {counts.all}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {filteredApprovals.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center bg-card">
            <CheckCircle2 className="h-10 w-10 text-muted-foreground/60 mb-3" />
            <h3 className="text-base font-semibold text-foreground">No approvals in this queue</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
              All pending sign-offs have been processed or none match the selected filter.
            </p>
          </div>
        ) : (
          filteredApprovals.map((item) => {
            const isExpanded = expandedId === item.id;
            const isPending = item.status === 'pending';

            return (
              <div
                key={item.id}
                className={cn(
                  'rounded-xl border bg-card shadow-sm transition-all overflow-hidden',
                  isPending && 'border-indigo-500/30 ring-1 ring-indigo-500/10',
                  isExpanded ? 'shadow-md ring-1 ring-border' : 'hover:border-border/80'
                )}
              >
                {/* Header (Always Visible) */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 gap-3 cursor-pointer select-none hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {getTypeBadge(item.type)}
                        {getStatusBadge(item.status)}
                        <span className="font-semibold text-foreground text-base">
                          {item.title}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                        <span className="flex items-center gap-1 font-medium text-foreground">
                          <Building className="h-3.5 w-3.5 text-muted-foreground" />
                          {item.company} ({item.leadName})
                        </span>
                        {item.opportunityId && (
                          <span className="flex items-center gap-1">
                            <Tag className="h-3 w-3 text-muted-foreground" />
                            Opp #{item.opportunityId}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          Requested {format(parseISO(item.createdAt), 'MMM d, yyyy')}
                        </span>
                        {item.amount && (
                          <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                            <DollarSign className="h-3.5 w-3.5" />
                            ${item.amount.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
                    <Button
                      variant={isExpanded ? 'secondary' : 'outline'}
                      size="sm"
                      className="gap-1.5 text-xs font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(item.id);
                      }}
                    >
                      {isExpanded ? (
                        <>
                          <span>Collapse</span>
                          <ChevronUp className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <span>{isPending ? 'Review' : 'View Details'}</span>
                          <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Expanded Card Details */}
                {isExpanded && (
                  <div className="border-t border-border/60 bg-muted/10 p-5 space-y-5">
                    {/* Top Row: Terms & Context */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Action description & Commercial Terms */}
                      <div className="space-y-4">
                        <div className="rounded-lg border bg-card p-4 space-y-2">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Requested Commercial Terms
                          </h4>
                          <p className="text-sm text-foreground leading-relaxed">
                            {item.terms || item.reason}
                          </p>
                          {item.discountPercent && (
                            <div className="mt-2 flex items-center gap-2">
                              <Badge variant="warning" className="text-xs font-semibold">
                                {item.discountPercent}% Requested Discount
                              </Badge>
                              {item.amount && (
                                <span className="text-xs text-muted-foreground">
                                  Deal Value: ${item.amount.toLocaleString()}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Conversation Context Snippet */}
                        {item.conversationContext && (
                          <div className="rounded-lg border bg-card p-4 space-y-2">
                            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              <MessageSquareQuote className="h-4 w-4 text-primary" />
                              <span>Conversation Context Snippet</span>
                            </div>
                            <blockquote className="border-l-2 border-primary/40 pl-3 italic text-xs text-foreground/90 leading-relaxed">
                              {item.conversationContext}
                            </blockquote>
                          </div>
                        )}
                      </div>

                      {/* Right: AI Recommendation Box */}
                      <div className="space-y-4">
                        <div className="rounded-xl border border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/20 p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-white">
                                <Sparkles className="h-3.5 w-3.5" />
                              </div>
                              <span className="font-semibold text-xs text-indigo-950 dark:text-indigo-200">
                                AI Revenue Copilot Recommendation
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  item.aiRecommendation.riskLevel === 'low'
                                    ? 'success'
                                    : item.aiRecommendation.riskLevel === 'medium'
                                    ? 'warning'
                                    : 'destructive'
                                }
                                className="text-2xs uppercase font-bold"
                              >
                                {item.aiRecommendation.riskLevel} Risk
                              </Badge>
                              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                {item.aiRecommendation.confidence}% Confidence
                              </span>
                            </div>
                          </div>

                          <div className="rounded-md bg-background/80 p-3 border border-indigo-200/50 dark:border-indigo-900/50 space-y-1.5">
                            <div className="text-xs font-medium text-foreground">
                              Action Recommendation:{' '}
                              <span className="font-semibold capitalize text-primary">
                                {item.aiRecommendation.action.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {item.aiRecommendation.rationale}
                            </p>
                          </div>
                        </div>

                        {/* Request Meta Info */}
                        <div className="rounded-lg border bg-card p-4 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5" /> Requested By:
                            </span>
                            <span className="font-medium text-foreground">
                              {item.requestedByName}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" /> Review Urgency:
                            </span>
                            <div>{getDeadlineDisplay(item.deadline, isPending)}</div>
                          </div>

                          {item.reviewedByName && (
                            <div className="flex items-center justify-between border-t pt-2 mt-2">
                              <span className="text-muted-foreground">Reviewed By:</span>
                              <span className="font-medium text-foreground">
                                {item.reviewedByName} on{' '}
                                {item.reviewedAt && format(parseISO(item.reviewedAt), 'MMM d, h:mm a')}
                              </span>
                            </div>
                          )}

                          {item.reviewComments && (
                            <div className="border-t pt-2 mt-2">
                              <span className="text-muted-foreground block mb-1">
                                Decision Rationale:
                              </span>
                              <p className="text-foreground bg-muted/40 p-2 rounded text-2xs italic">
                                "{item.reviewComments}"
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Audit Trail Section */}
                    <div className="rounded-lg border bg-card p-4 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <History className="h-4 w-4" />
                        <span>Audit Trail & Decision History</span>
                      </div>
                      <div className="divide-y divide-border text-xs">
                        {item.auditTrail.map((audit) => (
                          <div key={audit.id} className="py-2.5 first:pt-0 last:pb-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-foreground">
                                {audit.action} — <span className="text-muted-foreground font-normal">{audit.actor}</span>
                              </span>
                              <span className="text-muted-foreground text-2xs">
                                {format(parseISO(audit.timestamp), 'MMM d, yyyy · h:mm:ss a')}
                              </span>
                            </div>
                            {audit.comments && (
                              <p className="mt-1 text-muted-foreground text-2xs italic">
                                Note: {audit.comments}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions Row */}
                    {isPending && (
                      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t">
                        <Button
                          variant="outline"
                          onClick={() => openDecisionDialog(item, 'changes_requested')}
                          className="w-full sm:w-auto text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 border-amber-300 dark:border-amber-800"
                        >
                          <AlertTriangle className="h-4 w-4 mr-1.5" />
                          Request Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => openDecisionDialog(item, 'rejected')}
                          className="w-full sm:w-auto text-destructive hover:bg-destructive/10 border-destructive/30"
                        >
                          <XCircle className="h-4 w-4 mr-1.5" />
                          Reject Request
                        </Button>
                        <Button
                          onClick={() => openDecisionDialog(item, 'approved')}
                          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                        >
                          <Check className="h-4 w-4 mr-1.5" />
                          Approve Request
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Decision Confirmation Dialog */}
      <AlertDialog
        open={decisionModal.open}
        onOpenChange={(open) => {
          if (!open) setDecisionModal({ open: false, approval: null, action: null });
        }}
      >
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {decisionModal.action === 'approved' && (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              )}
              {decisionModal.action === 'rejected' && (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              {decisionModal.action === 'changes_requested' && (
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              )}
              <span>
                {decisionModal.action === 'approved' && 'Confirm Approval'}
                {decisionModal.action === 'rejected' && 'Confirm Rejection'}
                {decisionModal.action === 'changes_requested' && 'Request Changes'}
              </span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              {decisionModal.action === 'approved' &&
                `Are you sure you want to approve this commercial commitment for ${decisionModal.approval?.company}? An automated notification and updated contract proposal will be generated.`}
              {decisionModal.action === 'rejected' &&
                `Are you sure you want to reject this request for ${decisionModal.approval?.company}? The assigned sales representative will be instructed to counter-negotiate.`}
              {decisionModal.action === 'changes_requested' &&
                `Specify the modified terms required before this request for ${decisionModal.approval?.company} can be approved.`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2 py-2">
            <Label htmlFor="decision-comments">
              {decisionModal.action === 'approved'
                ? 'Approval Notes (Optional)'
                : 'Reason / Required Modifications *'}
            </Label>
            <Textarea
              id="decision-comments"
              rows={3}
              placeholder={
                decisionModal.action === 'approved'
                  ? 'e.g., Authorized based on annual prepayment agreement...'
                  : 'e.g., Discount is excessive. Counter-offer maximum 15% discount...'
              }
              value={decisionComments}
              onChange={(e) => setDecisionComments(e.target.value)}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDecision}
              className={cn(
                decisionModal.action === 'approved' &&
                  'bg-emerald-600 hover:bg-emerald-700 text-white',
                decisionModal.action === 'rejected' &&
                  'bg-destructive hover:bg-destructive/90 text-destructive-foreground',
                decisionModal.action === 'changes_requested' &&
                  'bg-amber-600 hover:bg-amber-700 text-white'
              )}
            >
              Confirm Decision
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ApprovalsPage;
