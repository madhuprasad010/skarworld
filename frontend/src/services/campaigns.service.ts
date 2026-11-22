import { apiClient, IS_DEV } from './api-client';
import { mockCampaignsHandlers } from '@/mock/handlers';
import type {
  Campaign,
  CampaignFilters,
  CreateCampaignDto,
  UpdateCampaignDto,
  PaginatedResponse,
} from '@/types';

export class CampaignsService {
  async getCampaigns(filters: CampaignFilters = {}): Promise<PaginatedResponse<Campaign>> {
    try {
      if (IS_DEV) {
        return await mockCampaignsHandlers.getCampaigns(filters);
      }
      return await apiClient.get<PaginatedResponse<Campaign>>(
        '/campaigns',
        filters as Record<string, string | number | boolean>
      );
    } catch (error) {
      console.error('[CampaignsService.getCampaigns] Error:', error);
      throw error;
    }
  }

  async getCampaign(id: string): Promise<Campaign> {
    try {
      if (IS_DEV) {
        return await mockCampaignsHandlers.getCampaign(id);
      }
      return await apiClient.get<Campaign>(`/campaigns/${id}`);
    } catch (error) {
      console.error(`[CampaignsService.getCampaign] Error fetching ${id}:`, error);
      throw error;
    }
  }

  async createCampaign(data: CreateCampaignDto): Promise<Campaign> {
    try {
      if (IS_DEV) {
        return await mockCampaignsHandlers.createCampaign(data);
      }
      return await apiClient.post<Campaign>('/campaigns', data);
    } catch (error) {
      console.error('[CampaignsService.createCampaign] Error:', error);
      throw error;
    }
  }

  async updateCampaign(id: string, data: UpdateCampaignDto): Promise<Campaign> {
    try {
      if (IS_DEV) {
        return await mockCampaignsHandlers.updateCampaign(id, data);
      }
      return await apiClient.patch<Campaign>(`/campaigns/${id}`, data);
    } catch (error) {
      console.error(`[CampaignsService.updateCampaign] Error updating ${id}:`, error);
      throw error;
    }
  }

  async pauseCampaign(id: string): Promise<Campaign> {
    try {
      if (IS_DEV) {
        return await mockCampaignsHandlers.pauseCampaign(id);
      }
      return await apiClient.post<Campaign>(`/campaigns/${id}/pause`);
    } catch (error) {
      console.error(`[CampaignsService.pauseCampaign] Error pausing ${id}:`, error);
      throw error;
    }
  }

  async resumeCampaign(id: string): Promise<Campaign> {
    try {
      if (IS_DEV) {
        return await mockCampaignsHandlers.resumeCampaign(id);
      }
      return await apiClient.post<Campaign>(`/campaigns/${id}/resume`);
    } catch (error) {
      console.error(`[CampaignsService.resumeCampaign] Error resuming ${id}:`, error);
      throw error;
    }
  }
}

export const campaignsService = new CampaignsService();
