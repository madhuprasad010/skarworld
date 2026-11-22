import { apiClient, IS_DEV } from './api-client';
import { mockLeadsHandlers } from '@/mock/handlers';
import type {
  Lead,
  LeadFilters,
  CreateLeadDto,
  UpdateLeadDto,
  BulkUpdateLeadsDto,
  PaginatedResponse,
} from '@/types';

export class LeadsService {
  async getLeads(filters: LeadFilters = {}): Promise<PaginatedResponse<Lead>> {
    try {
      if (IS_DEV) {
        return await mockLeadsHandlers.getLeads(filters);
      }
      return await apiClient.get<PaginatedResponse<Lead>>('/leads', filters as Record<string, string | number | boolean>);
    } catch (error) {
      console.error('[LeadsService.getLeads] Error:', error);
      throw error;
    }
  }

  async getLead(id: string): Promise<Lead> {
    try {
      if (IS_DEV) {
        return await mockLeadsHandlers.getLead(id);
      }
      return await apiClient.get<Lead>(`/leads/${id}`);
    } catch (error) {
      console.error(`[LeadsService.getLead] Error fetching lead ${id}:`, error);
      throw error;
    }
  }

  async createLead(data: CreateLeadDto): Promise<Lead> {
    try {
      if (IS_DEV) {
        return await mockLeadsHandlers.createLead(data);
      }
      return await apiClient.post<Lead>('/leads', data);
    } catch (error) {
      console.error('[LeadsService.createLead] Error:', error);
      throw error;
    }
  }

  async updateLead(id: string, data: UpdateLeadDto): Promise<Lead> {
    try {
      if (IS_DEV) {
        return await mockLeadsHandlers.updateLead(id, data);
      }
      return await apiClient.patch<Lead>(`/leads/${id}`, data);
    } catch (error) {
      console.error(`[LeadsService.updateLead] Error updating lead ${id}:`, error);
      throw error;
    }
  }

  async deleteLead(id: string): Promise<boolean> {
    try {
      if (IS_DEV) {
        return await mockLeadsHandlers.deleteLead(id);
      }
      await apiClient.delete(`/leads/${id}`);
      return true;
    } catch (error) {
      console.error(`[LeadsService.deleteLead] Error deleting lead ${id}:`, error);
      throw error;
    }
  }

  async bulkUpdateLeads(data: BulkUpdateLeadsDto): Promise<Lead[]> {
    try {
      if (IS_DEV) {
        return await mockLeadsHandlers.bulkUpdateLeads(data);
      }
      return await apiClient.post<Lead[]>('/leads/bulk', data);
    } catch (error) {
      console.error('[LeadsService.bulkUpdateLeads] Error:', error);
      throw error;
    }
  }

  async exportLeads(filters: LeadFilters = {}): Promise<string> {
    try {
      if (IS_DEV) {
        return await mockLeadsHandlers.exportLeads(filters);
      }
      return await apiClient.get<string>('/leads/export', filters as Record<string, string | number | boolean>);
    } catch (error) {
      console.error('[LeadsService.exportLeads] Error:', error);
      throw error;
    }
  }
}

export const leadsService = new LeadsService();
