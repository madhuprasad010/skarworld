// ============================================================================
// SKARWORLD REVENUE OS — Mock Service Handlers & In-Memory State Store
// ============================================================================

import { formatISO, subDays, addDays } from 'date-fns';
import {
  mockUsers,
  mockLeads,
  mockConversations,
  mockOpportunities,
  mockCampaigns,
  mockTasks,
  mockApprovals,
  mockProducts,
  mockNotifications,
  mockRevenueOverTime,
  mockLeadAcquisition,
  mockConversionFunnel,
  mockPipelineDistribution,
  mockCampaignPerformance,
  mockAIAgentActivity,
  mockLeadSourcePerformance,
  mockSalesRepPerformance,
  mockDashboardKPIs,
  mockIntegrations,
  mockTenantSettings,
  mockTeamMembers,
} from './data';
import type {
  Lead,
  LeadFilters,
  CreateLeadDto,
  UpdateLeadDto,
  BulkUpdateLeadsDto,
  Conversation,
  ConversationFilters,
  ChannelType,
  Message,
  MessageSenderType,
  Opportunity,
  OpportunityFilters,
  CreateOpportunityDto,
  UpdateOpportunityDto,
  PipelineStage,
  Campaign,
  CampaignFilters,
  CreateCampaignDto,
  UpdateCampaignDto,
  Task,
  TaskFilters,
  CreateTaskDto,
  UpdateTaskDto,
  Approval,
  ApprovalFilters,
  Product,
  ProductFilters,
  CreateProductDto,
  UpdateProductDto,
  Notification,
  IntegrationConfig,
  TenantSettings,
  TeamMember,
  InviteUserDto,
  UserRole,
  User,
  AuthCredentials,
  RegisterDto,
  AuthResponse,
  PaginatedResponse,
  DashboardKPIs,
  RevenueDataPoint,
  LeadAcquisitionDataPoint,
  ConversionFunnelStage,
  PipelineDistributionItem,
  CampaignPerformanceItem,
} from '@/types';

// Simulate realistic network latency between min and max milliseconds
export const simulateDelay = (min = 200, max = 500): Promise<void> => {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// In-Memory Mutable State Clone
class MockDataStore {
  leads: Lead[] = JSON.parse(JSON.stringify(mockLeads));
  conversations: Conversation[] = JSON.parse(JSON.stringify(mockConversations));
  opportunities: Opportunity[] = JSON.parse(JSON.stringify(mockOpportunities));
  campaigns: Campaign[] = JSON.parse(JSON.stringify(mockCampaigns));
  tasks: Task[] = JSON.parse(JSON.stringify(mockTasks));
  approvals: Approval[] = JSON.parse(JSON.stringify(mockApprovals));
  products: Product[] = JSON.parse(JSON.stringify(mockProducts));
  notifications: Notification[] = JSON.parse(JSON.stringify(mockNotifications));
  integrations: IntegrationConfig[] = JSON.parse(JSON.stringify(mockIntegrations));
  settings: TenantSettings = JSON.parse(JSON.stringify(mockTenantSettings));
  teamMembers: TeamMember[] = JSON.parse(JSON.stringify(mockTeamMembers));
  users: User[] = JSON.parse(JSON.stringify(mockUsers));
  currentUser: User = JSON.parse(JSON.stringify(mockUsers[0])); // Alex Rivera (Admin)

  reset(): void {
    this.leads = JSON.parse(JSON.stringify(mockLeads));
    this.conversations = JSON.parse(JSON.stringify(mockConversations));
    this.opportunities = JSON.parse(JSON.stringify(mockOpportunities));
    this.campaigns = JSON.parse(JSON.stringify(mockCampaigns));
    this.tasks = JSON.parse(JSON.stringify(mockTasks));
    this.approvals = JSON.parse(JSON.stringify(mockApprovals));
    this.products = JSON.parse(JSON.stringify(mockProducts));
    this.notifications = JSON.parse(JSON.stringify(mockNotifications));
    this.integrations = JSON.parse(JSON.stringify(mockIntegrations));
    this.settings = JSON.parse(JSON.stringify(mockTenantSettings));
    this.teamMembers = JSON.parse(JSON.stringify(mockTeamMembers));
    this.users = JSON.parse(JSON.stringify(mockUsers));
    this.currentUser = JSON.parse(JSON.stringify(mockUsers[0]));
  }
}

export const mockStore = new MockDataStore();

// Pagination Helper
function paginate<T>(items: T[], page = 1, limit = 10): PaginatedResponse<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * limit;
  const data = items.slice(startIndex, startIndex + limit);

  return {
    data,
    total,
    page: currentPage,
    limit,
    totalPages,
  };
}

// ============================================================================
// 1. Leads Mock Handlers
// ============================================================================

export const mockLeadsHandlers = {
  async getLeads(filters: LeadFilters = {}): Promise<PaginatedResponse<Lead>> {
    await simulateDelay();
    let result = [...mockStore.leads];

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (lead) =>
          lead.fullName.toLowerCase().includes(q) ||
          lead.company.toLowerCase().includes(q) ||
          lead.email.toLowerCase().includes(q) ||
          lead.industry.toLowerCase().includes(q) ||
          lead.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (filters.status && filters.status !== 'all') {
      result = result.filter((lead) => lead.status === filters.status);
    }

    if (filters.source && filters.source !== 'all') {
      result = result.filter((lead) => lead.source === filters.source);
    }

    if (filters.stage && filters.stage !== 'all') {
      result = result.filter((lead) => lead.pipelineStage === filters.stage);
    }

    if (filters.assignedToId) {
      result = result.filter((lead) => lead.assignedToId === filters.assignedToId);
    }

    if (filters.industry) {
      result = result.filter((lead) => lead.industry.toLowerCase() === filters.industry?.toLowerCase());
    }

    if (filters.minScore !== undefined) {
      result = result.filter((lead) => lead.leadScore >= (filters.minScore ?? 0));
    }

    if (filters.maxScore !== undefined) {
      result = result.filter((lead) => lead.leadScore <= (filters.maxScore ?? 100));
    }

    // Sorting
    if (filters.sortBy) {
      result.sort((a, b) => {
        const valA = (a as unknown as Record<string, unknown>)[filters.sortBy!];
        const valB = (b as unknown as Record<string, unknown>)[filters.sortBy!];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return filters.sortOrder === 'asc' ? valA - valB : valB - valA;
        }
        return filters.sortOrder === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    } else {
      // Default sort by leadScore descending
      result.sort((a, b) => b.leadScore - a.leadScore);
    }

    return paginate(result, filters.page, filters.limit);
  },

  async getLead(id: string): Promise<Lead> {
    await simulateDelay();
    const lead = mockStore.leads.find((l) => l.id === id);
    if (!lead) {
      throw new Error(`Lead with ID ${id} not found`);
    }
    return { ...lead };
  },

  async createLead(data: CreateLeadDto): Promise<Lead> {
    await simulateDelay();
    const rep = mockStore.users.find((u) => u.id === data.assignedToId) || mockStore.users[2];
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      company: data.company,
      title: data.title,
      industry: data.industry,
      status: data.status || 'new',
      source: data.source || 'website',
      pipelineStage: data.pipelineStage || 'new',
      leadScore: data.leadScore ?? Math.floor(Math.random() * 40) + 40,
      scoreTrend: 'neutral',
      estimatedValue: data.estimatedValue || 50000,
      assignedToId: rep.id,
      assignedToName: rep.name,
      tags: data.tags || ['Inbound'],
      tenantId: 'tenant-001',
      notes: data.notes || '',
      lastInteractionAt: formatISO(new Date()),
      nextFollowUpDate: data.nextFollowUpDate || formatISO(addDays(new Date(), 2)),
      createdAt: formatISO(new Date()),
      updatedAt: formatISO(new Date()),
    };

    mockStore.leads.unshift(newLead);
    return newLead;
  },

  async updateLead(id: string, data: UpdateLeadDto): Promise<Lead> {
    await simulateDelay();
    const index = mockStore.leads.findIndex((l) => l.id === id);
    if (index === -1) {
      throw new Error(`Lead with ID ${id} not found`);
    }

    const existing = mockStore.leads[index];
    let repName = existing.assignedToName;
    if (data.assignedToId && data.assignedToId !== existing.assignedToId) {
      const rep = mockStore.users.find((u) => u.id === data.assignedToId);
      if (rep) repName = rep.name;
    }

    const updated: Lead = {
      ...existing,
      ...data,
      fullName:
        data.firstName || data.lastName
          ? `${data.firstName || existing.firstName} ${data.lastName || existing.lastName}`
          : existing.fullName,
      assignedToName: repName,
      updatedAt: formatISO(new Date()),
    };

    mockStore.leads[index] = updated;
    return updated;
  },

  async deleteLead(id: string): Promise<boolean> {
    await simulateDelay();
    const index = mockStore.leads.findIndex((l) => l.id === id);
    if (index === -1) {
      throw new Error(`Lead with ID ${id} not found`);
    }
    mockStore.leads.splice(index, 1);
    return true;
  },

  async bulkUpdateLeads(dto: BulkUpdateLeadsDto): Promise<Lead[]> {
    await simulateDelay();
    const updatedLeads: Lead[] = [];

    mockStore.leads = mockStore.leads.map((lead) => {
      if (dto.ids.includes(lead.id)) {
        let repName = lead.assignedToName;
        if (dto.updates.assignedToId) {
          const rep = mockStore.users.find((u) => u.id === dto.updates.assignedToId);
          if (rep) repName = rep.name;
        }

        const updated: Lead = {
          ...lead,
          ...dto.updates,
          assignedToName: repName,
          updatedAt: formatISO(new Date()),
        };
        updatedLeads.push(updated);
        return updated;
      }
      return lead;
    });

    return updatedLeads;
  },

  async exportLeads(filters: LeadFilters = {}): Promise<string> {
    await simulateDelay();
    const result = await this.getLeads({ ...filters, limit: 1000 });
    const headers = ['ID', 'Name', 'Email', 'Company', 'Title', 'Industry', 'Status', 'Stage', 'Score', 'Value', 'Assigned To'];
    const rows = result.data.map((l) => [
      l.id,
      `"${l.fullName}"`,
      l.email,
      `"${l.company}"`,
      `"${l.title}"`,
      l.industry,
      l.status,
      l.pipelineStage,
      l.leadScore,
      l.estimatedValue,
      `"${l.assignedToName}"`,
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  },
};

// ============================================================================
// 2. Conversations Mock Handlers
// ============================================================================

export const mockConversationsHandlers = {
  async getConversations(filters: ConversationFilters = {}): Promise<PaginatedResponse<Conversation>> {
    await simulateDelay();
    let result = [...mockStore.conversations];

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.leadName.toLowerCase().includes(q) ||
          c.leadCompany.toLowerCase().includes(q) ||
          (c.subject && c.subject.toLowerCase().includes(q)) ||
          c.lastMessage.content.toLowerCase().includes(q)
      );
    }

    if (filters.channel && filters.channel !== 'all') {
      result = result.filter((c) => c.channel === filters.channel);
    }

    if (filters.status && filters.status !== 'all') {
      result = result.filter((c) => c.status === filters.status);
    }

    if (filters.assignedToId) {
      result = result.filter((c) => c.assignedToId === filters.assignedToId);
    }

    // Default sort by updatedAt descending
    result.sort((a, b) => new Date(b.updatedAt || '').getTime() - new Date(a.updatedAt || '').getTime());

    return paginate(result, filters.page, filters.limit);
  },

  async getConversation(id: string): Promise<Conversation> {
    await simulateDelay();
    const conv = mockStore.conversations.find((c) => c.id === id);
    if (!conv) {
      throw new Error(`Conversation with ID ${id} not found`);
    }
    // Mark messages as read and reset unreadCount
    conv.unreadCount = 0;
    return { ...conv };
  },

  async sendMessage(
    conversationId: string,
    content: string,
    senderType: MessageSenderType = 'user'
  ): Promise<Message> {
    await simulateDelay();
    const conv = mockStore.conversations.find((c) => c.id === conversationId);
    if (!conv) {
      throw new Error(`Conversation with ID ${conversationId} not found`);
    }

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: senderType === 'user' ? conv.assignedToId : 'ai-system',
      senderType,
      senderName: senderType === 'user' ? conv.assignedToName : 'SKAR Revenue AI',
      content,
      status: 'delivered',
      channel: conv.channel,
      createdAt: formatISO(new Date()),
    };

    if (!conv.messages) conv.messages = [];
    conv.messages.push(newMessage);
    conv.lastMessage = newMessage;
    conv.updatedAt = formatISO(new Date());

    return newMessage;
  },

  async createConversation(leadId: string, channel: ChannelType, initialMessage?: string): Promise<Conversation> {
    await simulateDelay();
    const lead = mockStore.leads.find((l) => l.id === leadId);
    if (!lead) {
      throw new Error(`Lead with ID ${leadId} not found`);
    }

    const convId = `conv-${Date.now()}`;
    const firstMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: convId,
      senderId: lead.assignedToId,
      senderType: 'user',
      senderName: lead.assignedToName,
      content: initialMessage || `Hello ${lead.firstName}, connecting regarding your interest in SKAR Revenue OS.`,
      status: 'sent',
      channel,
      createdAt: formatISO(new Date()),
    };

    const newConv: Conversation = {
      id: convId,
      leadId: lead.id,
      leadName: lead.fullName,
      leadCompany: lead.company,
      channel,
      status: 'active',
      assignedToId: lead.assignedToId,
      assignedToName: lead.assignedToName,
      subject: `Conversation with ${lead.fullName}`,
      lastMessage: firstMsg,
      unreadCount: 0,
      tenantId: 'tenant-001',
      createdAt: formatISO(new Date()),
      updatedAt: formatISO(new Date()),
      messages: [firstMsg],
    };

    mockStore.conversations.unshift(newConv);
    return newConv;
  },
};

// ============================================================================
// 3. Pipeline / Opportunities Mock Handlers
// ============================================================================

export const mockPipelineHandlers = {
  async getOpportunities(filters: OpportunityFilters = {}): Promise<PaginatedResponse<Opportunity>> {
    await simulateDelay();
    let result = [...mockStore.opportunities];

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (opp) =>
          opp.title.toLowerCase().includes(q) ||
          opp.company.toLowerCase().includes(q) ||
          opp.leadName.toLowerCase().includes(q)
      );
    }

    if (filters.stage && filters.stage !== 'all') {
      result = result.filter((opp) => opp.stage === filters.stage);
    }

    if (filters.assignedToId) {
      result = result.filter((opp) => opp.assignedToId === filters.assignedToId);
    }

    if (filters.minValue !== undefined) {
      result = result.filter((opp) => opp.value >= (filters.minValue ?? 0));
    }

    if (filters.maxValue !== undefined) {
      result = result.filter((opp) => opp.value <= (filters.maxValue ?? Infinity));
    }

    if (filters.minProbability !== undefined) {
      result = result.filter((opp) => opp.probability >= (filters.minProbability ?? 0));
    }

    return paginate(result, filters.page, filters.limit || 50);
  },

  async getOpportunity(id: string): Promise<Opportunity> {
    await simulateDelay();
    const opp = mockStore.opportunities.find((o) => o.id === id);
    if (!opp) {
      throw new Error(`Opportunity with ID ${id} not found`);
    }
    return { ...opp };
  },

  async updateOpportunityStage(id: string, stage: PipelineStage): Promise<Opportunity> {
    await simulateDelay();
    const opp = mockStore.opportunities.find((o) => o.id === id);
    if (!opp) {
      throw new Error(`Opportunity with ID ${id} not found`);
    }

    opp.stage = stage;
    opp.updatedAt = formatISO(new Date());

    // Update win probability based on stage
    switch (stage) {
      case 'new': opp.probability = 15; break;
      case 'contacted': opp.probability = 25; break;
      case 'qualified': opp.probability = 40; break;
      case 'discovery': opp.probability = 55; break;
      case 'proposal': opp.probability = 70; break;
      case 'negotiation': opp.probability = 85; break;
      case 'won': opp.probability = 100; break;
      case 'lost': opp.probability = 0; break;
    }

    return { ...opp };
  },

  async createOpportunity(data: CreateOpportunityDto): Promise<Opportunity> {
    await simulateDelay();
    const rep = mockStore.users.find((u) => u.id === data.assignedToId) || mockStore.users[2];
    const lead = mockStore.leads.find((l) => l.id === data.leadId);

    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      title: data.title,
      leadId: data.leadId,
      leadName: lead ? lead.fullName : 'Prospective Account',
      company: data.company,
      value: data.value,
      stage: data.stage || 'new',
      probability: data.probability || 20,
      expectedCloseDate: data.expectedCloseDate || formatISO(addDays(new Date(), 30)),
      assignedToId: rep.id,
      assignedToName: rep.name,
      priority: data.priority || 'medium',
      tenantId: 'tenant-001',
      notes: data.notes || '',
      createdAt: formatISO(new Date()),
      updatedAt: formatISO(new Date()),
    };

    mockStore.opportunities.unshift(newOpp);
    return newOpp;
  },

  async updateOpportunity(id: string, data: UpdateOpportunityDto): Promise<Opportunity> {
    await simulateDelay();
    const index = mockStore.opportunities.findIndex((o) => o.id === id);
    if (index === -1) {
      throw new Error(`Opportunity with ID ${id} not found`);
    }

    const existing = mockStore.opportunities[index];
    let repName = existing.assignedToName;
    if (data.assignedToId && data.assignedToId !== existing.assignedToId) {
      const rep = mockStore.users.find((u) => u.id === data.assignedToId);
      if (rep) repName = rep.name;
    }

    const updated: Opportunity = {
      ...existing,
      ...data,
      assignedToName: repName,
      updatedAt: formatISO(new Date()),
    };

    mockStore.opportunities[index] = updated;
    return updated;
  },

  async deleteOpportunity(id: string): Promise<boolean> {
    await simulateDelay();
    const index = mockStore.opportunities.findIndex((o) => o.id === id);
    if (index === -1) {
      throw new Error(`Opportunity with ID ${id} not found`);
    }
    mockStore.opportunities.splice(index, 1);
    return true;
  },
};

// ============================================================================
// 4. Campaigns Mock Handlers
// ============================================================================

export const mockCampaignsHandlers = {
  async getCampaigns(filters: CampaignFilters = {}): Promise<PaginatedResponse<Campaign>> {
    await simulateDelay();
    let result = [...mockStore.campaigns];

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.targetAudience.toLowerCase().includes(q)
      );
    }

    if (filters.status && filters.status !== 'all') {
      result = result.filter((c) => c.status === filters.status);
    }

    if (filters.channel && filters.channel !== 'all') {
      result = result.filter((c) => c.channel === filters.channel);
    }

    return paginate(result, filters.page, filters.limit);
  },

  async getCampaign(id: string): Promise<Campaign> {
    await simulateDelay();
    const campaign = mockStore.campaigns.find((c) => c.id === id);
    if (!campaign) {
      throw new Error(`Campaign with ID ${id} not found`);
    }
    return { ...campaign };
  },

  async createCampaign(data: CreateCampaignDto): Promise<Campaign> {
    await simulateDelay();
    const newCamp: Campaign = {
      id: `camp-${Date.now()}`,
      name: data.name,
      description: data.description,
      channel: data.channel,
      status: data.status || 'draft',
      targetAudience: data.targetAudience,
      budget: data.budget || 5000,
      startDate: data.startDate,
      endDate: data.endDate,
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
      },
      tenantId: 'tenant-001',
      createdById: mockStore.currentUser.id,
      createdAt: formatISO(new Date()),
      updatedAt: formatISO(new Date()),
    };

    mockStore.campaigns.unshift(newCamp);
    return newCamp;
  },

  async updateCampaign(id: string, data: UpdateCampaignDto): Promise<Campaign> {
    await simulateDelay();
    const index = mockStore.campaigns.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Campaign with ID ${id} not found`);
    }

    const updated: Campaign = {
      ...mockStore.campaigns[index],
      ...data,
      updatedAt: formatISO(new Date()),
    };

    mockStore.campaigns[index] = updated;
    return updated;
  },

  async pauseCampaign(id: string): Promise<Campaign> {
    await simulateDelay();
    const camp = mockStore.campaigns.find((c) => c.id === id);
    if (!camp) throw new Error(`Campaign with ID ${id} not found`);
    camp.status = 'paused';
    camp.updatedAt = formatISO(new Date());
    return { ...camp };
  },

  async resumeCampaign(id: string): Promise<Campaign> {
    await simulateDelay();
    const camp = mockStore.campaigns.find((c) => c.id === id);
    if (!camp) throw new Error(`Campaign with ID ${id} not found`);
    camp.status = 'active';
    camp.updatedAt = formatISO(new Date());
    return { ...camp };
  },
};

// ============================================================================
// 5. Tasks Mock Handlers
// ============================================================================

export const mockTasksHandlers = {
  async getTasks(filters: TaskFilters = {}): Promise<PaginatedResponse<Task>> {
    await simulateDelay();
    let result = [...mockStore.tasks];

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          (t.leadName && t.leadName.toLowerCase().includes(q)) ||
          (t.leadCompany && t.leadCompany.toLowerCase().includes(q))
      );
    }

    if (filters.priority && filters.priority !== 'all') {
      result = result.filter((t) => t.priority === filters.priority);
    }

    if (filters.status && filters.status !== 'all') {
      result = result.filter((t) => t.status === filters.status);
    }

    if (filters.type && filters.type !== 'all') {
      result = result.filter((t) => t.type === filters.type);
    }

    if (filters.assignedToId) {
      result = result.filter((t) => t.assignedToId === filters.assignedToId);
    }

    if (filters.leadId) {
      result = result.filter((t) => t.leadId === filters.leadId);
    }

    return paginate(result, filters.page, filters.limit);
  },

  async getTask(id: string): Promise<Task> {
    await simulateDelay();
    const task = mockStore.tasks.find((t) => t.id === id);
    if (!task) throw new Error(`Task with ID ${id} not found`);
    return { ...task };
  },

  async createTask(data: CreateTaskDto): Promise<Task> {
    await simulateDelay();
    const rep = mockStore.users.find((u) => u.id === data.assignedToId) || mockStore.users[2];
    const lead = data.leadId ? mockStore.leads.find((l) => l.id === data.leadId) : undefined;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: data.title,
      description: data.description,
      type: data.type,
      priority: data.priority,
      status: 'pending',
      dueDate: data.dueDate,
      assignedToId: rep.id,
      assignedToName: rep.name,
      leadId: lead?.id,
      leadName: lead?.fullName,
      leadCompany: lead?.company,
      tenantId: 'tenant-001',
      createdAt: formatISO(new Date()),
      updatedAt: formatISO(new Date()),
    };

    mockStore.tasks.unshift(newTask);
    return newTask;
  },

  async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    await simulateDelay();
    const index = mockStore.tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error(`Task with ID ${id} not found`);

    const existing = mockStore.tasks[index];
    let repName = existing.assignedToName;
    if (data.assignedToId && data.assignedToId !== existing.assignedToId) {
      const rep = mockStore.users.find((u) => u.id === data.assignedToId);
      if (rep) repName = rep.name;
    }

    const updated: Task = {
      ...existing,
      ...data,
      assignedToName: repName,
      completedAt: data.status === 'completed' && !existing.completedAt ? formatISO(new Date()) : existing.completedAt,
      updatedAt: formatISO(new Date()),
    };

    mockStore.tasks[index] = updated;
    return updated;
  },

  async completeTask(id: string): Promise<Task> {
    await simulateDelay();
    const task = mockStore.tasks.find((t) => t.id === id);
    if (!task) throw new Error(`Task with ID ${id} not found`);
    task.status = 'completed';
    task.completedAt = formatISO(new Date());
    task.updatedAt = formatISO(new Date());
    return { ...task };
  },

  async deleteTask(id: string): Promise<boolean> {
    await simulateDelay();
    const index = mockStore.tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error(`Task with ID ${id} not found`);
    mockStore.tasks.splice(index, 1);
    return true;
  },
};

// ============================================================================
// 6. Approvals Mock Handlers
// ============================================================================

export const mockApprovalsHandlers = {
  async getApprovals(filters: ApprovalFilters = {}): Promise<PaginatedResponse<Approval>> {
    await simulateDelay();
    let result = [...mockStore.approvals];

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.company.toLowerCase().includes(q) ||
          a.leadName.toLowerCase().includes(q) ||
          a.requestedByName.toLowerCase().includes(q)
      );
    }

    if (filters.type && filters.type !== 'all') {
      result = result.filter((a) => a.type === filters.type);
    }

    if (filters.status && filters.status !== 'all') {
      result = result.filter((a) => a.status === filters.status);
    }

    return paginate(result, filters.page, filters.limit);
  },

  async getApproval(id: string): Promise<Approval> {
    await simulateDelay();
    const approval = mockStore.approvals.find((a) => a.id === id);
    if (!approval) throw new Error(`Approval with ID ${id} not found`);
    return { ...approval };
  },

  async approveRequest(id: string, comments?: string): Promise<Approval> {
    await simulateDelay();
    const approval = mockStore.approvals.find((a) => a.id === id);
    if (!approval) throw new Error(`Approval with ID ${id} not found`);

    approval.status = 'approved';
    approval.reviewedById = mockStore.currentUser.id;
    approval.reviewedByName = mockStore.currentUser.name;
    approval.reviewComments = comments || 'Approved via deal desk workflow.';
    approval.reviewedAt = formatISO(new Date());
    approval.updatedAt = formatISO(new Date());

    return { ...approval };
  },

  async rejectRequest(id: string, reason?: string): Promise<Approval> {
    await simulateDelay();
    const approval = mockStore.approvals.find((a) => a.id === id);
    if (!approval) throw new Error(`Approval with ID ${id} not found`);

    approval.status = 'rejected';
    approval.reviewedById = mockStore.currentUser.id;
    approval.reviewedByName = mockStore.currentUser.name;
    approval.reviewComments = reason || 'Declined under current commercial margin policy.';
    approval.reviewedAt = formatISO(new Date());
    approval.updatedAt = formatISO(new Date());

    return { ...approval };
  },

  async requestChanges(id: string, comments: string): Promise<Approval> {
    await simulateDelay();
    const approval = mockStore.approvals.find((a) => a.id === id);
    if (!approval) throw new Error(`Approval with ID ${id} not found`);

    approval.status = 'changes_requested';
    approval.reviewedById = mockStore.currentUser.id;
    approval.reviewedByName = mockStore.currentUser.name;
    approval.reviewComments = comments;
    approval.reviewedAt = formatISO(new Date());
    approval.updatedAt = formatISO(new Date());

    return { ...approval };
  },
};

// ============================================================================
// 7. Products Mock Handlers
// ============================================================================

export const mockProductsHandlers = {
  async getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    await simulateDelay();
    let result = [...mockStore.products];

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.features.some((f) => f.toLowerCase().includes(q))
      );
    }

    if (filters.category && filters.category !== 'all') {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters.pricingModel && filters.pricingModel !== 'all') {
      result = result.filter((p) => p.pricingModel === filters.pricingModel);
    }

    if (filters.isActive !== undefined) {
      result = result.filter((p) => p.isActive === filters.isActive);
    }

    return paginate(result, filters.page, filters.limit);
  },

  async getProduct(id: string): Promise<Product> {
    await simulateDelay();
    const prod = mockStore.products.find((p) => p.id === id);
    if (!prod) throw new Error(`Product with ID ${id} not found`);
    return { ...prod };
  },

  async createProduct(data: CreateProductDto): Promise<Product> {
    await simulateDelay();
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: data.name,
      code: data.code,
      category: data.category,
      description: data.description,
      pricingModel: data.pricingModel,
      basePrice: data.basePrice,
      currency: data.currency || 'USD',
      billingPeriod: data.billingPeriod,
      features: data.features || [],
      faq: data.faq || [],
      isActive: data.isActive !== undefined ? data.isActive : true,
      tenantId: 'tenant-001',
      createdAt: formatISO(new Date()),
      updatedAt: formatISO(new Date()),
    };

    mockStore.products.unshift(newProd);
    return newProd;
  },

  async updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
    await simulateDelay();
    const index = mockStore.products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Product with ID ${id} not found`);

    const updated: Product = {
      ...mockStore.products[index],
      ...data,
      updatedAt: formatISO(new Date()),
    };

    mockStore.products[index] = updated;
    return updated;
  },

  async deleteProduct(id: string): Promise<boolean> {
    await simulateDelay();
    const index = mockStore.products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Product with ID ${id} not found`);
    mockStore.products.splice(index, 1);
    return true;
  },
};

// ============================================================================
// 8. Analytics Mock Handlers
// ============================================================================

export const mockAnalyticsHandlers = {
  async getDashboardKPIs(): Promise<DashboardKPIs> {
    await simulateDelay();
    return { ...mockDashboardKPIs };
  },

  async getRevenueAnalytics(): Promise<{
    revenueOverTime: RevenueDataPoint[];
    totalRevenue: number;
    projectedRunRate: number;
  }> {
    await simulateDelay();
    return {
      revenueOverTime: mockRevenueOverTime,
      totalRevenue: mockRevenueOverTime.reduce((sum, item) => sum + item.revenue, 0),
      projectedRunRate: 198000 * 12,
    };
  },

  async getLeadAnalytics(): Promise<{
    leadAcquisition: LeadAcquisitionDataPoint[];
    sourcePerformance: typeof mockLeadSourcePerformance;
    totalAcquired: number;
  }> {
    await simulateDelay();
    return {
      leadAcquisition: mockLeadAcquisition,
      sourcePerformance: mockLeadSourcePerformance,
      totalAcquired: mockLeadAcquisition.reduce(
        (sum, item) =>
          sum +
          item.website +
          item.referral +
          item.linkedin +
          item.whatsapp +
          item.campaign +
          item.cold_outreach,
        0
      ),
    };
  },

  async getPipelineAnalytics(): Promise<{
    pipelineDistribution: PipelineDistributionItem[];
    conversionFunnel: ConversionFunnelStage[];
    repPerformance: typeof mockSalesRepPerformance;
  }> {
    await simulateDelay();
    return {
      pipelineDistribution: mockPipelineDistribution,
      conversionFunnel: mockConversionFunnel,
      repPerformance: mockSalesRepPerformance,
    };
  },

  async getCampaignAnalytics(): Promise<{
    campaignPerformance: CampaignPerformanceItem[];
    aiAgentActivity: typeof mockAIAgentActivity;
  }> {
    await simulateDelay();
    return {
      campaignPerformance: mockCampaignPerformance,
      aiAgentActivity: mockAIAgentActivity,
    };
  },
};

// ============================================================================
// 9. Auth Mock Handlers
// ============================================================================

export const mockAuthHandlers = {
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    await simulateDelay(300, 600);
    const user =
      mockStore.users.find(
        (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
      ) || mockStore.users[0];

    const fakeToken = `mock-jwt-token-${user.id}-${Date.now()}`;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('skar_access_token', fakeToken);
    }
    mockStore.currentUser = user;

    return {
      token: fakeToken,
      refreshToken: `mock-refresh-token-${user.id}`,
      user,
    };
  },

  async register(data: RegisterDto): Promise<AuthResponse> {
    await simulateDelay(400, 700);
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      name: data.name,
      avatar: data.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
      role: 'admin',
      tenantId: 'tenant-001',
      title: 'Founder & CEO',
      department: 'Executive Leadership',
      isActive: true,
      createdAt: formatISO(new Date()),
    };

    mockStore.users.push(newUser);
    mockStore.currentUser = newUser;
    const fakeToken = `mock-jwt-token-${newUser.id}-${Date.now()}`;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('skar_access_token', fakeToken);
    }

    return {
      token: fakeToken,
      refreshToken: `mock-refresh-token-${newUser.id}`,
      user: newUser,
    };
  },

  async logout(): Promise<boolean> {
    await simulateDelay(150, 300);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('skar_access_token');
      localStorage.removeItem('access_token');
    }
    return true;
  },

  async getCurrentUser(): Promise<User> {
    await simulateDelay(150, 300);
    return { ...mockStore.currentUser };
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    await simulateDelay();
    return {
      success: true,
      message: `Password reset instructions have been sent to ${email}`,
    };
  },

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    await simulateDelay();
    return {
      success: true,
      message: 'Your password has been successfully updated.',
    };
  },
};

// ============================================================================
// 10. Settings & Integrations Mock Handlers
// ============================================================================

export const mockSettingsHandlers = {
  async getSettings(): Promise<TenantSettings> {
    await simulateDelay();
    return { ...mockStore.settings };
  },

  async updateSettings(data: Partial<TenantSettings>): Promise<TenantSettings> {
    await simulateDelay();
    mockStore.settings = {
      ...mockStore.settings,
      ...data,
    };
    return { ...mockStore.settings };
  },

  async getTeamMembers(): Promise<TeamMember[]> {
    await simulateDelay();
    return [...mockStore.teamMembers];
  },

  async inviteUser(data: InviteUserDto): Promise<TeamMember> {
    await simulateDelay();
    const newMember: TeamMember = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      avatar: data.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
      status: 'invited',
      createdAt: formatISO(new Date()),
    };
    mockStore.teamMembers.push(newMember);
    return newMember;
  },

  async updateRole(userId: string, role: UserRole): Promise<TeamMember> {
    await simulateDelay();
    const member = mockStore.teamMembers.find((m) => m.id === userId);
    if (!member) throw new Error(`Team member with ID ${userId} not found`);
    member.role = role;

    const user = mockStore.users.find((u) => u.id === userId);
    if (user) user.role = role;

    return { ...member };
  },

  async getIntegrations(): Promise<IntegrationConfig[]> {
    await simulateDelay();
    return [...mockStore.integrations];
  },

  async toggleIntegration(id: string, enable: boolean): Promise<IntegrationConfig> {
    await simulateDelay();
    const intg = mockStore.integrations.find((i) => i.id === id);
    if (!intg) throw new Error(`Integration with ID ${id} not found`);
    intg.status = enable ? 'connected' : 'disconnected';
    intg.isConfigured = enable;
    if (enable) intg.lastSyncAt = formatISO(new Date());
    return { ...intg };
  },

  async updateIntegration(id: string, config: Record<string, unknown>): Promise<IntegrationConfig> {
    await simulateDelay();
    const intg = mockStore.integrations.find((i) => i.id === id);
    if (!intg) throw new Error(`Integration with ID ${id} not found`);
    intg.config = {
      ...(intg.config || {}),
      ...(config as Record<string, string | boolean | number>),
    };
    intg.isConfigured = true;
    intg.status = 'connected';
    intg.lastSyncAt = formatISO(new Date());
    return { ...intg };
  },
};
