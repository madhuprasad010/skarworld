import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GitPullRequest,
  Megaphone,
  MessageSquareText,
  CheckSquare,
  ShieldCheck,
  Package,
  Cpu,
  PlugZap,
  Compass,
  LineChart,
  Settings,
  PlusCircle,
  Sun,
  Moon,
  Laptop,
  LogOut,
  Building2,
  UserPlus,
  Target,
  Sparkles,
} from 'lucide-react';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { useUIStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';

export function CommandPalette() {
  const navigate = useNavigate();
  const { commandPaletteOpen, setCommandPaletteOpen, theme, setTheme } =
    useUIStore();
  const { logout } = useAuthStore();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const runCommand = React.useCallback(
    (command: () => void) => {
      setCommandPaletteOpen(false);
      command();
    },
    [setCommandPaletteOpen]
  );

  return (
    <CommandDialog
      open={commandPaletteOpen}
      onOpenChange={setCommandPaletteOpen}
    >
      <CommandInput placeholder="Type a command, lead, deal or search..." />
      <CommandList>
        <CommandEmpty>No matching results found.</CommandEmpty>

        <CommandGroup heading="Quick Actions">
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                navigate('/leads?action=new');
              })
            }
          >
            <UserPlus className="mr-2 h-4 w-4 text-primary" />
            <span>Create New Lead</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() =>
              runCommand(() => {
                navigate('/pipeline?action=new-opportunity');
              })
            }
          >
            <Target className="mr-2 h-4 w-4 text-emerald-500" />
            <span>Create Opportunity</span>
            <CommandShortcut>⌘O</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() =>
              runCommand(() => {
                navigate('/campaigns?action=new-campaign');
              })
            }
          >
            <Megaphone className="mr-2 h-4 w-4 text-amber-500" />
            <span>Launch Outbound Campaign</span>
          </CommandItem>

          <CommandItem
            onSelect={() =>
              runCommand(() => {
                navigate('/tasks?action=new-task');
              })
            }
          >
            <CheckSquare className="mr-2 h-4 w-4 text-blue-500" />
            <span>Add Sales Task</span>
          </CommandItem>

          <CommandItem
            onSelect={() =>
              runCommand(() => {
                navigate('/research?action=instant');
              })
            }
          >
            <Sparkles className="mr-2 h-4 w-4 text-indigo-400" />
            <span>Run Instant AI Company Research</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Recent Records">
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                navigate('/pipeline');
              })
            }
          >
            <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="font-medium">CloudScale Inc. — Enterprise Expansion</span>
              <span className="text-2xs text-muted-foreground">$148,000 · Proposal Stage</span>
            </div>
          </CommandItem>

          <CommandItem
            onSelect={() =>
              runCommand(() => {
                navigate('/leads/lead_01');
              })
            }
          >
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="font-medium">Sarah Jenkins · VP Technology at TechNova</span>
              <span className="text-2xs text-muted-foreground">Score 92 · Highly Qualified Inbound</span>
            </div>
          </CommandItem>

          <CommandItem
            onSelect={() =>
              runCommand(() => {
                navigate('/campaigns/cmp_01');
              })
            }
          >
            <Megaphone className="mr-2 h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="font-medium">Enterprise AI FinTech Outreach Q4</span>
              <span className="text-2xs text-muted-foreground">Active · 42 Meetings Booked</span>
            </div>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => navigate('/'))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/leads'))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Leads</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/pipeline'))}>
            <GitPullRequest className="mr-2 h-4 w-4" />
            <span>Pipeline</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/campaigns'))}>
            <Megaphone className="mr-2 h-4 w-4" />
            <span>Campaigns</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate('/conversations'))}
          >
            <MessageSquareText className="mr-2 h-4 w-4" />
            <span>Conversations</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/tasks'))}>
            <CheckSquare className="mr-2 h-4 w-4" />
            <span>Tasks</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/approvals'))}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            <span>Approvals</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/products'))}>
            <Package className="mr-2 h-4 w-4" />
            <span>Products & Pricing</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/ai-config'))}>
            <Cpu className="mr-2 h-4 w-4" />
            <span>AI Config & Prompts</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate('/integrations'))}
          >
            <PlugZap className="mr-2 h-4 w-4" />
            <span>Integrations</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/research'))}>
            <Compass className="mr-2 h-4 w-4" />
            <span>Company Intelligence</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/analytics'))}>
            <LineChart className="mr-2 h-4 w-4" />
            <span>Revenue Analytics</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/settings'))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="System & Preferences">
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                setTheme(theme === 'dark' ? 'light' : 'dark');
              })
            }
          >
            {theme === 'dark' ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
          </CommandItem>

          <CommandItem
            onSelect={() =>
              runCommand(() => {
                setTheme('system');
              })
            }
          >
            <Laptop className="mr-2 h-4 w-4" />
            <span>Use System Theme Preference</span>
          </CommandItem>

          <CommandItem
            onSelect={() =>
              runCommand(() => {
                logout();
                navigate('/login');
              })
            }
          >
            <LogOut className="mr-2 h-4 w-4 text-destructive" />
            <span className="text-destructive">Log Out of SKARWORLD</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
