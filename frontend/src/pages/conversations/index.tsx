import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Smile,
  Bot,
  UserCheck,
  Check,
  CheckCheck,
  PanelRightClose,
  PanelRightOpen,
  Mail,
  Smartphone,
  Send as TelegramIcon,
  Globe,
  Sparkles,
  ExternalLink,
  ChevronRight,
  User as UserIcon,
  Phone,
  FileText,
  Clock,
  Shield,
  X,
} from 'lucide-react';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { mockConversations, type ExtendedConversation, type ExtendedMessage } from '@/mock/data/conversations';
import type { ChannelType, ConversationStatus, MessageStatus } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

type ChannelFilter = 'all' | ChannelType;

export default function ConversationsPage() {
  const { toast } = useToast();
  const navigate = useNavigate();

  // State
  const [conversations, setConversations] = useState<ExtendedConversation[]>(mockConversations);
  const [selectedId, setSelectedId] = useState<string>(mockConversations[0]?.id || '');
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isInternalNoteMode, setIsInternalNoteMode] = useState(false);
  const [composerText, setComposerText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Active selected conversation
  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedId) || conversations[0];
  }, [conversations, selectedId]);

  // Scroll to bottom of message thread on conversation select or new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedId, activeConversation?.messages?.length]);

  // Handle conversation selection & clear unread count
  const handleSelectConversation = (id: string) => {
    setSelectedId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  // Filtered conversations
  const filteredConversations = useMemo(() => {
    return conversations
      .filter((conv) => {
        // Channel filter
        if (channelFilter !== 'all' && conv.channel !== channelFilter) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = (conv.leadName || '').toLowerCase().includes(q);
          const matchCompany = (conv.leadCompany || '').toLowerCase().includes(q);
          const matchMsg = conv.messages?.some((m) => (m.content || '').toLowerCase().includes(q));
          if (!matchName && !matchCompany && !matchMsg) return false;
        }
        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt || 0).getTime() -
          new Date(a.updatedAt || a.createdAt || 0).getTime()
      );
  }, [conversations, channelFilter, searchQuery]);

  // Send message or internal note
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!composerText.trim() && attachedFiles.length === 0) return;

    if (!activeConversation) return;

    const newMsg: ExtendedMessage = {
      id: `msg-${Date.now()}`,
      conversationId: activeConversation.id,
      senderId: 'user-001',
      senderType: 'user',
      senderName: 'You (Skar Admin)',
      content: composerText.trim(),
      status: 'sent',
      channel: activeConversation.channel,
      createdAt: new Date().toISOString(),
      isInternalNote: isInternalNoteMode,
      metadata: attachedFiles.length > 0 ? { attachments: attachedFiles } : undefined,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversation.id) {
          return {
            ...conv,
            updatedAt: new Date().toISOString(),
            lastActive: 'Just now',
            lastMessage: !isInternalNoteMode ? newMsg : conv.lastMessage,
            messages: [...conv.messages, newMsg],
          };
        }
        return conv;
      })
    );

    setComposerText('');
    setAttachedFiles([]);
    setShowEmojiPicker(false);

    if (isInternalNoteMode) {
      toast({
        title: 'Internal Note Added',
        description: 'Note recorded to conversation timeline.',
      });
    } else {
      toast({
        title: 'Message Sent',
        description: `Delivered via ${getChannelLabel(activeConversation.channel)}.`,
      });
    }
  };

  // AI Suggestion Actions
  const handleAcceptSuggestion = (suggestionMsg: ExtendedMessage) => {
    if (!activeConversation) return;

    const acceptedMsg: ExtendedMessage = {
      id: `msg-${Date.now()}`,
      conversationId: activeConversation.id,
      senderId: 'user-001',
      senderType: 'user',
      senderName: 'You (Approved AI)',
      content: suggestionMsg.content,
      status: 'sent',
      channel: activeConversation.channel,
      createdAt: new Date().toISOString(),
      isInternalNote: false,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversation.id) {
          return {
            ...conv,
            updatedAt: new Date().toISOString(),
            lastActive: 'Just now',
            lastMessage: acceptedMsg,
            messages: conv.messages
              .filter((m) => m.id !== suggestionMsg.id)
              .concat(acceptedMsg),
          };
        }
        return conv;
      })
    );

    toast({
      title: 'AI Suggestion Accepted & Sent',
      description: 'The response was immediately dispatched to the prospect.',
      variant: 'default',
    });
  };

  const handleEditSuggestion = (suggestionMsg: ExtendedMessage) => {
    setComposerText(suggestionMsg.content);
    setIsInternalNoteMode(false);
    textareaRef.current?.focus();
    toast({
      title: 'Loaded into Composer',
      description: 'You can now refine and submit the AI response.',
    });
  };

  const handleDismissSuggestion = (suggestionId: string) => {
    if (!activeConversation) return;
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversation.id) {
          return {
            ...conv,
            messages: conv.messages.filter((m) => m.id !== suggestionId),
          };
        }
        return conv;
      })
    );
    toast({
      title: 'Suggestion Dismissed',
      description: 'The AI draft was removed from the thread.',
    });
  };

  // Take over toggle
  const handleToggleTakeOver = () => {
    if (!activeConversation) return;
    const nextState = !activeConversation.isAiHandling;

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversation.id) {
          return {
            ...conv,
            isAiHandling: nextState,
          };
        }
        return conv;
      })
    );

    if (nextState) {
      toast({
        title: 'AI Agent Autonomous Mode Active',
        description: 'AI will now draft and recommend responses automatically.',
      });
    } else {
      toast({
        title: 'Human Takeover Activated',
        description: 'AI autonomous responses paused. You have full manual control.',
      });
    }
  };

  // File attach simulation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const names = Array.from(files).map((f) => f.name);
      setAttachedFiles((prev) => [...prev, ...names]);
      toast({
        title: 'File Attached',
        description: `${files[0].name} ready to send.`,
      });
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Helper renderers
  const getChannelIcon = (channel: ChannelType, className?: string) => {
    switch (channel) {
      case 'whatsapp':
        return <Smartphone className={cn('h-3.5 w-3.5 text-emerald-500', className)} />;
      case 'email':
        return <Mail className={cn('h-3.5 w-3.5 text-blue-500', className)} />;
      case 'telegram':
        return <TelegramIcon className={cn('h-3.5 w-3.5 text-sky-500', className)} />;
      case 'web_chat':
        return <Globe className={cn('h-3.5 w-3.5 text-indigo-500', className)} />;
    }
  };

  const getChannelBadgeColor = (channel: ChannelType) => {
    switch (channel) {
      case 'whatsapp':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'email':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'telegram':
        return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';
      case 'web_chat':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
    }
  };

  const getChannelLabel = (channel: ChannelType) => {
    switch (channel) {
      case 'whatsapp':
        return 'WhatsApp';
      case 'email':
        return 'Email';
      case 'telegram':
        return 'Telegram';
      case 'web_chat':
        return 'Web Chat';
    }
  };

  const getStatusDot = (status: ConversationStatus) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500 ring-emerald-500/20';
      case 'waiting':
        return 'bg-amber-500 ring-amber-500/20';
      case 'resolved':
      case 'archived':
        return 'bg-slate-400 ring-slate-400/20';
    }
  };

  const getDeliveryStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case 'sent':
        return <Check className="h-3.5 w-3.5 text-muted-foreground/70" />;
      case 'delivered':
        return <CheckCheck className="h-3.5 w-3.5 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="h-3.5 w-3.5 text-primary" />;
      default:
        return null;
    }
  };

  // Group messages by date
  const groupedMessages = useMemo(() => {
    if (!activeConversation) return [];
    const groups: { dateLabel: string; messages: ExtendedMessage[] }[] = [];

    activeConversation.messages.forEach((msg) => {
      const date = parseISO(msg.createdAt);
      let dateLabel = format(date, 'MMM d, yyyy');
      if (isToday(date)) dateLabel = 'Today';
      else if (isYesterday(date)) dateLabel = 'Yesterday';

      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.dateLabel === dateLabel) {
        lastGroup.messages.push(msg);
      } else {
        groups.push({ dateLabel, messages: [msg] });
      }
    });

    return groups;
  }, [activeConversation]);

  const quickEmojis = ['👍', '👋', '🚀', '💡', '🤝', '📅', '🙏', '🔥'];

  return (
    <div className="flex h-[calc(100vh-8.5rem)] min-h-[600px] w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* =========================================================================
          LEFT PANEL: Conversation List (~300px)
          ========================================================================= */}
      <div className="flex w-72 md:w-80 shrink-0 flex-col border-r border-border bg-card/60">
        {/* Search header */}
        <div className="p-3 border-b border-border/80">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-8 text-xs bg-background/70"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Channel Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-border px-3 py-2 scrollbar-none">
          {(
            [
              { key: 'all', label: 'All' },
              { key: 'whatsapp', label: 'WhatsApp' },
              { key: 'email', label: 'Email' },
              { key: 'telegram', label: 'Telegram' },
              { key: 'web_chat', label: 'Web' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setChannelFilter(tab.key)}
              className={cn(
                'whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                channelFilter === tab.key
                  ? 'bg-primary text-primary-foreground shadow-2xs font-semibold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/50">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <MessageSquare className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm font-medium text-foreground">No conversations found</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Try adjusting your search or channel filter.
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConversation?.id;
              const hasAiSuggestion = conv.messages.some((m) => m.isAiSuggestion);

              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={cn(
                    'group relative flex cursor-pointer items-start gap-3 p-3 transition-colors',
                    isSelected
                      ? 'bg-primary/10 border-l-2 border-l-primary'
                      : 'hover:bg-muted/50'
                  )}
                >
                  {/* Avatar with Channel Overlay */}
                  <div className="relative shrink-0">
                    <Avatar className="h-10 w-10 text-xs">
                      <AvatarFallback
                        className={cn(
                          'font-semibold',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        )}
                      >
                        {conv.leadAvatar}
                      </AvatarFallback>
                    </Avatar>
                    {/* Small Channel badge overlay */}
                    <div
                      className={cn(
                        'absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-background bg-card shadow-2xs'
                      )}
                    >
                      {getChannelIcon(conv.channel, 'h-2.5 w-2.5')}
                    </div>
                  </div>

                  {/* Text details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="truncate text-xs font-semibold text-foreground">
                        {conv.leadName}
                      </span>
                      <span className="shrink-0 text-3xs text-muted-foreground">
                        {format(
                          parseISO(conv.updatedAt || conv.createdAt || new Date().toISOString()),
                          'HH:mm'
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="truncate text-2xs text-muted-foreground">
                        {conv.leadCompany}
                      </span>
                      {/* Status dot */}
                      <span
                        className={cn(
                          'h-1.5 w-1.5 shrink-0 rounded-full ring-2',
                          getStatusDot(conv.status)
                        )}
                        title={`Status: ${conv.status}`}
                      />
                    </div>

                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground/90">
                      {conv.lastMessage?.content || 'No messages yet'}
                    </p>

                    {/* AI Suggestion indicator or unread badge */}
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      {hasAiSuggestion ? (
                        <span className="inline-flex items-center gap-1 text-3xs font-medium text-purple-600 dark:text-purple-400">
                          <Sparkles className="h-3 w-3 shrink-0" />
                          <span>AI Suggestion</span>
                        </span>
                      ) : (
                        <span className="text-3xs text-muted-foreground/60 capitalize">
                          {conv.channel.replace('_', ' ')}
                        </span>
                      )}

                      {conv.unreadCount > 0 && (
                        <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-3xs font-bold text-primary-foreground shadow-2xs">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* =========================================================================
          CENTER PANEL: Message Thread
          ========================================================================= */}
      <div className="flex flex-1 flex-col overflow-hidden bg-background">
        {activeConversation ? (
          <>
            {/* Thread Header */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/60 px-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <Avatar className="h-9 w-9 text-xs">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {activeConversation.leadAvatar}
                  </AvatarFallback>
                </Avatar>

                <div className="overflow-hidden">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-sm font-semibold text-foreground">
                      {activeConversation.leadName}
                    </h2>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-3xs font-medium border px-1.5 py-0',
                        getChannelBadgeColor(activeConversation.channel)
                      )}
                    >
                      {getChannelIcon(activeConversation.channel, 'mr-1 h-3 w-3 inline')}
                      {getChannelLabel(activeConversation.channel)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-2xs text-muted-foreground">
                    <span className="truncate">{activeConversation.leadCompany}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 capitalize">
                      <span
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          getStatusDot(activeConversation.status)
                        )}
                      />
                      {activeConversation.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Header Right Action: Right Panel Toggle */}
              <div className="flex items-center gap-2">
                <Badge
                  variant={activeConversation.isAiHandling ? 'secondary' : 'outline'}
                  className={cn(
                    'text-2xs font-medium hidden sm:inline-flex gap-1',
                    activeConversation.isAiHandling
                      ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  <Bot className="h-3 w-3" />
                  {activeConversation.isAiHandling ? 'AI Copilot Active' : 'Manual Control'}
                </Badge>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                  title={isRightPanelOpen ? 'Collapse Details' : 'Open Details'}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  {isRightPanelOpen ? (
                    <PanelRightClose className="h-4 w-4" />
                  ) : (
                    <PanelRightOpen className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Scrollable Message List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {groupedMessages.map((group) => (
                <div key={group.dateLabel} className="space-y-3">
                  {/* Date Separator */}
                  <div className="relative flex items-center justify-center my-3">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border/60" />
                    </div>
                    <span className="relative rounded-full bg-muted/80 px-3 py-0.5 text-3xs font-semibold uppercase tracking-wider text-muted-foreground shadow-2xs">
                      {group.dateLabel}
                    </span>
                  </div>

                  {/* Messages within Date */}
                  {group.messages.map((msg) => {
                    const isIncoming = msg.senderType === 'lead';
                    const isInternalNote = msg.isInternalNote;
                    const isAiSuggestion = msg.isAiSuggestion;

                    // 1. AI Suggestion Special Message Card
                    if (isAiSuggestion) {
                      return (
                        <div
                          key={msg.id}
                          className="my-3 rounded-xl border border-dashed border-purple-400/60 bg-purple-500/5 p-4 shadow-sm dark:border-purple-600/60 dark:bg-purple-950/20"
                        >
                          <div className="flex items-center justify-between border-b border-purple-200/40 pb-2 dark:border-purple-800/40">
                            <div className="flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-500/20 text-purple-600 dark:text-purple-300">
                                <Sparkles className="h-3.5 w-3.5" />
                              </div>
                              <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                                AI Suggested Response
                              </span>
                              {msg.confidenceScore && (
                                <span className="rounded-full bg-purple-500/10 px-2 py-0.2 text-3xs font-medium text-purple-600 dark:text-purple-400">
                                  {Math.round(msg.confidenceScore * 100)}% match confidence
                                </span>
                              )}
                            </div>
                            <span className="text-3xs text-muted-foreground">
                              {format(parseISO(msg.createdAt), 'HH:mm')}
                            </span>
                          </div>

                          <p className="mt-2 text-xs leading-relaxed text-foreground whitespace-pre-wrap">
                            {msg.content}
                          </p>

                          <div className="mt-3 flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDismissSuggestion(msg.id)}
                              className="h-7 text-xs text-muted-foreground hover:text-foreground"
                            >
                              Dismiss
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditSuggestion(msg)}
                              className="h-7 text-xs border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-950"
                            >
                              Edit Draft
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAcceptSuggestion(msg)}
                              className="h-7 text-xs bg-purple-600 text-white hover:bg-purple-700 shadow-2xs"
                            >
                              Accept & Send
                            </Button>
                          </div>
                        </div>
                      );
                    }

                    // 2. Internal Note Message
                    if (isInternalNote) {
                      return (
                        <div
                          key={msg.id}
                          className="mx-auto my-2 max-w-xl rounded-lg border border-amber-300/60 bg-amber-500/10 p-3 shadow-2xs dark:border-amber-600/40 dark:bg-amber-950/20"
                        >
                          <div className="flex items-center justify-between text-2xs font-semibold text-amber-700 dark:text-amber-400">
                            <div className="flex items-center gap-1.5">
                              <FileText className="h-3.5 w-3.5" />
                              <span>Internal Team Note</span>
                              <span className="font-normal text-muted-foreground">
                                • {msg.senderName}
                              </span>
                            </div>
                            <span className="text-3xs font-normal text-muted-foreground">
                              {format(parseISO(msg.createdAt), 'HH:mm')}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-foreground/90 whitespace-pre-wrap">
                            {msg.content}
                          </p>
                        </div>
                      );
                    }

                    // 3. Regular Incoming vs Outgoing Message
                    return (
                      <div
                        key={msg.id}
                        className={cn('flex flex-col', isIncoming ? 'items-start' : 'items-end')}
                      >
                        <div
                          className={cn(
                            'group relative max-w-[80%] rounded-2xl px-4 py-2.5 shadow-2xs text-xs leading-relaxed',
                            isIncoming
                              ? 'rounded-tl-none bg-muted text-foreground'
                              : 'rounded-tr-none bg-primary text-primary-foreground'
                          )}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>

                          {/* Message Metadata & Delivery Status */}
                          <div
                            className={cn(
                              'mt-1 flex items-center gap-1 text-3xs select-none',
                              isIncoming ? 'text-muted-foreground' : 'text-primary-foreground/80 justify-end'
                            )}
                          >
                            <span>{format(parseISO(msg.createdAt), 'HH:mm')}</span>
                            {!isIncoming && (
                              <span className="inline-flex items-center">
                                {getDeliveryStatusIcon(msg.status)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Composer Area */}
            <div className="border-t border-border bg-card p-3">
              {/* Internal Note vs Normal Message Switch Banner */}
              <div className="mb-2 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Switch
                    id="internal-note-mode"
                    checked={isInternalNoteMode}
                    onCheckedChange={setIsInternalNoteMode}
                  />
                  <label
                    htmlFor="internal-note-mode"
                    className={cn(
                      'text-xs font-medium cursor-pointer select-none transition-colors',
                      isInternalNoteMode
                        ? 'text-amber-600 dark:text-amber-400 font-semibold'
                        : 'text-muted-foreground'
                    )}
                  >
                    {isInternalNoteMode ? 'Internal Note Mode (Private)' : 'Customer Reply Mode'}
                  </label>
                </div>

                <div className="flex items-center gap-1.5 text-2xs text-muted-foreground">
                  <span>Replying via:</span>
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    {getChannelIcon(activeConversation.channel)}
                    {getChannelLabel(activeConversation.channel)}
                  </span>
                </div>
              </div>

              {/* Attachment Preview Chips */}
              {attachedFiles.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {attachedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 rounded-md border border-border bg-muted px-2 py-1 text-2xs"
                    >
                      <Paperclip className="h-3 w-3 text-muted-foreground" />
                      <span className="truncate max-w-[180px] font-medium">{file}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(idx)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Emoji quick bar (if toggled) */}
              {showEmojiPicker && (
                <div className="mb-2 flex items-center gap-1 rounded-lg border border-border bg-background p-1.5 shadow-md">
                  {quickEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        setComposerText((prev) => prev + emoji);
                        setShowEmojiPicker(false);
                        textareaRef.current?.focus();
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded hover:bg-muted text-sm transition-transform hover:scale-110"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {/* Composer Input Box */}
              <form onSubmit={handleSendMessage} className="relative flex flex-col gap-2">
                <Textarea
                  ref={textareaRef}
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={
                    isInternalNoteMode
                      ? 'Write a private note for your team (will not be visible to contact)...'
                      : `Type your message to ${activeConversation.leadName}... (Enter to send, Shift+Enter for new line)`
                  }
                  className={cn(
                    'min-h-[72px] resize-none text-xs transition-colors',
                    isInternalNoteMode
                      ? 'border-amber-300 bg-amber-500/5 focus-visible:ring-amber-400 dark:border-amber-700'
                      : 'bg-background'
                  )}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      multiple
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      title="Attach file"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      title="Insert emoji"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    disabled={!composerText.trim() && attachedFiles.length === 0}
                    className={cn(
                      'h-8 px-4 text-xs font-semibold gap-1.5 shadow-xs transition-colors',
                      isInternalNoteMode
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    )}
                  >
                    <span>{isInternalNoteMode ? 'Save Note' : 'Send'}</span>
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <h3 className="text-base font-semibold text-foreground">Select a conversation</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm">
              Choose an active dialogue from the inbox list on the left to start communicating or collaborate with your AI agent.
            </p>
          </div>
        )}
      </div>

      {/* =========================================================================
          RIGHT PANEL: Contact Details (~280px, collapsible)
          ========================================================================= */}
      {isRightPanelOpen && activeConversation && (
        <div className="flex w-72 shrink-0 flex-col border-l border-border bg-card/60 overflow-y-auto">
          {/* Header */}
          <div className="p-4 border-b border-border/80 text-center">
            <Avatar className="mx-auto h-16 w-16 text-base shadow-sm ring-2 ring-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {activeConversation.leadAvatar}
              </AvatarFallback>
            </Avatar>
            <h3 className="mt-2 text-sm font-semibold text-foreground">
              {activeConversation.leadName}
            </h3>
            <p className="text-xs text-muted-foreground">{activeConversation.leadCompany}</p>

            <div className="mt-3 flex items-center justify-center gap-1.5">
              <Badge variant="outline" className="text-3xs font-medium">
                Stage: {activeConversation.leadStage}
              </Badge>
              <Badge
                variant="secondary"
                className="text-3xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              >
                Score: {activeConversation.leadScore} / 100
              </Badge>
            </div>
          </div>

          {/* AI Autonomy & Human Takeover Control */}
          <div className="p-4 border-b border-border/80 bg-muted/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-primary" />
                AI Automation
              </span>
              <span
                className={cn(
                  'text-3xs font-medium px-1.5 py-0.5 rounded-full',
                  activeConversation.isAiHandling
                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {activeConversation.isAiHandling ? 'AI Driving' : 'Human Only'}
              </span>
            </div>

            <p className="text-2xs text-muted-foreground mb-3">
              {activeConversation.isAiHandling
                ? 'AI is actively triaging incoming queries and preparing real-time suggestions.'
                : 'AI response engine is paused. All messages must be sent manually by your team.'}
            </p>

            <Button
              variant={activeConversation.isAiHandling ? 'default' : 'outline'}
              size="sm"
              onClick={handleToggleTakeOver}
              className={cn(
                'w-full text-xs font-semibold h-8 gap-1.5 shadow-2xs',
                activeConversation.isAiHandling
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                  : 'border-primary/50 text-primary hover:bg-primary/10'
              )}
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>
                {activeConversation.isAiHandling ? 'Take Over Conversation' : 'Enable AI Copilot'}
              </span>
            </Button>
          </div>

          {/* Contact Details & Info */}
          <div className="p-4 border-b border-border/80 space-y-3">
            <h4 className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
              Contact Channels
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Email
                </span>
                <span className="truncate max-w-[140px] font-medium text-foreground">
                  {activeConversation.leadEmail}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> Phone
                </span>
                <span className="font-medium text-foreground">
                  {activeConversation.leadPhone}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> Last Active
                </span>
                <span className="font-medium text-foreground">
                  {activeConversation.lastActive}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <UserIcon className="h-3.5 w-3.5" /> Assigned Rep
                </span>
                <span className="font-medium text-foreground">
                  {activeConversation.assignedToName}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="p-4 border-b border-border/80 space-y-2">
            <h4 className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {activeConversation.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-background text-3xs font-normal text-muted-foreground border-border/80"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="p-4 space-y-2">
            <h4 className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
              Quick Actions
            </h4>

            <div className="flex flex-col gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast({
                    title: 'Opening Lead Profile',
                    description: `Navigating to ${activeConversation.leadName}...`,
                  });
                  navigate('/leads');
                }}
                className="justify-between text-xs h-8 text-foreground"
              >
                <span>View Lead Profile</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast({
                    title: 'Opening Pipeline Opportunities',
                    description: `Viewing deals for ${activeConversation.leadCompany}...`,
                  });
                  navigate('/pipeline');
                }}
                className="justify-between text-xs h-8 text-foreground"
              >
                <span>View Opportunities</span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
