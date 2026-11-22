import { apiClient, IS_DEV } from './api-client';
import { mockConversationsHandlers } from '@/mock/handlers';
import type {
  Conversation,
  ConversationFilters,
  Message,
  MessageSenderType,
  ChannelType,
  PaginatedResponse,
} from '@/types';

export class ConversationsService {
  async getConversations(filters: ConversationFilters = {}): Promise<PaginatedResponse<Conversation>> {
    try {
      if (IS_DEV) {
        return await mockConversationsHandlers.getConversations(filters);
      }
      return await apiClient.get<PaginatedResponse<Conversation>>(
        '/conversations',
        filters as Record<string, string | number | boolean>
      );
    } catch (error) {
      console.error('[ConversationsService.getConversations] Error:', error);
      throw error;
    }
  }

  async getConversation(id: string): Promise<Conversation> {
    try {
      if (IS_DEV) {
        return await mockConversationsHandlers.getConversation(id);
      }
      return await apiClient.get<Conversation>(`/conversations/${id}`);
    } catch (error) {
      console.error(`[ConversationsService.getConversation] Error fetching ${id}:`, error);
      throw error;
    }
  }

  async sendMessage(
    conversationId: string,
    content: string,
    senderType: MessageSenderType = 'user'
  ): Promise<Message> {
    try {
      if (IS_DEV) {
        return await mockConversationsHandlers.sendMessage(conversationId, content, senderType);
      }
      return await apiClient.post<Message>(`/conversations/${conversationId}/messages`, {
        content,
        senderType,
      });
    } catch (error) {
      console.error(`[ConversationsService.sendMessage] Error in conversation ${conversationId}:`, error);
      throw error;
    }
  }

  async createConversation(
    leadId: string,
    channel: ChannelType,
    initialMessage?: string
  ): Promise<Conversation> {
    try {
      if (IS_DEV) {
        return await mockConversationsHandlers.createConversation(leadId, channel, initialMessage);
      }
      return await apiClient.post<Conversation>('/conversations', {
        leadId,
        channel,
        initialMessage,
      });
    } catch (error) {
      console.error('[ConversationsService.createConversation] Error:', error);
      throw error;
    }
  }
}

export const conversationsService = new ConversationsService();
