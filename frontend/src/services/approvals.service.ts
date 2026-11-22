import { apiClient, IS_DEV } from './api-client';
import { mockApprovalsHandlers } from '@/mock/handlers';
import type {
  Approval,
  ApprovalFilters,
  PaginatedResponse,
} from '@/types';

export class ApprovalsService {
  async getApprovals(filters: ApprovalFilters = {}): Promise<PaginatedResponse<Approval>> {
    try {
      if (IS_DEV) {
        return await mockApprovalsHandlers.getApprovals(filters);
      }
      return await apiClient.get<PaginatedResponse<Approval>>(
        '/approvals',
        filters as Record<string, string | number | boolean>
      );
    } catch (error) {
      console.error('[ApprovalsService.getApprovals] Error:', error);
      throw error;
    }
  }

  async getApproval(id: string): Promise<Approval> {
    try {
      if (IS_DEV) {
        return await mockApprovalsHandlers.getApproval(id);
      }
      return await apiClient.get<Approval>(`/approvals/${id}`);
    } catch (error) {
      console.error(`[ApprovalsService.getApproval] Error fetching ${id}:`, error);
      throw error;
    }
  }

  async approveRequest(id: string, comments?: string): Promise<Approval> {
    try {
      if (IS_DEV) {
        return await mockApprovalsHandlers.approveRequest(id, comments);
      }
      return await apiClient.post<Approval>(`/approvals/${id}/approve`, { comments });
    } catch (error) {
      console.error(`[ApprovalsService.approveRequest] Error approving ${id}:`, error);
      throw error;
    }
  }

  async rejectRequest(id: string, reason?: string): Promise<Approval> {
    try {
      if (IS_DEV) {
        return await mockApprovalsHandlers.rejectRequest(id, reason);
      }
      return await apiClient.post<Approval>(`/approvals/${id}/reject`, { reason });
    } catch (error) {
      console.error(`[ApprovalsService.rejectRequest] Error rejecting ${id}:`, error);
      throw error;
    }
  }

  async requestChanges(id: string, comments: string): Promise<Approval> {
    try {
      if (IS_DEV) {
        return await mockApprovalsHandlers.requestChanges(id, comments);
      }
      return await apiClient.post<Approval>(`/approvals/${id}/request-changes`, { comments });
    } catch (error) {
      console.error(`[ApprovalsService.requestChanges] Error on ${id}:`, error);
      throw error;
    }
  }
}

export const approvalsService = new ApprovalsService();
