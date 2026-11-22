import React, { Suspense } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  NavLink,
  useLocation,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from '@/components/theme-provider';
import { ToastProvider } from '@/components/toast-provider';
import { useToast } from '@/hooks/use-toast';
import { APP_NAME, NAVIGATION_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
  Sun,
  Moon,
  Laptop,
  Bell,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Header Theme Toggle Component
 */
function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center rounded-lg border border-border bg-card p-0.5 text-muted-foreground shadow-sm">
      <button
        type="button"
        onClick={() => setTheme('light')}
        aria-label="Light mode"
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:text-foreground',
          theme === 'light' && 'bg-muted text-foreground shadow-xs'
        )}
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        aria-label="Dark mode"
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:text-foreground',
          theme === 'dark' && 'bg-muted text-foreground shadow-xs'
        )}
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => setTheme('system')}
        aria-label="System theme"
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:text-foreground',
          theme === 'system' && 'bg-muted text-foreground shadow-xs'
        )}
      >
        <Laptop className="h-4 w-4" />
      </button>
    </div>
  );
}

/**
 * Shell Layout for the Application
 */
function AppLayout() {
  const location = useLocation();
  const { toast } = useToast();

  const activeItem = NAVIGATION_ITEMS.find((item) =>
    location.pathname.startsWith(item.href)
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased">
      {/* Sidebar Navigation */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
        {/* Workspace Brand Header */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold tracking-tight text-sm text-foreground">
              {APP_NAME}
            </span>
            <span className="text-2xs text-muted-foreground uppercase tracking-wider font-medium">
              Enterprise Revenue OS
            </span>
          </div>
        </div>

        {/* Navigation Items Grouped */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {(['Core', 'Growth', 'Intelligence', 'Settings'] as const).map((group) => {
            const groupItems = NAVIGATION_ITEMS.filter((item) => item.group === group);
            if (groupItems.length === 0) return null;

            return (
              <div key={group} className="space-y-1">
                <div className="px-3 text-2xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {group}
                </div>
                {groupItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          'group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs'
                            : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground'
                        )
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-105" />
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-2xs font-semibold text-primary">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* User Workspace Profile Card */}
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-card p-2 shadow-xs">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
              SK
            </div>
            <div className="flex flex-1 flex-col overflow-hidden text-left">
              <span className="truncate text-xs font-semibold text-foreground">
                Skarworld Admin
              </span>
              <span className="truncate text-2xs text-muted-foreground">
                admin@skarworld.ai
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Workspace</span>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-foreground">
              {activeItem?.title || 'Overview'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                toast({
                  title: 'System Notification',
                  description: 'All AI agent background pipelines are running nominal.',
                })
              }
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
            </button>

            <ThemeToggle />
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/**
 * Standard View Component for routes
 */
function SectionPlaceholder({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const { toast } = useToast();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <button
          type="button"
          onClick={() =>
            toast({
              title: `${title} Action Initiated`,
              description: 'Operational event triggered successfully.',
            })
          }
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-ring"
        >
          <Sparkles className="h-4 w-4" />
          <span>New Action</span>
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 shadow-xs">
        <div className="flex flex-col items-center justify-center text-center py-12">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
            <Icon className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">{title} Active Node</h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {description}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                toast({
                  title: 'Diagnostic Test',
                  description: 'All system checks verified.',
                  variant: 'success',
                })
              }
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted shadow-2xs"
            >
              Run Diagnostic
            </button>
            <a
              href="#documentation"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <span>Documentation</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const LoginPage = React.lazy(() => import('@/pages/auth/login'));
const RegisterPage = React.lazy(() => import('@/pages/auth/register'));
const ForgotPasswordPage = React.lazy(() => import('@/pages/auth/forgot-password'));
const ResetPasswordPage = React.lazy(() => import('@/pages/auth/reset-password'));
const DashboardPage = React.lazy(() => import('@/pages/dashboard'));
const ConversationsPage = React.lazy(() => import('@/pages/conversations'));
const PipelinePage = React.lazy(() => import('@/pages/pipeline'));
const CampaignsPage = React.lazy(() => import('@/pages/campaigns'));
const CampaignDetailPage = React.lazy(() => import('@/pages/campaigns/campaign-detail'));
const TasksPage = React.lazy(() => import('@/pages/tasks'));
const ApprovalsPage = React.lazy(() => import('@/pages/approvals'));
const ProductsPage = React.lazy(() => import('@/pages/products'));
const AIConfigPage = React.lazy(() => import('@/pages/ai-config'));
const IntegrationsPage = React.lazy(() => import('@/pages/integrations'));
const ResearchPage = React.lazy(() => import('@/pages/research'));
const AnalyticsPage = React.lazy(() => import('@/pages/analytics'));
const SettingsPage = React.lazy(() => import('@/pages/settings'));

/**
 * Root App Component
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="skarworld-theme">
        <ToastProvider>
          <BrowserRouter>
            <Suspense
              fallback={
                <div className="flex h-screen items-center justify-center bg-background">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              }
            >
              <Routes>
                {/* Public Authentication Pages */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Workspace Application */}
                <Route element={<AppLayout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="conversations" element={<ConversationsPage />} />
                  <Route path="pipeline" element={<PipelinePage />} />
                  <Route path="campaigns" element={<CampaignsPage />} />
                  <Route path="campaigns/:id" element={<CampaignDetailPage />} />
                  <Route path="tasks" element={<TasksPage />} />
                  <Route path="approvals" element={<ApprovalsPage />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="ai-config" element={<AIConfigPage />} />
                  <Route path="integrations" element={<IntegrationsPage />} />
                  <Route path="research" element={<ResearchPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  {NAVIGATION_ITEMS.filter(
                    (item) =>
                      ![
                        '/dashboard',
                        '/conversations',
                        '/pipeline',
                        '/campaigns',
                        '/tasks',
                        '/approvals',
                        '/products',
                        '/ai-config',
                        '/integrations',
                        '/research',
                        '/analytics',
                        '/settings',
                      ].includes(item.href)
                  ).map((item) => (
                    <Route
                      key={item.href}
                      path={item.href.replace(/^\//, '')}
                      element={
                        <SectionPlaceholder
                          title={item.title}
                          description={`Manage and configure ${item.title.toLowerCase()} in SKARWORLD REVENUE OS.`}
                          icon={item.icon}
                        />
                      }
                    />
                  ))}
                  {/* Catch-all route */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
export { App };
