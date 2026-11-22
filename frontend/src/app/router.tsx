import * as React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import { AppShell } from '@/components/layout/app-shell';

// Auth Pages (supporting both default and named imports)
import LoginPage from '@/pages/auth/login';
import RegisterPage from '@/pages/auth/register';
import ForgotPasswordPage from '@/pages/auth/forgot-password';
import ResetPasswordPage from '@/pages/auth/reset-password';

// Main Application Pages
import DashboardPage from '@/pages/dashboard/index';
import LeadsPage from '@/pages/leads/index';
import { LeadDetailPage } from '@/pages/leads/lead-detail';
import ConversationsPage from '@/pages/conversations/index';
import SalesPipelinePage from '@/pages/pipeline/index';
import CampaignsPage from '@/pages/campaigns/index';
import CampaignDetailPage from '@/pages/campaigns/campaign-detail';
import { TasksPage } from '@/pages/tasks/index';
import { ApprovalsPage } from '@/pages/approvals/index';
import ProductsPage from '@/pages/products/index';
import AIConfigPage from '@/pages/ai-config/index';
import IntegrationsPage from '@/pages/integrations/index';
import ResearchPage from '@/pages/research/index';
import AnalyticsPage from '@/pages/analytics/index';
import { SettingsPage } from '@/pages/settings/index';
import { NotFoundPage } from '@/pages/not-found';

/**
 * AuthGuard component that redirects unauthenticated users to /login,
 * preserving their intended destination in router state.
 */
export function AuthGuard() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-xs text-muted-foreground font-medium">
            Authenticating session...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export const router = createBrowserRouter([
  // Public Authentication Routes
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },

  // Protected Enterprise Workspace Routes
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            path: '/',
            element: <DashboardPage />,
          },
          {
            path: '/dashboard',
            element: <Navigate to="/" replace />,
          },
          {
            path: '/leads',
            element: <LeadsPage />,
          },
          {
            path: '/leads/:id',
            element: <LeadDetailPage />,
          },
          {
            path: '/conversations',
            element: <ConversationsPage />,
          },
          {
            path: '/pipeline',
            element: <SalesPipelinePage />,
          },
          {
            path: '/campaigns',
            element: <CampaignsPage />,
          },
          {
            path: '/campaigns/:id',
            element: <CampaignDetailPage />,
          },
          {
            path: '/tasks',
            element: <TasksPage />,
          },
          {
            path: '/approvals',
            element: <ApprovalsPage />,
          },
          {
            path: '/products',
            element: <ProductsPage />,
          },
          {
            path: '/ai-config',
            element: <AIConfigPage />,
          },
          {
            path: '/integrations',
            element: <IntegrationsPage />,
          },
          {
            path: '/research',
            element: <ResearchPage />,
          },
          {
            path: '/analytics',
            element: <AnalyticsPage />,
          },
          {
            path: '/settings',
            element: <SettingsPage />,
          },
          {
            path: '/settings/:tab',
            element: <SettingsPage />,
          },
          {
            path: '*',
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
