import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  CheckCheck,
  Bell,
  UserCheck,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Clock,
  Filter,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/ui-store';
import { MOCK_NOTIFICATIONS } from '@/mock/notifications';
import { Notification, NotificationType } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export function NotificationsPanel() {
  const navigate = useNavigate();
  const { notificationsPanelOpen, setNotificationsOpen } = useUIStore();
  const [notifications, setNotifications] = React.useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [selectedFilter, setSelectedFilter] = React.useState<'all' | 'unread' | 'approval' | 'lead'>('all');

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && notificationsPanelOpen) {
        setNotificationsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [notificationsPanelOpen, setNotificationsOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (item: Notification) => {
    markAsRead(item.id);
    if (item.actionUrl) {
      setNotificationsOpen(false);
      navigate(item.actionUrl);
    }
  };

  const filteredNotifications = React.useMemo(() => {
    return notifications.filter((n) => {
      if (selectedFilter === 'unread') return !n.read;
      if (selectedFilter === 'approval') return n.type === 'approval';
      if (selectedFilter === 'lead') return n.type === 'lead';
      return true;
    });
  }, [notifications, selectedFilter]);

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'lead':
        return <UserCheck className="h-4 w-4 text-indigo-500" />;
      case 'approval':
        return <ShieldAlert className="h-4 w-4 text-amber-500" />;
      case 'task':
        return <CheckCircle2 className="h-4 w-4 text-sky-500" />;
      case 'system':
        return <Sparkles className="h-4 w-4 text-emerald-500" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeBg = (type: NotificationType) => {
    switch (type) {
      case 'lead':
        return 'bg-indigo-500/10 border-indigo-500/20';
      case 'approval':
        return 'bg-amber-500/10 border-amber-500/20';
      case 'task':
        return 'bg-sky-500/10 border-sky-500/20';
      case 'system':
        return 'bg-emerald-500/10 border-emerald-500/20';
      default:
        return 'bg-muted border-border';
    }
  };

  if (!notificationsPanelOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setNotificationsOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Notifications panel"
          className="w-screen max-w-md bg-card border-l border-border shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-250 ease-out"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-card/60 backdrop-blur-sm">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Bell className="h-5 w-5 text-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-base text-foreground">
                    Notifications
                  </h2>
                  {unreadCount > 0 && (
                    <Badge variant="indigo" size="sm">
                      {unreadCount} new
                    </Badge>
                  )}
                </div>
                <p className="text-2xs text-muted-foreground">
                  Real-time pipeline & autonomous sales updates
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                  title="Mark all as read"
                >
                  <CheckCheck className="h-3.5 w-3.5 mr-1" />
                  Mark all
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setNotificationsOpen(false)}
                className="rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close notifications</span>
              </Button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="px-5 py-2.5 border-b border-border/80 flex items-center gap-1.5 bg-muted/20">
            <Filter className="h-3.5 w-3.5 text-muted-foreground mr-1" />
            <button
              onClick={() => setSelectedFilter('all')}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                selectedFilter === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setSelectedFilter('unread')}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                selectedFilter === 'unread'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setSelectedFilter('approval')}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                selectedFilter === 'approval'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              Approvals
            </button>
            <button
              onClick={() => setSelectedFilter('lead')}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                selectedFilter === 'lead'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              Leads
            </button>
          </div>

          {/* Notification List */}
          <ScrollArea className="flex-1">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3 text-muted-foreground">
                  <CheckCheck className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  All caught up!
                </h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                  No notifications matching your filter criteria right now.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {filteredNotifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={cn(
                      'p-4 transition-colors hover:bg-accent/40 cursor-pointer relative group flex gap-3.5 items-start',
                      !item.read ? 'bg-primary/[0.03]' : ''
                    )}
                  >
                    {/* Unread blue dot */}
                    {!item.read && (
                      <span className="absolute left-1.5 top-5 h-2 w-2 rounded-full bg-primary" />
                    )}

                    {/* Icon container */}
                    <div
                      className={cn(
                        'h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border mt-0.5',
                        getTypeBg(item.type)
                      )}
                    >
                      {getTypeIcon(item.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4
                          className={cn(
                            'text-xs font-semibold truncate',
                            !item.read ? 'text-foreground' : 'text-foreground/80'
                          )}
                        >
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {formatDistanceToNow(new Date(item.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-1">
                        {item.actor ? (
                          <span className="text-2xs text-muted-foreground font-medium">
                            Via {item.actor.name}
                          </span>
                        ) : (
                          <span className="text-2xs text-muted-foreground capitalize">
                            {item.type} notification
                          </span>
                        )}

                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!item.read && (
                            <button
                              onClick={(e) => markAsRead(item.id, e)}
                              className="text-2xs text-primary hover:underline font-medium"
                            >
                              Mark read
                            </button>
                          )}
                          {item.actionUrl && (
                            <span className="text-2xs text-muted-foreground flex items-center gap-0.5">
                              View <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="p-3 border-t border-border bg-card/60 flex items-center justify-between text-2xs text-muted-foreground">
            <span>SKARWORLD REVENUE OS AI Bus</span>
            <span>WebSocket Live</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
