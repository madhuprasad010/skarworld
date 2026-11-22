import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Bell,
  Sun,
  Moon,
  Laptop,
  UserCheck,
  Target,
  Megaphone,
  CheckSquare,
  LogOut,
  User,
  Settings,
  HelpCircle,
  Menu,
  ChevronDown,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useUIStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
import { MOCK_NOTIFICATIONS } from '@/mock/notifications';

export function Header() {
  const navigate = useNavigate();
  const {
    toggleMobileSidebar,
    setCommandPaletteOpen,
    toggleNotifications,
    theme,
    setTheme,
  } = useUIStore();
  const { user, tenant, logout } = useAuthStore();

  const unreadNotificationsCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
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
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur-md transition-colors sm:px-6">
      {/* Left side: Mobile menu & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleMobileSidebar}
          className="lg:hidden text-muted-foreground hover:text-foreground shrink-0"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="hidden sm:block min-w-0">
          <Breadcrumbs />
        </div>
      </div>

      {/* Right side: Global search, Quick Create, Notifications, Theme, User Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Global Search / Command Palette trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="group flex h-9 w-44 md:w-60 items-center justify-between rounded-lg border border-input bg-card/60 px-3 py-1.5 text-xs text-muted-foreground shadow-xs transition-all hover:border-primary/50 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          title="Search anything (Cmd+K)"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="truncate">Search or jump to...</span>
          </div>
          <kbd className="pointer-events-none hidden md:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        {/* Quick Create (+ New) Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className="h-9 gap-1.5 px-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">New</span>
              <ChevronDown className="h-3 w-3 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 shadow-lg">
            <DropdownMenuLabel className="text-2xs uppercase tracking-wider text-muted-foreground">
              Create New
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigate('/leads?action=new')}
              className="cursor-pointer gap-2"
            >
              <UserCheck className="h-4 w-4 text-primary" />
              <span>Lead</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate('/pipeline?action=new-opportunity')}
              className="cursor-pointer gap-2"
            >
              <Target className="h-4 w-4 text-emerald-500" />
              <span>Opportunity</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate('/campaigns?action=new-campaign')}
              className="cursor-pointer gap-2"
            >
              <Megaphone className="h-4 w-4 text-amber-500" />
              <span>Outbound Campaign</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate('/tasks?action=new-task')}
              className="cursor-pointer gap-2"
            >
              <CheckSquare className="h-4 w-4 text-blue-500" />
              <span>Task</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications Bell */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleNotifications}
              className="relative h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg"
              aria-label="Open notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Notifications ({unreadNotificationsCount} unread)</TooltipContent>
        </Tooltip>

        {/* Theme Toggle Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={cycleTheme}
              className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg"
              aria-label={`Toggle theme (current: ${theme})`}
            >
              {theme === 'dark' ? (
                <Moon className="h-4 w-4 text-indigo-400" />
              ) : theme === 'light' ? (
                <Sun className="h-4 w-4 text-amber-500" />
              ) : (
                <Laptop className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)} (Click to switch)
          </TooltipContent>
        </Tooltip>

        {/* User Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 rounded-full ring-offset-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ml-1"
              aria-label="User profile menu"
            >
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src={user?.avatarUrl} alt={user?.name || 'User avatar'} />
                <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 shadow-lg">
            <DropdownMenuLabel className="font-normal p-2">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold leading-none text-foreground">
                    {user?.name || 'Alex Rivera'}
                  </p>
                  <Badge variant="indigo" size="sm">
                    {user?.role?.replace('_', ' ') || 'Manager'}
                  </Badge>
                </div>
                <p className="text-2xs leading-none text-muted-foreground truncate">
                  {user?.email || 'demo@skarworld.com'}
                </p>
                <div className="pt-1">
                  <span className="text-[10px] text-muted-foreground/80 font-mono">
                    {tenant?.name || 'SKARWORLD Global'}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => navigate('/settings/profile')}
                className="cursor-pointer gap-2"
              >
                <User className="h-4 w-4 text-muted-foreground" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate('/settings')}
                className="cursor-pointer gap-2"
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span>Workspace Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => window.open('https://docs.skarworld.com', '_blank')}
                className="cursor-pointer gap-2"
              >
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                <span>Documentation & API</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

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
    </header>
  );
}
