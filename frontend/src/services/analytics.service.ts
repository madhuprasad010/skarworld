import { apiClient, IS_DEV } from './api-client';
import { mockAnalyticsHandlers } from '@/mock/handlers';
import type {
  DashboardKPIs,
  RevenueDataPoint,
  LeadAcquisitionDataPoint,
  ConversionFunnelStage,
  PipelineDistributionItem,
  CampaignPerformanceItem,
  AIAgentActivityItem,
  LeadSourcePerformanceItem,
  SalesRepPerformanceItem,
} from '@/types';

export class AnalyticsService {
  async getDashboardKPIs(): Promise<DashboardKPIs> {
    try {
      if (IS_DEV) {
        return await mockAnalyticsHandlers.getDashboardKPIs();
      }
      return await apiClient.get<DashboardKPIs>('/analytics/dashboard-kpis');
    } catch (error) {
      console.error('[AnalyticsService.getDashboardKPIs] Error:', error);
      throw error;
    }
  }

  async getRevenueAnalytics(): Promise<{
    revenueOverTime: RevenueDataPoint[];
    totalRevenue: number;
    projectedRunRate: number;
  }> {
    try {
      if (IS_DEV) {
        return await mockAnalyticsHandlers.getRevenueAnalytics();
      }
      return await apiClient.get<{
        revenueOverTime: RevenueDataPoint[];
        totalRevenue: number;
        projectedRunRate: number;
      }>('/analytics/revenue');
    } catch (error) {
      console.error('[AnalyticsService.getRevenueAnalytics] Error:', error);
      throw error;
    }
  }

  async getLeadAnalytics(): Promise<{
    leadAcquisition: LeadAcquisitionDataPoint[];
    sourcePerformance: LeadSourcePerformanceItem[];
    totalAcquired: number;
  }> {
    try {
      if (IS_DEV) {
        return await mockAnalyticsHandlers.getLeadAnalytics();
      }
      return await apiClient.get<{
        leadAcquisition: LeadAcquisitionDataPoint[];
        sourcePerformance: LeadSourcePerformanceItem[];
        totalAcquired: number;
      }>('/analytics/leads');
    } catch (error) {
      console.error('[AnalyticsService.getLeadAnalytics] Error:', error);
      throw error;
    }
  }

  async getPipelineAnalytics(): Promise<{
    pipelineDistribution: PipelineDistributionItem[];
    conversionFunnel: ConversionFunnelStage[];
    repPerformance: SalesRepPerformanceItem[];
  }> {
    try {
      if (IS_DEV) {
        return await mockAnalyticsHandlers.getPipelineAnalytics();
      }
      return await apiClient.get<{
        pipelineDistribution: PipelineDistributionItem[];
        conversionFunnel: ConversionFunnelStage[];
        repPerformance: SalesRepPerformanceItem[];
      }>('/analytics/pipeline');
    } catch (error) {
      console.error('[AnalyticsService.getPipelineAnalytics] Error:', error);
      throw error;
    }
  }

  async getCampaignAnalytics(): Promise<{
    campaignPerformance: CampaignPerformanceItem[];
    aiAgentActivity: AIAgentActivityItem[];
  }> {
    try {
      if (IS_DEV) {
        return await mockAnalyticsHandlers.getCampaignAnalytics();
      }
      return await apiClient.get<{
        campaignPerformance: CampaignPerformanceItem[];
        aiAgentActivity: AIAgentActivityItem[];
      }>('/analytics/campaigns');
    } catch (error) {
      console.error('[AnalyticsService.getCampaignAnalytics] Error:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
