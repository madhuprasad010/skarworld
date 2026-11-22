import { apiClient, IS_DEV } from './api-client';
import { mockSettingsHandlers } from '@/mock/handlers';
import type {
  TenantSettings,
  TeamMember,
  InviteUserDto,
  UserRole,
  IntegrationConfig,
} from '@/types';

export class SettingsService {
  async getSettings(): Promise<TenantSettings> {
    try {
      if (IS_DEV) {
        return await mockSettingsHandlers.getSettings();
      }
      return await apiClient.get<TenantSettings>('/settings');
    } catch (error) {
      console.error('[SettingsService.getSettings] Error:', error);
      throw error;
    }
  }

  async updateSettings(data: Partial<TenantSettings>): Promise<TenantSettings> {
    try {
      if (IS_DEV) {
        return await mockSettingsHandlers.updateSettings(data);
      }
      return await apiClient.patch<TenantSettings>('/settings', data);
    } catch (error) {
      console.error('[SettingsService.updateSettings] Error:', error);
      throw error;
    }
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    try {
      if (IS_DEV) {
        return await mockSettingsHandlers.getTeamMembers();
      }
      return await apiClient.get<TeamMember[]>('/settings/team');
    } catch (error) {
      console.error('[SettingsService.getTeamMembers] Error:', error);
      throw error;
    }
  }

  async inviteUser(data: InviteUserDto): Promise<TeamMember> {
    try {
      if (IS_DEV) {
        return await mockSettingsHandlers.inviteUser(data);
      }
      return await apiClient.post<TeamMember>('/settings/team/invite', data);
    } catch (error) {
      console.error('[SettingsService.inviteUser] Error:', error);
      throw error;
    }
  }

  async updateRole(userId: string, role: UserRole): Promise<TeamMember> {
    try {
      if (IS_DEV) {
        return await mockSettingsHandlers.updateRole(userId, role);
      }
      return await apiClient.patch<TeamMember>(`/settings/team/${userId}/role`, { role });
    } catch (error) {
      console.error(`[SettingsService.updateRole] Error updating role for ${userId}:`, error);
      throw error;
    }
  }

  async getIntegrations(): Promise<IntegrationConfig[]> {
    try {
      if (IS_DEV) {
        return await mockSettingsHandlers.getIntegrations();
      }
      return await apiClient.get<IntegrationConfig[]>('/integrations');
    } catch (error) {
      console.error('[SettingsService.getIntegrations] Error:', error);
      throw error;
    }
  }

  async toggleIntegration(id: string, enable: boolean): Promise<IntegrationConfig> {
    try {
      if (IS_DEV) {
        return await mockSettingsHandlers.toggleIntegration(id, enable);
      }
      return await apiClient.post<IntegrationConfig>(`/integrations/${id}/toggle`, { enable });
    } catch (error) {
      console.error(`[SettingsService.toggleIntegration] Error toggling ${id}:`, error);
      throw error;
    }
  }

  async updateIntegration(id: string, config: Record<string, unknown>): Promise<IntegrationConfig> {
    try {
      if (IS_DEV) {
        return await mockSettingsHandlers.updateIntegration(id, config);
      }
      return await apiClient.patch<IntegrationConfig>(`/integrations/${id}`, config);
    } catch (error) {
      console.error(`[SettingsService.updateIntegration] Error updating ${id}:`, error);
      throw error;
    }
  }
}

export const settingsService = new SettingsService();
