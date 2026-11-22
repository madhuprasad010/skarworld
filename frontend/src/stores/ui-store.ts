import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppTheme = 'light' | 'dark' | 'system';

export interface UIState {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  theme: AppTheme;
  commandPaletteOpen: boolean;
  notificationsPanelOpen: boolean;

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setTheme: (theme: AppTheme) => void;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleNotifications: () => void;
  setNotificationsOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      mobileSidebarOpen: false,
      theme: 'dark', // Linear/Stripe dark style default for AI SaaS
      commandPaletteOpen: false,
      notificationsPanelOpen: false,

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (collapsed: boolean) =>
        set({ sidebarCollapsed: collapsed }),

      toggleMobileSidebar: () =>
        set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),

      setMobileSidebarOpen: (open: boolean) =>
        set({ mobileSidebarOpen: open }),

      setTheme: (theme: AppTheme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (theme === 'light') {
          document.documentElement.classList.remove('dark');
        } else {
          const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (systemDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },

      toggleCommandPalette: () =>
        set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),

      setCommandPaletteOpen: (open: boolean) =>
        set({ commandPaletteOpen: open }),

      toggleNotifications: () =>
        set((state) => ({ notificationsPanelOpen: !state.notificationsPanelOpen })),

      setNotificationsOpen: (open: boolean) =>
        set({ notificationsPanelOpen: open }),
    }),
    {
      name: 'skarworld-ui-storage',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
);
