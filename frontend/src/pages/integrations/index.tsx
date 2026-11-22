import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { IntegrationStatus } from '@/types';
import {
  Plug2,
  MessageSquare,
  Mail,
  Send,
  Globe,
  Brain,
  Search,
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Settings2,
  Eye,
  EyeOff,
  RefreshCw,
  Lock,
  Layers,
  Database,
  Share2,
} from 'lucide-react';

interface IntegrationItem {
  id: string;
  key: string;
  name: string;
  description: string;
  category: 'communication' | 'email' | 'ai' | 'search' | 'payment' | 'crm';
  iconType: 'whatsapp' | 'ses' | 'telegram' | 'webchat' | 'claude' | 'tavily' | 'stripe' | 'hubspot' | 'salesforce';
  status: IntegrationStatus;
  lastSyncAt?: string;
  apiKey?: string;
  webhookUrl?: string;
  endpointUrl?: string;
}

const INITIAL_INTEGRATIONS: IntegrationItem[] = [
  {
    id: 'int-001',
    key: 'whatsapp',
    name: 'WhatsApp Cloud API',
    description: 'Direct conversational messaging connector with automated HSM template approval and multi-agent handover.',
    category: 'communication',
    iconType: 'whatsapp',
    status: 'connected',
    lastSyncAt: '12 minutes ago',
    apiKey: 'waba_live_9812401928410928401928',
    webhookUrl: 'https://api.skarworld.io/v1/webhooks/whatsapp/inbound',
  },
  {
    id: 'int-002',
    key: 'ses',
    name: 'Amazon SES',
    description: 'High-throughput enterprise email infrastructure with automatic bounce processing and dedicated IP deliverability pools.',
    category: 'email',
    iconType: 'ses',
    status: 'connected',
    lastSyncAt: 'Just now',
    apiKey: 'AKIA_PROD_SES_992148102948',
    endpointUrl: 'email.us-east-1.amazonaws.com',
  },
  {
    id: 'int-003',
    key: 'telegram',
    name: 'Telegram Bot Gateway',
    description: 'Instant notification pipeline for executive leads, sales rep alerts, and autonomous customer chat channels.',
    category: 'communication',
    iconType: 'telegram',
    status: 'connected',
    lastSyncAt: '45 minutes ago',
    apiKey: 'bot718291048:AAFn_8910248102-12498',
    webhookUrl: 'https://api.skarworld.io/v1/webhooks/telegram',
  },
  {
    id: 'int-004',
    key: 'webchat',
    name: 'Live Web Chat Widget',
    description: 'Embeddable JavaScript visitor qualification widget that runs on your marketing site and documentation hub.',
    category: 'communication',
    iconType: 'webchat',
    status: 'connected',
    lastSyncAt: '3 minutes ago',
    apiKey: 'skar_live_widget_token_991823',
    endpointUrl: 'https://cdn.skarworld.io/sdk/v1/widget.js',
  },
  {
    id: 'int-005',
    key: 'claude',
    name: 'Anthropic Claude 3.5 Sonnet',
    description: 'Primary high-reasoning LLM engine powering complex B2B objection handling, email drafts, and contract summaries.',
    category: 'ai',
    iconType: 'claude',
    status: 'connected',
    lastSyncAt: '1 minute ago',
    apiKey: 'sk-ant-api03-91824091240-91824',
    endpointUrl: 'https://api.anthropic.com/v1/messages',
  },
  {
    id: 'int-006',
    key: 'tavily',
    name: 'Tavily / Brave Search API',
    description: 'Autonomous web search and real-time prospect intelligence scraper for account research dossiers.',
    category: 'search',
    iconType: 'tavily',
    status: 'connected',
    lastSyncAt: '2 hours ago',
    apiKey: 'tvly-prod-88192301982301',
    endpointUrl: 'https://api.tavily.com/search',
  },
  {
    id: 'int-007',
    key: 'stripe',
    name: 'Stripe Payments & Invoicing',
    description: 'Automated invoice generation, payment links, and contract checkout workflows for closed-won opportunities.',
    category: 'payment',
    iconType: 'stripe',
    status: 'disconnected',
    apiKey: '',
    webhookUrl: 'https://api.skarworld.io/v1/webhooks/stripe',
  },
  {
    id: 'int-008',
    key: 'salesforce',
    name: 'Salesforce Enterprise CRM',
    description: 'Bi-directional synchronization of Leads, Contacts, Opportunities, and AI activity telemetry.',
    category: 'crm',
    iconType: 'salesforce',
    status: 'disconnected',
    apiKey: '',
    endpointUrl: 'https://login.salesforce.com/services/oauth2/token',
  },
  {
    id: 'int-009',
    key: 'hubspot',
    name: 'HubSpot Marketing & CRM',
    description: 'Sync inbound deal pipelines, lifecycle stages, and dynamic contact attribution properties.',
    category: 'crm',
    iconType: 'hubspot',
    status: 'error',
    lastSyncAt: 'Failed 4 hours ago (Token Expired)',
    apiKey: 'pat-na1-89102481-9128',
    webhookUrl: 'https://api.skarworld.io/v1/webhooks/hubspot',
  },
];

export default function IntegrationsPage() {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<IntegrationItem[]>(INITIAL_INTEGRATIONS);

  // Configure Dialog State
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationItem | null>(null);
  const [modalApiKey, setModalApiKey] = useState('');
  const [modalWebhook, setModalWebhook] = useState('');
  const [modalEndpoint, setModalEndpoint] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // Disconnect Confirmation State
  const [disconnectingItem, setDisconnectingItem] = useState<IntegrationItem | null>(null);

  const getStatusBadge = (status: IntegrationStatus) => {
    switch (status) {
      case 'connected':
        return (
          <Badge variant="success" className="gap-1 font-semibold text-2xs">
            <CheckCircle2 className="h-3 w-3" />
            Connected
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive" className="gap-1 font-semibold text-2xs">
            <AlertCircle className="h-3 w-3" />
            Error
          </Badge>
        );
      case 'disconnected':
      default:
        return (
          <Badge variant="secondary" className="gap-1 font-normal text-2xs text-muted-foreground">
            <XCircle className="h-3 w-3" />
            Disconnected
          </Badge>
        );
    }
  };

  const getIntegrationIcon = (iconType: IntegrationItem['iconType']) => {
    switch (iconType) {
      case 'whatsapp':
        return (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <MessageSquare className="h-6 w-6" />
          </div>
        );
      case 'ses':
        return (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Mail className="h-6 w-6" />
          </div>
        );
      case 'telegram':
        return (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Send className="h-6 w-6" />
          </div>
        );
      case 'webchat':
        return (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Globe className="h-6 w-6" />
          </div>
        );
      case 'claude':
        return (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Brain className="h-6 w-6" />
          </div>
        );
      case 'tavily':
        return (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Search className="h-6 w-6" />
          </div>
        );
      case 'stripe':
        return (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
            <CreditCard className="h-6 w-6" />
          </div>
        );
      case 'salesforce':
        return (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <Database className="h-6 w-6" />
          </div>
        );
      case 'hubspot':
      default:
        return (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <Share2 className="h-6 w-6" />
          </div>
        );
    }
  };

  // Open Configure Modal
  const handleOpenConfigure = (item: IntegrationItem) => {
    setSelectedIntegration(item);
    setModalApiKey(item.apiKey || '');
    setModalWebhook(item.webhookUrl || '');
    setModalEndpoint(item.endpointUrl || '');
    setShowApiKey(false);
  };

  // Simulate Connection Test
  const handleTestConnection = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      toast({
        title: 'Diagnostic Handshake Successful',
        description: `Successfully verified API credentials and endpoint ping for ${selectedIntegration?.name}.`,
        variant: 'success',
      });
    }, 1200);
  };

  // Save Configuration
  const handleSaveConfig = () => {
    if (!selectedIntegration) return;

    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === selectedIntegration.id) {
          return {
            ...item,
            status: 'connected',
            apiKey: modalApiKey,
            webhookUrl: modalWebhook || undefined,
            endpointUrl: modalEndpoint || undefined,
            lastSyncAt: 'Just now',
          };
        }
        return item;
      })
    );

    toast({
      title: 'Integration Saved',
      description: `${selectedIntegration.name} configuration updated and active.`,
      variant: 'success',
    });

    setSelectedIntegration(null);
  };

  // Disconnect Handlers
  const handleToggleConnect = (item: IntegrationItem) => {
    if (item.status === 'connected') {
      setDisconnectingItem(item);
    } else {
      // Connect directly
      handleOpenConfigure(item);
    }
  };

  const confirmDisconnect = () => {
    if (!disconnectingItem) return;
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === disconnectingItem.id
          ? { ...item, status: 'disconnected', lastSyncAt: undefined }
          : item
      )
    );
    toast({
      title: 'Integration Disconnected',
      description: `${disconnectingItem.name} has been disconnected.`,
    });
    setDisconnectingItem(null);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Integrations"
        description="Connect omni-channel messaging, LLM inference endpoints, prospect search engines, and enterprise CRMs."
        icon={Plug2}
      />

      {/* Grid of integration cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrations.map((item) => {
          const isConnected = item.status === 'connected';

          return (
            <div
              key={item.id}
              className={cn(
                'group relative flex flex-col justify-between rounded-xl border bg-card p-5 shadow-xs transition-all hover:shadow-md',
                isConnected && 'border-primary/20'
              )}
            >
              <div className="space-y-4">
                {/* Header row: Icon, Name, Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {getIntegrationIcon(item.iconType)}
                    <div>
                      <h3 className="font-semibold text-foreground text-sm tracking-tight">
                        {item.name}
                      </h3>
                      <span className="text-2xs text-muted-foreground capitalize">
                        {item.category} Gateway
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>

                {/* Last Sync info */}
                {isConnected && item.lastSyncAt && (
                  <div className="flex items-center gap-1.5 text-2xs text-muted-foreground pt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>Last synced: {item.lastSyncAt}</span>
                  </div>
                )}
                {item.status === 'error' && item.lastSyncAt && (
                  <div className="flex items-center gap-1.5 text-2xs text-destructive pt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                    <span>{item.lastSyncAt}</span>
                  </div>
                )}
              </div>

              {/* Bottom Buttons */}
              <div className="border-t pt-4 mt-4 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenConfigure(item)}
                  className="gap-1.5 text-xs h-8"
                >
                  <Settings2 className="h-3.5 w-3.5" />
                  <span>Configure</span>
                </Button>

                <Button
                  variant={isConnected ? 'ghost' : 'default'}
                  size="sm"
                  onClick={() => handleToggleConnect(item)}
                  className={cn(
                    'text-xs h-8',
                    isConnected && 'text-muted-foreground hover:text-destructive'
                  )}
                >
                  {isConnected ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Configure Dialog */}
      <Dialog
        open={!!selectedIntegration}
        onOpenChange={(open) => !open && setSelectedIntegration(null)}
      >
        <DialogContent className="max-w-lg">
          {selectedIntegration && (
            <div className="space-y-4">
              <DialogHeader>
                <div className="flex items-center gap-3 mb-1">
                  {getIntegrationIcon(selectedIntegration.iconType)}
                  <div>
                    <DialogTitle className="text-lg">
                      Configure {selectedIntegration.name}
                    </DialogTitle>
                    <p className="text-xs text-muted-foreground">
                      Set up connection credentials and automated webhook endpoints.
                    </p>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                {/* API Key field */}
                <div className="space-y-1.5">
                  <Label htmlFor="api-key">API Key / Token</Label>
                  <div className="relative">
                    <Input
                      id="api-key"
                      type={showApiKey ? 'text' : 'password'}
                      value={modalApiKey}
                      onChange={(e) => setModalApiKey(e.target.value)}
                      placeholder="sk-live-..."
                      className="pr-10 font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showApiKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {/* Security Note */}
                  <div className="flex items-center gap-1.5 text-2xs text-muted-foreground pt-0.5">
                    <Lock className="h-3 w-3 text-emerald-600" />
                    <span>API keys are encrypted in KMS and never displayed after saving.</span>
                  </div>
                </div>

                {/* Webhook URL if applicable */}
                {selectedIntegration.webhookUrl !== undefined && (
                  <div className="space-y-1.5">
                    <Label htmlFor="webhook-url">Inbound Webhook Callback URL</Label>
                    <Input
                      id="webhook-url"
                      value={modalWebhook}
                      onChange={(e) => setModalWebhook(e.target.value)}
                      placeholder="https://api.skarworld.io/v1/webhooks/..."
                      className="font-mono text-xs"
                    />
                    <p className="text-2xs text-muted-foreground">
                      Register this webhook in the third-party developer console to receive real-time events.
                    </p>
                  </div>
                )}

                {/* Endpoint URL if applicable */}
                {selectedIntegration.endpointUrl !== undefined && (
                  <div className="space-y-1.5">
                    <Label htmlFor="endpoint-url">API Endpoint Host</Label>
                    <Input
                      id="endpoint-url"
                      value={modalEndpoint}
                      onChange={(e) => setModalEndpoint(e.target.value)}
                      placeholder="api.service.com"
                      className="font-mono text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="gap-1.5 text-xs"
                >
                  <RefreshCw className={cn('h-3.5 w-3.5', isTesting && 'animate-spin')} />
                  <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                </Button>

                <div className="flex items-center gap-2">
                  {selectedIntegration.status === 'connected' && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const target = selectedIntegration;
                        setSelectedIntegration(null);
                        setDisconnectingItem(target);
                      }}
                      className="text-xs text-destructive hover:bg-destructive/10"
                    >
                      Disconnect
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedIntegration(null)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSaveConfig}
                    className="text-xs"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Disconnect Alert Confirmation */}
      <AlertDialog
        open={!!disconnectingItem}
        onOpenChange={(open) => !open && setDisconnectingItem(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect {disconnectingItem?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disconnect this integration? Automated events, webhooks, and telemetry through this channel will stop immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDisconnect}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
