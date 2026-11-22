/**
 * SKARWORLD REVENUE OS — Complete Domain TypeScript Definitions
 */

// =============================================================================
// 1. BASE ENTITIES & COMMON UTILITY TYPES
// =============================================================================

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TenantEntity extends BaseEntity {
  tenantId?: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'contains'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'between';

export interface FilterConfig {
  field: string;
  operator: FilterOperator;
  value: unknown;
}

export interface DateRange {
  from?: string | Date;
  to?: string | Date;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationMeta {
  page: number;
  pageSize?: number;
  limit?: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  items?: T[];
  total: number;
  page: number;
  limit?: number;
  pageSize?: number;
  totalPages: number;
  meta?: PaginationMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  meta?: PaginationMeta;
}

// =============================================================================
// 2. TENANT, USER & AUTH TYPES
// =============================================================================

export type Role =
  | 'SUPER_ADMIN'
  | 'TENANT_ADMIN'
  | 'SALES_MANAGER'
  | 'SALES_REP'
  | 'VIEWER'
  | 'admin'
  | 'sales_manager'
  | 'sales_rep'
  | 'analyst';

export type UserRole = Role;

export type UserStatus = 'ACTIVE' | 'INVITED' | 'SUSPENDED' | 'INACTIVE' | 'active' | 'invited' | 'disabled';

export interface User extends TenantEntity {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  avatarUrl?: string;
  phone?: string;
  title?: string;
  department?: string;
  timezone?: string;
  status?: UserStatus;
  isActive?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TenantPlan =
  | 'STARTER'
  | 'GROWTH'
  | 'ENTERPRISE'
  | 'starter'
  | 'growth'
  | 'enterprise';

export interface TenantSettings {
  companyName?: string;
  industry?: string;
  defaultCurrency?: string;
  defaultTimezone?: string;
  currency?: string;
  timezone?: string;
  supportEmail?: string;
  leadAutoAssignment?: boolean;
  autoAssignLeads?: boolean;
  enforceApprovalWorkflow?: boolean;
  aiAutoReplyLimit?: number;
  aiAutoReplyEnabled?: boolean;
  slackAlertsEnabled?: boolean;
  emailNotificationsEnabled?: boolean;
  workingHoursStart?: string;
  workingHoursEnd?: string;
  customBranding?: {
    logoUrl?: string;
    primaryColor?: string;
  };
}

export interface Tenant extends BaseEntity {
  name: string;
  slug: string;
  plan: TenantPlan;
  logoUrl?: string;
  domain?: string;
  currency?: string;
  timezone?: string;
  isActive?: boolean;
  settings?: TenantSettings;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  status: 'active' | 'invited' | 'disabled';
  lastActiveAt?: string;
  createdAt: string;
}

export interface InviteUserDto {
  email: string;
  name: string;
  role: Role;
}

export interface AuthCredentials {
  email: string;
  password?: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password?: string;
  companyName: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

// =============================================================================
// 3. LEAD & CONTACT TYPES
// =============================================================================

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'ENGAGED'
  | 'PROPOSAL_SENT'
  | 'NEGOTIATING'
  | 'CONVERTED'
  | 'UNQUALIFIED'
  | 'LOST'
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'unqualified'
  | 'nurturing';

export type LeadSource =
  | 'WEBSITE'
  | 'LINKEDIN'
  | 'OUTBOUND_EMAIL'
  | 'WHATSAPP'
  | 'REFERRAL'
  | 'CONFERENCE'
  | 'INBOUND_CALL'
  | 'PAID_ADS'
  | 'OTHER'
  | 'website'
  | 'referral'
  | 'linkedin'
  | 'whatsapp'
  | 'campaign'
  | 'cold-outreach'
  | 'cold_outreach';

export type LeadScoreCategory = 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface ScoreFactor {
  factor: string;
  points: number;
  explanation: string;
}

export interface LeadScore {
  total: number;
  category?: LeadScoreCategory;
  fitScore?: number;
  intentScore?: number;
  activityScore?: number;
  breakdown?: ScoreFactor[];
  lastCalculatedAt?: string;
}

export interface Lead extends TenantEntity {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  company: string;
  jobTitle?: string;
  title: string;
  industry: string;
  companySize?: string;
  annualRevenue?: number;
  website?: string;
  location?: string;
  country?: string;
  status: LeadStatus;
  source: LeadSource;
  score?: LeadScore;
  leadScore: number;
  scoreTrend?: 'up' | 'down' | 'neutral';
  estimatedValue: number;
  assignedToId: string;
  assignedToName: string;
  assignedTo?: User;
  pipelineStage: PipelineStage;
  tags: string[];
  notes?: string;
  customFields?: Record<string, unknown>;
  lastContactedAt?: string;
  lastActivityAt?: string;
  lastInteractionAt: string;
  nextFollowUpDate: string;
}

export interface LeadFilters extends PaginationParams {
  status?: LeadStatus | 'all';
  source?: LeadSource | 'all';
  stage?: PipelineStage | 'all';
  assignedToId?: string;
  industry?: string;
  minScore?: number;
  maxScore?: number;
}

export interface CreateLeadDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  industry: string;
  status?: LeadStatus;
  source?: LeadSource;
  pipelineStage?: PipelineStage;
  leadScore?: number;
  estimatedValue?: number;
  assignedToId: string;
  tags?: string[];
  notes?: string;
  nextFollowUpDate?: string;
}

export type UpdateLeadDto = Partial<CreateLeadDto>;

export interface BulkUpdateLeadsDto {
  ids: string[];
  updates: Partial<Pick<Lead, 'status' | 'pipelineStage' | 'assignedToId' | 'tags'>>;
}

// =============================================================================
// 4. CONVERSATION & MESSAGING TYPES
// =============================================================================

export type Channel =
  | 'whatsapp'
  | 'email'
  | 'telegram'
  | 'web'
  | 'web_chat'
  | 'linkedin'
  | 'sms';

export type ChannelType = Channel;

export type MessageDirection = 'inbound' | 'outbound';

export type MessageSenderType = 'user' | 'agent' | 'contact' | 'system' | 'lead' | 'ai';

export type MessageStatus =
  | 'sending'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed'
  | 'ai_suggestion';

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface Message {
  id: string;
  conversationId: string;
  channel: Channel;
  direction?: MessageDirection;
  senderType: MessageSenderType;
  senderId?: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  status: MessageStatus;
  attachments?: MessageAttachment[];
  aiGenerated?: boolean;
  isAiSuggestion?: boolean;
  aiConfidence?: number;
  confidenceScore?: number;
  requiresApproval?: boolean;
  approvalId?: string;
  metadata?: Record<string, unknown>;
  tenantId?: string;
  createdAt: string;
}

export type ConversationStatus =
  | 'open'
  | 'pending'
  | 'resolved'
  | 'snoozed'
  | 'active'
  | 'waiting'
  | 'archived';

export type SentimentType = 'positive' | 'neutral' | 'negative' | 'urgent';

export interface Conversation extends TenantEntity {
  leadId: string;
  lead?: Lead;
  leadName: string;
  leadCompany: string;
  leadAvatar?: string;
  contactName?: string;
  contactIdentifier?: string;
  channel: Channel;
  status: ConversationStatus;
  unreadCount: number;
  subject?: string;
  lastMessage: Message;
  assignedAgentId?: string;
  assignedUserId?: string;
  assignedToId: string;
  assignedToName: string;
  assignedUser?: User;
  tags?: string[];
  summary?: string;
  sentiment?: SentimentType;
  messages?: Message[];
}

export interface ConversationFilters extends PaginationParams {
  channel?: Channel | 'all';
  status?: ConversationStatus | 'all';
  assignedToId?: string;
}

// =============================================================================
// 5. PIPELINE & OPPORTUNITIES
// =============================================================================

export type PipelineStage =
  | 'LEAD'
  | 'DISCOVERY'
  | 'QUALIFICATION'
  | 'PROPOSAL'
  | 'NEGOTIATION'
  | 'CLOSED_WON'
  | 'CLOSED_LOST'
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'discovery'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost';

export interface PipelineStageConfig {
  id: PipelineStage;
  name: string;
  order: number;
  probability: number;
  color: string;
  description?: string;
}

export interface OpportunityProduct {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
}

export interface Opportunity extends TenantEntity {
  title: string;
  value: number;
  currency?: string;
  stage: PipelineStage;
  leadId: string;
  leadName: string;
  lead?: Lead;
  company: string;
  ownerId?: string;
  owner?: User;
  assignedToId: string;
  assignedToName: string;
  probability: number;
  priority?: 'low' | 'medium' | 'high';
  expectedCloseDate: string;
  actualCloseDate?: string;
  products?: OpportunityProduct[];
  lossReason?: string;
  notes?: string;
  tags?: string[];
}

export interface OpportunityFilters extends PaginationParams {
  stage?: PipelineStage | 'all';
  assignedToId?: string;
  minProbability?: number;
  minValue?: number;
  maxValue?: number;
}

export interface CreateOpportunityDto {
  title: string;
  leadId: string;
  company: string;
  value: number;
  stage: PipelineStage;
  probability: number;
  expectedCloseDate: string;
  assignedToId: string;
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
}

export type UpdateOpportunityDto = Partial<CreateOpportunityDto>;

// =============================================================================
// 6. CAMPAIGN TYPES
// =============================================================================

export type CampaignStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'RUNNING'
  | 'PAUSED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'draft'
  | 'scheduled'
  | 'active'
  | 'paused'
  | 'completed';

export type CampaignType =
  | 'OUTBOUND_EMAIL'
  | 'WHATSAPP_DRIP'
  | 'MULTI_CHANNEL'
  | 'EVENT_INVITATION'
  | 'RE_ENGAGEMENT';

export interface CampaignMetrics {
  totalAudience?: number;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  replied?: number;
  bounced?: number;
  converted: number;
  revenueGenerated?: number;
  bounceRate?: number;
  openRate?: number;
  clickRate?: number;
  conversionRate?: number;
}

export interface Campaign extends TenantEntity {
  name: string;
  description: string;
  type?: CampaignType;
  channel: Channel;
  channels?: Channel[];
  status: CampaignStatus;
  agentId?: string;
  targetAudience: string;
  targetAudienceCount?: number;
  metrics: CampaignMetrics;
  startDate: string;
  endDate?: string;
  budget?: number;
  createdById?: string;
}

export interface CampaignFilters extends PaginationParams {
  status?: CampaignStatus | 'all';
  channel?: Channel | 'all';
}

export interface CreateCampaignDto {
  name: string;
  description: string;
  channel: Channel;
  status?: CampaignStatus;
  targetAudience: string;
  budget?: number;
  startDate: string;
  endDate?: string;
}

export type UpdateCampaignDto = Partial<CreateCampaignDto>;

// =============================================================================
// 7. TASK TYPES
// =============================================================================

export type TaskPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'URGENT'
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent';

export type TaskStatus =
  | 'TODO'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type TaskType =
  | 'CALL'
  | 'EMAIL'
  | 'MEETING'
  | 'DEMO'
  | 'FOLLOW_UP'
  | 'PROPOSAL'
  | 'REVIEW'
  | 'follow_up'
  | 'call'
  | 'email'
  | 'meeting'
  | 'review'
  | 'other';

export interface Task extends TenantEntity {
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  type: TaskType;
  dueDate: string;
  assignedToId: string;
  assignedToName: string;
  assignedTo?: User;
  leadId?: string;
  leadName?: string;
  leadCompany?: string;
  lead?: Lead;
  opportunityId?: string;
  opportunity?: Opportunity;
  isCompleted?: boolean;
  completedAt?: string;
}

export interface TaskFilters extends PaginationParams {
  priority?: TaskPriority | 'all';
  status?: TaskStatus | 'all';
  type?: TaskType | 'all';
  assignedToId?: string;
  leadId?: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  type: TaskType;
  priority: TaskPriority;
  dueDate: string;
  assignedToId: string;
  leadId?: string;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {
  status?: TaskStatus;
}

// =============================================================================
// 8. APPROVAL TYPES
// =============================================================================

export type ApprovalType =
  | 'DISCOUNT'
  | 'CONTRACT_TERMS'
  | 'CUSTOM_PROPOSAL'
  | 'CAMPAIGN_LAUNCH'
  | 'AGENT_ACTION'
  | 'REFUND'
  | 'discount'
  | 'custom_pricing'
  | 'high_value_proposal'
  | 'commercial_commitment'
  | 'final_commitment';

export type ApprovalStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'changes_requested';

export type ApprovalEntityType = 'lead' | 'opportunity' | 'campaign' | 'message' | 'agent';

export interface ApprovalAIRecommendation {
  action?: 'recommend_approval' | 'recommend_rejection' | 'require_higher_margin' | 'APPROVE' | 'REJECT' | 'NEEDS_REVIEW';
  confidence?: number;
  rationale?: string;
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface Approval extends TenantEntity {
  type: ApprovalType;
  status: ApprovalStatus;
  title: string;
  description?: string;
  reason?: string;
  requestedById: string;
  requestedByName: string;
  requestedBy?: User;
  reviewedById?: string;
  reviewedByName?: string;
  reviewedBy?: User;
  reviewedAt?: string;
  rejectionReason?: string;
  reviewComments?: string;
  expiresAt?: string;
  entityType?: ApprovalEntityType;
  entityId?: string;
  leadId: string;
  leadName: string;
  company: string;
  opportunityId?: string;
  amount?: number;
  discountPercent?: number;
  terms?: string;
  payload?: Record<string, unknown>;
  aiRiskScore?: number;
  aiRecommendation?: ApprovalAIRecommendation | 'APPROVE' | 'REJECT' | 'NEEDS_REVIEW';
}

export interface ApprovalFilters extends PaginationParams {
  type?: ApprovalType | 'all';
  status?: ApprovalStatus | 'all';
}

// =============================================================================
// 9. PRODUCT TYPES
// =============================================================================

export type ProductCategory =
  | 'SOFTWARE'
  | 'SUBSCRIPTION'
  | 'SERVICE'
  | 'CONSULTING'
  | 'HARDWARE'
  | 'ADD_ON'
  | 'Software'
  | 'Consulting'
  | 'Training'
  | 'Support'
  | 'Custom Development';

export type BillingCycle = 'ONE_TIME' | 'MONTHLY' | 'ANNUAL' | 'USAGE_BASED';

export type PricingModel = 'one_time' | 'monthly' | 'annual' | 'per_user' | 'custom';

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface Product extends TenantEntity {
  name: string;
  sku?: string;
  code: string;
  description: string;
  category: ProductCategory;
  price?: number;
  basePrice: number;
  currency: string;
  billingCycle?: BillingCycle;
  billingPeriod?: string;
  pricingModel: PricingModel;
  isActive: boolean;
  features: string[];
  faq: ProductFAQ[];
  inventory?: number;
}

export interface ProductFilters extends PaginationParams {
  category?: ProductCategory | 'all';
  pricingModel?: PricingModel | 'all';
  isActive?: boolean;
}

export interface CreateProductDto {
  name: string;
  code: string;
  category: ProductCategory;
  description: string;
  pricingModel: PricingModel;
  basePrice: number;
  currency: string;
  billingPeriod?: string;
  features: string[];
  faq: ProductFAQ[];
  isActive?: boolean;
}

export type UpdateProductDto = Partial<CreateProductDto>;

// =============================================================================
// 10. AI CONFIGURATION & AGENTS
// =============================================================================

export type AIAgentType =
  | 'SDR'
  | 'INBOUND_QUALIFIER'
  | 'RESEARCHER'
  | 'CAMPAIGN_WRITER'
  | 'DEAL_COACH'
  | 'OBJECTION_HANDLER';

export type AIAgentStatus = 'ACTIVE' | 'TRAINING' | 'PAUSED' | 'OFFLINE';

export interface AIAgent extends TenantEntity {
  name: string;
  role: AIAgentType;
  description: string;
  status: AIAgentStatus;
  avatarUrl?: string;
  model: string;
  temperature: number;
  systemPrompt: string;
  channels: Channel[];
  autoRespond: boolean;
  requiresHumanApproval: boolean;
  maxDailyInteractions: number;
  currentDailyInteractions: number;
  confidenceThreshold: number;
}

export interface AIThresholds {
  discountPercent: number;
  dealValue: number;
}

export interface AIRateLimits {
  requestsPerMinute: number;
  tokensPerDay: number;
}

export interface AIConfig {
  tenantId: string;
  defaultModel: string;
  globalSafetyFilter: boolean;
  leadScoringEnabled: boolean;
  autoEnrichmentEnabled: boolean;
  approvalThresholds: AIThresholds;
  rateLimits: AIRateLimits;
}

// =============================================================================
// 11. INTEGRATIONS
// =============================================================================

export type IntegrationType =
  | 'CRM'
  | 'COMMUNICATION'
  | 'PAYMENT'
  | 'CALENDAR'
  | 'DATA_ENRICHMENT'
  | 'STORAGE'
  | 'communication'
  | 'email'
  | 'ai'
  | 'search'
  | 'payment';

export type IntegrationProvider =
  | 'salesforce'
  | 'hubspot'
  | 'whatsapp_business'
  | 'stripe'
  | 'google_workspace'
  | 'microsoft_outlook'
  | 'slack'
  | 'apollo'
  | 'clearbit'
  | 'zoom';

export type IntegrationStatus =
  | 'CONNECTED'
  | 'DISCONNECTED'
  | 'ERROR'
  | 'CONFIGURING'
  | 'connected'
  | 'disconnected'
  | 'error'
  | 'pending';

export interface Integration extends TenantEntity {
  provider: IntegrationProvider;
  name: string;
  type: IntegrationType;
  status: IntegrationStatus;
  iconUrl?: string;
  connectedAt?: string;
  lastSyncedAt?: string;
  syncFrequencyMinutes?: number;
  config?: Record<string, unknown>;
}

export interface IntegrationConfig {
  id: string;
  key: string;
  name: string;
  description: string;
  category: 'communication' | 'email' | 'ai' | 'search' | 'payment';
  status: IntegrationStatus;
  icon: string;
  lastSyncAt?: string;
  config?: Record<string, string | boolean | number>;
  isConfigured: boolean;
}

// =============================================================================
// 12. RESEARCH REPORTS
// =============================================================================

export type ResearchReportStatus = 'QUEUED' | 'ANALYZING' | 'COMPLETED' | 'FAILED';

export interface FundingRound {
  round: string;
  amount: string;
  date: string;
}

export interface ResearchReport extends TenantEntity {
  leadId?: string;
  companyName: string;
  domain?: string;
  status: ResearchReportStatus;
  summary: string;
  executiveSummary: string;
  keyFindings: string[];
  painPoints: string[];
  technologiesUsed: string[];
  competitors: string[];
  hiringTrends: string;
  revenueEstimate?: string;
  fundingRounds?: FundingRound[];
  suggestedOutreachAngle: string;
  confidenceScore: number;
}

// =============================================================================
// 13. ANALYTICS & DASHBOARD METRICS
// =============================================================================

export type KPITrend = 'up' | 'down' | 'neutral';

export interface KPICardData {
  id: string;
  label: string;
  value: string | number;
  change: number;
  trend: KPITrend;
  periodLabel: string;
  description?: string;
  prefix?: string;
  suffix?: string;
}

export interface ChartDataPoint {
  date: string;
  [key: string]: string | number;
}

export interface PipelineStageMetric {
  stage: PipelineStage;
  stageName: string;
  count: number;
  value: number;
  conversionRate: number;
}

export interface LeadSourceMetric {
  source: LeadSource;
  count: number;
  convertedCount: number;
  value: number;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  target: number;
  dealsCount: number;
}

export interface LeadAcquisitionDataPoint {
  month: string;
  website: number;
  referral: number;
  linkedin: number;
  whatsapp: number;
  campaign: number;
  cold_outreach: number;
}

export interface ConversionFunnelStage {
  stage: string;
  count: number;
  conversionRate: number;
  dropOffRate: number;
}

export interface PipelineDistributionItem {
  stage: string;
  count: number;
  totalValue: number;
  percentage: number;
}

export interface CampaignPerformanceItem {
  id: string;
  name: string;
  channel: string;
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
  roi: number;
}

export interface AIAgentActivityItem {
  date: string;
  automatedReplies: number;
  leadsQualified: number;
  tasksGenerated: number;
  researchCompleted: number;
}

export interface LeadSourcePerformanceItem {
  source: string;
  leadsCount: number;
  qualifiedCount: number;
  wonCount: number;
  conversionRate: number;
  avgDealSize: number;
}

export interface SalesRepPerformanceItem {
  repId: string;
  name: string;
  avatar: string;
  leadsAssigned: number;
  dealsWon: number;
  revenueClosed: number;
  quotaAttainment: number;
  avgCycleDays: number;
}

export interface KPIValue {
  value: number;
  change: number;
  isPositive: boolean;
}

export interface DashboardKPIs {
  totalRevenue: KPIValue;
  activeLeads: KPIValue;
  pipelineValue: KPIValue;
  winRate: KPIValue;
  avgDealSize: KPIValue;
  aiHoursSaved: KPIValue;
}

// =============================================================================
// 14. NOTIFICATIONS & AUDIT LOGS
// =============================================================================

export type NotificationType =
  | 'lead'
  | 'approval'
  | 'task'
  | 'campaign'
  | 'system'
  | 'lead_new'
  | 'lead_qualified'
  | 'task_due'
  | 'task_overdue'
  | 'approval_requested'
  | 'approval_decided'
  | 'message_received'
  | 'campaign_completed'
  | 'LEAD_ASSIGNED'
  | 'MESSAGE_RECEIVED'
  | 'APPROVAL_REQUIRED'
  | 'OPPORTUNITY_UPDATED'
  | 'TASK_DUE'
  | 'CAMPAIGN_ALERT'
  | 'SYSTEM';

export interface NotificationActor {
  name: string;
  avatarUrl?: string;
}

export interface Notification extends TenantEntity {
  id: string;
  userId?: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  link?: string;
  actor?: NotificationActor;
  entityId?: string;
  entityType?: 'lead' | 'task' | 'approval' | 'conversation' | 'campaign' | 'system' | string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface AuditLog extends TenantEntity {
  userId?: string;
  userName?: string;
  action: string;
  entityType: string;
  entityId: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}
