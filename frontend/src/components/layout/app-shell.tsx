import * as React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { CommandPalette } from '@/components/shared/command-palette';
import { NotificationsPanel } from '@/components/shared/notifications-panel';
import { useUIStore } from '@/stores/ui-store';
import { Button } from '@/components/ui/button';

export function AppShell() {
  const location = useLocation();
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();

  // Close mobile sidebar whenever user navigates
  React.useEffect(() => {
    if (mobileSidebarOpen) {
      setMobileSidebarOpen(false);
    }
  }, [location.pathname, setMobileSidebarOpen]);

  // Handle escape key for mobile sidebar
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileSidebarOpen, setMobileSidebarOpen]);

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background text-foreground antialiased">
      {/* Desktop Sidebar (hidden on screens < 1024px) */}
      <div className="hidden lg:flex h-full shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay & Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Sliding drawer */}
          <div className="fixed inset-y-0 left-0 flex max-w-xs w-full shadow-2xl animate-in slide-in-from-left duration-250 ease-out z-50">
            <div className="relative flex-1 flex flex-col bg-sidebar">
              <div className="absolute right-2 top-2 z-30">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="rounded-full text-muted-foreground hover:text-foreground"
                  aria-label="Close mobile navigation"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Sidebar />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto bg-background focus:outline-none">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Modals & Slide-outs */}
      <CommandPalette />
      <NotificationsPanel />
    </div>
  );
}
