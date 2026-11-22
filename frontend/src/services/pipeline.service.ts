import { apiClient, IS_DEV } from './api-client';
import { mockPipelineHandlers } from '@/mock/handlers';
import type {
  Opportunity,
  OpportunityFilters,
  CreateOpportunityDto,
  UpdateOpportunityDto,
  PipelineStage,
  PaginatedResponse,
} from '@/types';

export class PipelineService {
  async getOpportunities(filters: OpportunityFilters = {}): Promise<PaginatedResponse<Opportunity>> {
    try {
      if (IS_DEV) {
        return await mockPipelineHandlers.getOpportunities(filters);
      }
      return await apiClient.get<PaginatedResponse<Opportunity>>(
        '/pipeline/opportunities',
        filters as Record<string, string | number | boolean>
      );
    } catch (error) {
      console.error('[PipelineService.getOpportunities] Error:', error);
      throw error;
    }
  }

  async getOpportunity(id: string): Promise<Opportunity> {
    try {
      if (IS_DEV) {
        return await mockPipelineHandlers.getOpportunity(id);
      }
      return await apiClient.get<Opportunity>(`/pipeline/opportunities/${id}`);
    } catch (error) {
      console.error(`[PipelineService.getOpportunity] Error fetching opportunity ${id}:`, error);
      throw error;
    }
  }

  async updateOpportunityStage(id: string, stage: PipelineStage): Promise<Opportunity> {
    try {
      if (IS_DEV) {
        return await mockPipelineHandlers.updateOpportunityStage(id, stage);
      }
      return await apiClient.patch<Opportunity>(`/pipeline/opportunities/${id}/stage`, { stage });
    } catch (error) {
      console.error(`[PipelineService.updateOpportunityStage] Error updating stage for ${id}:`, error);
      throw error;
    }
  }

  async createOpportunity(data: CreateOpportunityDto): Promise<Opportunity> {
    try {
      if (IS_DEV) {
        return await mockPipelineHandlers.createOpportunity(data);
      }
      return await apiClient.post<Opportunity>('/pipeline/opportunities', data);
    } catch (error) {
      console.error('[PipelineService.createOpportunity] Error:', error);
      throw error;
    }
  }

  async updateOpportunity(id: string, data: UpdateOpportunityDto): Promise<Opportunity> {
    try {
      if (IS_DEV) {
        return await mockPipelineHandlers.updateOpportunity(id, data);
      }
      return await apiClient.patch<Opportunity>(`/pipeline/opportunities/${id}`, data);
    } catch (error) {
      console.error(`[PipelineService.updateOpportunity] Error updating ${id}:`, error);
      throw error;
    }
  }

  async deleteOpportunity(id: string): Promise<boolean> {
    try {
      if (IS_DEV) {
        return await mockPipelineHandlers.deleteOpportunity(id);
      }
      await apiClient.delete(`/pipeline/opportunities/${id}`);
      return true;
    } catch (error) {
      console.error(`[PipelineService.deleteOpportunity] Error deleting ${id}:`, error);
      throw error;
    }
  }
}

export const pipelineService = new PipelineService();
