import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Tenant } from '@/types';

export interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setTenant: (tenant: Tenant) => void;
}

const DEFAULT_DEMO_USER: User = {
  id: 'usr_skar_001',
  name: 'Alex Rivera',
  email: 'demo@skarworld.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&h=256&fit=crop&crop=faces',
  role: 'sales_manager',
  tenantId: 'ten_skarworld_001',
  department: 'Revenue Operations',
  title: 'Head of Growth',
  createdAt: new Date().toISOString(),
};

const DEFAULT_DEMO_TENANT: Tenant = {
  id: 'ten_skarworld_001',
  name: 'SKARWORLD Global',
  slug: 'skarworld-global',
  plan: 'enterprise',
  createdAt: new Date().toISOString(),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: DEFAULT_DEMO_USER,
      tenant: DEFAULT_DEMO_TENANT,
      isAuthenticated: true,
      isLoading: false,

      login: async (email: string, _password: string) => {
        set({ isLoading: true });
        // Simulate network latency for realistic SaaS feel
        await new Promise((resolve) => setTimeout(resolve, 600));

        // Accept demo credentials or any provided valid email for seamless demoing
        const namePart = email.split('@')[0] || 'Alex Rivera';
        const formattedName = namePart
          .replace(/[._]/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase());

        const loggedInUser: User = {
          id: 'usr_session_' + Date.now().toString(36),
          name: email === 'demo@skarworld.com' ? 'Alex Rivera' : formattedName,
          email,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&h=256&fit=crop&crop=faces',
          role: 'sales_manager',
          tenantId: 'ten_skarworld_001',
          department: 'Revenue Operations',
          title: 'Revenue Lead',
          createdAt: new Date().toISOString(),
        };

        set({
          user: loggedInUser,
          tenant: DEFAULT_DEMO_TENANT,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          user: null,
          tenant: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      setTenant: (tenant: Tenant) => {
        set({ tenant });
      },
    }),
    {
      name: 'skarworld-auth-storage',
    }
  )
);
