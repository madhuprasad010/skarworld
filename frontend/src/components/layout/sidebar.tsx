import * as React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GitPullRequest,
  Megaphone,
  CheckSquare,
  ShieldCheck,
  MessageSquareText,
  Compass,
  LineChart,
  Cpu,
  Package,
  PlugZap,
  Settings,
  ChevronsUpDown,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Building2,
  Check,
  Plus,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NavItemDef {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeVariant?: 'default' | 'secondary' | 'warning' | 'indigo';
  exact?: boolean;
}

interface NavGroupDef {
  group: string;
  items: NavItemDef[];
}

const NAVIGATION_GROUPS: NavGroupDef[] = [
  {
    group: 'Main',
    items: [
      {
        title: 'Dashboard',
        href: '/',
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    group: 'Sales',
    items: [
      {
        title: 'Leads',
        href: '/leads',
        icon: Users,
        badge: '18',
        badgeVariant: 'indigo',
      },
      {
        title: 'Pipeline',
        href: '/pipeline',
        icon: GitPullRequest,
      },
      {
        title: 'Campaigns',
        href: '/campaigns',
        icon: Megaphone,
      },
      {
        title: 'Tasks',
        href: '/tasks',
        icon: CheckSquare,
        badge: '4',
        badgeVariant: 'secondary',
      },
      {
        title: 'Approvals',
        href: '/approvals',
        icon: ShieldCheck,
        badge: '2',
        badgeVariant: 'warning',
      },
    ],
  },
  {
    group: 'Communication',
    items: [
      {
        title: 'Conversations',
        href: '/conversations',
        icon: MessageSquareText,
        badge: '3',
        badgeVariant: 'indigo',
      },
    ],
  },
  {
    group: 'Intelligence',
    items: [
      {
        title: 'Research',
        href: '/research',
        icon: Compass,
      },
      {
        title: 'Analytics',
        href: '/analytics',
        icon: LineChart,
      },
      {
        title: 'AI Config',
        href: '/ai-config',
        icon: Cpu,
      },
    ],
  },
  {
    group: 'Configuration',
    items: [
      {
        title: 'Products',
        href: '/products',
        icon: Package,
      },
      {
        title: 'Integrations',
        href: '/integrations',
        icon: PlugZap,
      },
      {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
      },
    ],
  },
];

const WORKSPACES = [
  { id: 'ten_skarworld_001', name: 'SKARWORLD Global', plan: 'Enterprise', code: 'SW' },
  { id: 'ten_na_002', name: 'North America Growth', plan: 'Scale', code: 'NA' },
  { id: 'ten_emea_003', name: 'EMEA Division', plan: 'Professional', code: 'EM' },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { user, tenant, setTenant, logout } = useAuthStore();
  const [currentWorkspace, setCurrentWorkspace] = React.useState(WORKSPACES[0]);

  const isActive = (item: NavItemDef) => {
    if (item.exact) {
      return location.pathname === item.href;
    }
    return location.pathname.startsWith(item.href);
  };

  const handleSelectWorkspace = (ws: (typeof WORKSPACES)[0]) => {
    setCurrentWorkspace(ws);
    setTenant({
      id: ws.id,
      name: ws.name,
      slug: ws.name.toLowerCase().replace(/\s+/g, '-'),
      plan: 'enterprise',
      domain: 'skarworld.com',
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'SW';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out shrink-0 select-none z-20',
        sidebarCollapsed ? 'w-18' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-3.5">
        <Link
          to="/"
          className={cn(
            'flex items-center gap-2.5 overflow-hidden transition-all',
            sidebarCollapsed ? 'justify-center w-full' : ''
          )}
          title="SKARWORLD REVENUE OS"
        >
          {/* Logo Mark */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-indigo-600 to-primary text-white shadow-md shadow-indigo-500/25 ring-1 ring-white/20">
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>

          {!sidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm tracking-tight text-foreground flex items-center gap-1.5 truncate">
                SKARWORLD
                <span className="rounded bg-primary/10 px-1 py-0.2 text-[9px] font-semibold tracking-wide text-primary">
                  AI OS
                </span>
              </span>
              <span className="text-[10px] text-muted-foreground/80 font-medium tracking-wider uppercase truncate">
                Revenue Automation
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Workspace Switcher */}
      <div className="p-2 border-b border-sidebar-border/60">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'group flex w-full items-center gap-2 rounded-lg border border-sidebar-border/70 bg-sidebar-accent/50 p-2 text-left text-xs transition-colors hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
                sidebarCollapsed ? 'justify-center p-2' : ''
              )}
              title={sidebarCollapsed ? currentWorkspace.name : undefined}
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/20 text-primary font-bold text-2xs">
                {currentWorkspace.code}
              </div>

              {!sidebarCollapsed && (
                <>
                  <div className="flex-1 truncate">
                    <div className="font-semibold text-foreground truncate">
                      {currentWorkspace.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {currentWorkspace.plan} Plan
                    </div>
                  </div>
                  <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-60 group-hover:opacity-100" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={sidebarCollapsed ? 'right' : 'bottom'}
            align={sidebarCollapsed ? 'start' : 'center'}
            className="w-56 shadow-lg"
          >
            <DropdownMenuLabel className="text-2xs uppercase tracking-wider text-muted-foreground">
              Workspaces
            </DropdownMenuLabel>
            {WORKSPACES.map((ws) => (
              <DropdownMenuItem
                key={ws.id}
                onClick={() => handleSelectWorkspace(ws)}
                className="cursor-pointer justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/15 text-primary text-[10px] font-bold">
                    {ws.code}
                  </div>
                  <div>
                    <div className="text-xs font-medium">{ws.name}</div>
                    <div className="text-[10px] text-muted-foreground">{ws.plan}</div>
                  </div>
                </div>
                {currentWorkspace.id === ws.id && (
                  <Check className="h-4 w-4 text-primary shrink-0" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate('/settings')}
              className="cursor-pointer gap-2 text-primary"
            >
              <Plus className="h-4 w-4" />
              <span>Create Workspace</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation Links */}
      <ScrollArea className="flex-1 px-2 py-2">
        <nav className="space-y-4">
          {NAVIGATION_GROUPS.map((group, groupIdx) => (
            <div key={group.group} className="space-y-1">
              {!sidebarCollapsed ? (
                <div className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
                  {group.group}
                </div>
              ) : groupIdx > 0 ? (
                <div className="my-2 border-t border-sidebar-border/60 mx-2" />
              ) : null}

              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item);
                  const Icon = item.icon;

                  if (sidebarCollapsed) {
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger asChild>
                          <Link
                            to={item.href}
                            className={cn(
                              'relative flex h-10 w-full items-center justify-center rounded-lg transition-all duration-150',
                              active
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                            )}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            {item.badge && (
                              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-sidebar" />
                            )}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="flex items-center gap-2">
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge variant={item.badgeVariant || 'default'} size="sm">
                              {item.badge}
                            </Badge>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        'group relative flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-all duration-150',
                        active
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                      )}
                    >
                      {/* Active indicator bar */}
                      {active && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-primary" />
                      )}

                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={cn(
                            'h-4 w-4 shrink-0 transition-colors',
                            active
                              ? 'text-primary'
                              : 'text-muted-foreground group-hover:text-sidebar-foreground'
                          )}
                        />
                        <span className="truncate">{item.title}</span>
                      </div>

                      {item.badge && (
                        <Badge
                          variant={item.badgeVariant || 'secondary'}
                          size="sm"
                          className="ml-auto"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Collapse / Expand Toggle Button */}
      <div className="px-2 py-1.5 border-t border-sidebar-border/60">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className={cn(
            'w-full text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent justify-center gap-2 h-8 rounded-lg',
            !sidebarCollapsed ? 'justify-start px-2.5' : ''
          )}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4 shrink-0" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4 shrink-0" />
              <span className="text-xs">Collapse sidebar</span>
            </>
          )}
        </Button>
      </div>

      {/* User Profile Footer */}
      <div className="p-2 border-t border-sidebar-border bg-sidebar-accent/20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'group flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
                sidebarCollapsed ? 'justify-center p-1' : ''
              )}
              title={sidebarCollapsed ? `${user?.name || 'Alex Rivera'} (${user?.role})` : undefined}
            >
              <div className="relative">
                <Avatar className="h-8 w-8 border border-sidebar-border">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name || 'User'} />
                  <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-sidebar" />
              </div>

              {!sidebarCollapsed && (
                <>
                  <div className="flex-1 truncate">
                    <div className="text-xs font-semibold text-foreground truncate">
                      {user?.name || 'Alex Rivera'}
                    </div>
                    <div className="text-[10px] text-muted-foreground capitalize truncate">
                      {user?.role?.replace('_', ' ') || 'Sales Manager'}
                    </div>
                  </div>
                  <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-60 group-hover:opacity-100" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side={sidebarCollapsed ? 'right' : 'top'}
            align={sidebarCollapsed ? 'end' : 'start'}
            className="w-56 shadow-xl"
          >
            <DropdownMenuLabel className="font-normal p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-semibold text-foreground leading-none">
                  {user?.name || 'Alex Rivera'}
                </p>
                <p className="text-2xs text-muted-foreground leading-none truncate">
                  {user?.email || 'demo@skarworld.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate('/settings/profile')}
              className="cursor-pointer gap-2"
            >
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate('/settings')}
              className="cursor-pointer gap-2"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span>Workspace Admin</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
