import { z } from 'zod';

// --- Auth Schemas ---

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    company: z.string().min(2, 'Company name must be at least 2 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// --- Lead Schemas ---

export const createLeadSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  industry: z.string().optional(),
  location: z.string().optional(),
  source: z.enum([
    'website',
    'referral',
    'linkedin',
    'whatsapp',
    'campaign',
    'cold_outreach',
    'other',
  ]),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  assignedTo: z.string().optional(),
});

export type CreateLeadFormData = z.infer<typeof createLeadSchema>;

export const updateLeadSchema = createLeadSchema.partial();

export type UpdateLeadFormData = z.infer<typeof updateLeadSchema>;

// --- Opportunity Schemas ---

export const createOpportunitySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  leadId: z.string().min(1, 'Lead is required'),
  value: z.number().min(0, 'Value must be positive'),
  currency: z.string().default('USD'),
  stage: z.enum([
    'new',
    'contacted',
    'qualified',
    'discovery',
    'proposal',
    'negotiation',
    'won',
    'lost',
  ]),
  expectedCloseDate: z.string().min(1, 'Expected close date is required'),
  assignedTo: z.string().optional(),
  notes: z.string().optional(),
  winProbability: z.number().min(0).max(100).optional(),
});

export type CreateOpportunityFormData = z.infer<typeof createOpportunitySchema>;

// --- Campaign Schemas ---

export const createCampaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  description: z.string().optional(),
  type: z.enum(['email', 'whatsapp', 'telegram', 'multi_channel']),
  targetAudience: z.string().optional(),
  objectives: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  messageTemplate: z.string().optional(),
});

export type CreateCampaignFormData = z.infer<typeof createCampaignSchema>;

// --- Task Schemas ---

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  type: z.enum(['follow_up', 'call', 'email', 'meeting', 'review', 'other']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueDate: z.string().min(1, 'Due date is required'),
  assignedTo: z.string().optional(),
  leadId: z.string().optional(),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;

// --- Product Schemas ---

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  pricingModel: z.enum(['one_time', 'monthly', 'annual', 'per_user', 'custom']),
  price: z.number().min(0, 'Price must be positive').optional(),
  currency: z.string().default('USD'),
  isActive: z.boolean().default(true),
  features: z.array(z.string()).optional(),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;

// --- Approval Schemas ---

export const approvalDecisionSchema = z.object({
  decision: z.enum(['approved', 'rejected', 'changes_requested']),
  comments: z.string().optional(),
  modifiedTerms: z.string().optional(),
});

export type ApprovalDecisionFormData = z.infer<typeof approvalDecisionSchema>;

// --- Settings Schemas ---

export const businessProfileSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  industry: z.string().optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  timezone: z.string().optional(),
  currency: z.string().default('USD'),
});

export type BusinessProfileFormData = z.infer<typeof businessProfileSchema>;

export const inviteUserSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  role: z.enum(['admin', 'sales_manager', 'sales_rep', 'analyst']),
  name: z.string().min(1, 'Name is required'),
});

export type InviteUserFormData = z.infer<typeof inviteUserSchema>;

// --- AI Config Schemas ---

export const aiConfigSchema = z.object({
  agentName: z.string().min(1, 'Agent name is required'),
  agentDescription: z.string().optional(),
  personality: z.string().optional(),
  communicationStyle: z.enum(['professional', 'friendly', 'casual', 'formal']).default('professional'),
  languages: z.array(z.string()).default(['en']),
  businessContext: z.string().optional(),
  targetAudience: z.string().optional(),
  salesObjectives: z.string().optional(),
  pricingPolicies: z.string().optional(),
  restrictedClaims: z.string().optional(),
  prohibitedActions: z.string().optional(),
  escalationRules: z.string().optional(),
  enableResearch: z.boolean().default(true),
  enableQualification: z.boolean().default(true),
  enableScoring: z.boolean().default(true),
  enableConversation: z.boolean().default(true),
  enableObjectionHandling: z.boolean().default(true),
  enableProposalGeneration: z.boolean().default(false),
  enableAutoNurturing: z.boolean().default(false),
  enableAutoQualification: z.boolean().default(true),
  enableAIResponseSuggestions: z.boolean().default(true),
  requireHumanApproval: z.boolean().default(true),
});

export type AIConfigFormData = z.infer<typeof aiConfigSchema>;

// --- Message Schema ---

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty'),
  channel: z.enum(['whatsapp', 'email', 'telegram', 'web_chat']).optional(),
});

export type SendMessageFormData = z.infer<typeof sendMessageSchema>;
