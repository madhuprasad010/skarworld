import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Bot,
  Sparkles,
  Save,
  RotateCcw,
  Send,
  UploadCloud,
  Globe,
  FileText,
  Trash2,
  Plus,
  ExternalLink,
  ShieldAlert,
  Code,
  Sliders,
  CheckCircle2,
  User,
  Zap,
} from 'lucide-react';

interface KnowledgeFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
}

interface KnowledgeUrl {
  id: string;
  url: string;
  lastCrawled: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export default function AIConfigPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('identity');

  // 1. Identity Tab State
  const [agentName, setAgentName] = useState('Apex Revenue Copilot');
  const [agentDescription, setAgentDescription] = useState(
    'Autonomous senior revenue automation agent specialized in technical qualification, enterprise objection handling, and real-time deal acceleration.'
  );
  const [personality, setPersonality] = useState<'professional' | 'friendly' | 'casual' | 'formal'>('professional');
  const [communicationStyle, setCommunicationStyle] = useState(
    'Direct, consultative, value-focused, and respectful of prospect time. Avoids marketing fluff and uses precise industry metrics.'
  );
  const [languages, setLanguages] = useState<string[]>([
    'English',
    'Spanish',
    'German',
    'French',
  ]);

  const AVAILABLE_LANGUAGES = [
    'English',
    'Spanish',
    'German',
    'French',
    'Japanese',
    'Mandarin',
    'Portuguese',
    'Arabic',
  ];

  // 2. Instructions Tab State
  const [businessContext, setBusinessContext] = useState(
    'SKARWORLD is an enterprise B2B Revenue Operating System that combines multi-channel autonomous outbound, CRM intelligence, automated proposal generation, and live revenue copilot agents. We serve mid-market to enterprise SaaS, fintech, and digital transformation clients with annual contract values between $50k and $500k.'
  );
  const [targetAudience, setTargetAudience] = useState(
    'Chief Revenue Officers (CRO), VPs of Sales, Heads of RevOps, and Enterprise Account Executives who struggle with lead qualification latency, fragmented sales tools, and missed pipeline opportunities.'
  );
  const [salesObjectives, setSalesObjectives] = useState(
    '1. Qualify BANT/MEDDPIC criteria within the first 3 conversation exchanges.\n2. Secure confirmed 30-minute calendar bookings for senior Account Executives.\n3. Identify technical security/compliance requirements early.\n4. Defend list pricing and position multi-year value.'
  );
  const [pricingPolicies, setPricingPolicies] = useState(
    'List price is non-negotiable without explicit approval from a Sales Director. Maximum self-serve discount is 0%. Annual upfront payments receive standard 15% discount. Multi-year (24-36mo) commitments may receive up to 25% with human approval.'
  );
  const [restrictedClaims, setRestrictedClaims] = useState(
    '- Do NOT guarantee specific revenue dollar growth numbers.\n- Do NOT claim 100% autonomous closing without human review for deals >$100k.\n- Do NOT disclose internal pricing margins or competitor NDA data.\n- Do NOT claim FedRAMP certification until Q4 2026.'
  );
  const [prohibitedActions, setProhibitedActions] = useState(
    '- Never sign or accept contract terms autonomously.\n- Never send custom discounts not registered in catalog.\n- Never solicit credit card numbers or raw credentials over chat channels.\n- Never disparage competitors by name.'
  );
  const [escalationRules, setEscalationRules] = useState(
    'Instantly trigger human takeover when:\n1. Prospect requests legal redline negotiation.\n2. Prospect expresses high frustration or negative sentiment.\n3. Estimated deal size exceeds $200k ARR.\n4. Competitor litigation or breach is mentioned.'
  );

  // 3. Capabilities Tab State
  const [capabilities, setCapabilities] = useState({
    research: true,
    qualification: true,
    scoring: true,
    conversation: true,
    objectionHandling: true,
    proposalGeneration: true,
    followUp: true,
  });

  // 4. Automation Tab State
  const [automation, setAutomation] = useState({
    autoNurturing: true,
    autoQualification: true,
    aiSuggestions: true,
    humanTakeover: true,
    approvalRequirements: true,
  });
  const [qualificationThreshold, setQualificationThreshold] = useState('75');
  const [takeoverSensitivity, setTakeoverSensitivity] = useState('moderate');

  // 5. Knowledge Base State
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([
    {
      id: 'f-1',
      name: 'Skarworld_Revenue_OS_Architecture_Whitepaper_v2.pdf',
      size: '2.4 MB',
      uploadedAt: '2 days ago',
    },
    {
      id: 'f-2',
      name: 'Enterprise_Security_SOC2_Compliance_Guide.pdf',
      size: '1.8 MB',
      uploadedAt: '1 week ago',
    },
    {
      id: 'f-3',
      name: 'Q3_Competitor_Battlecards_Salesforce_HubSpot.pdf',
      size: '3.1 MB',
      uploadedAt: '3 weeks ago',
    },
  ]);
  const [urls, setUrls] = useState<KnowledgeUrl[]>([
    { id: 'u-1', url: 'https://skarworld.io/features/autonomous-copilot', lastCrawled: 'Today at 4:15 AM' },
    { id: 'u-2', url: 'https://skarworld.io/pricing/enterprise', lastCrawled: 'Yesterday' },
  ]);
  const [newUrlInput, setNewUrlInput] = useState('');
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      id: 'faq-1',
      question: 'How does Skarworld integrate with our current CRM?',
      answer: 'Bi-directional webhooks and native REST connectors for Salesforce, HubSpot, and custom Postgres databases.',
    },
    {
      id: 'faq-2',
      question: 'What happens when a lead asks for custom contractual terms?',
      answer: 'The AI flags the thread, freezes automated replies, and routes an instant notification to the assigned AE.',
    },
  ]);
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  // 6. Playground State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Hello! I am Apex Revenue Copilot. How can I help you evaluate Skarworld Revenue OS today?',
      timestamp: 'Just now',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [testAsCustomer, setTestAsCustomer] = useState(true);
  const [showSystemPromptPreview, setShowSystemPromptPreview] = useState(false);

  // Handle Save All Settings
  const handleSaveAll = () => {
    toast({
      title: 'AI Agent Configuration Saved',
      description: 'System prompts, capabilities, and automation guardrails successfully synced to LLM orchestrators.',
      variant: 'success',
    });
  };

  // Toggle Language
  const toggleLanguage = (lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  // Add URL
  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrlInput.trim()) return;
    const item: KnowledgeUrl = {
      id: `u-${Date.now()}`,
      url: newUrlInput.trim(),
      lastCrawled: 'Queued for sync',
    };
    setUrls((prev) => [...prev, item]);
    setNewUrlInput('');
    toast({ title: 'URL Added', description: 'Web page will be indexed into vector store.' });
  };

  // Remove URL
  const handleRemoveUrl = (id: string) => {
    setUrls((prev) => prev.filter((u) => u.id !== id));
  };

  // Add FAQ
  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQ.trim() || !newFaqA.trim()) return;
    setFaqs((prev) => [
      ...prev,
      { id: `faq-${Date.now()}`, question: newFaqQ.trim(), answer: newFaqA.trim() },
    ]);
    setNewFaqQ('');
    setNewFaqA('');
    toast({ title: 'FAQ Added', description: 'Q&A pair indexed for semantic retrieval.' });
  };

  // Remove FAQ
  const handleRemoveFaq = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  // Remove File
  const handleRemoveFile = (id: string) => {
    setKnowledgeFiles((prev) => prev.filter((f) => f.id !== id));
    toast({ title: 'Document Removed', description: 'Document unlinked from embeddings.' });
  };

  // Simulate file upload
  const handleSimulateUpload = () => {
    const newDoc: KnowledgeFile = {
      id: `f-${Date.now()}`,
      name: `Custom_Product_Spec_${Math.floor(100 + Math.random() * 900)}.pdf`,
      size: '1.2 MB',
      uploadedAt: 'Just now',
    };
    setKnowledgeFiles((prev) => [newDoc, ...prev]);
    toast({
      title: 'Document Uploaded',
      description: `"${newDoc.name}" has been chunked and embedded.`,
      variant: 'success',
    });
  };

  // Send message in Playground
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userText = inputMessage.trim();
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response based on settings
    setTimeout(() => {
      let reply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('price') || lower.includes('cost') || lower.includes('discount')) {
        reply = `Our standard SaaS pricing is designed to deliver immediate ROI. We offer our Revenue Copilot Core at $499/mo and comprehensive Enterprise packages tailored for high volume. Are you looking to empower an individual sales pod or your entire revenue organization?`;
      } else if (lower.includes('competitor') || lower.includes('hubspot') || lower.includes('salesforce')) {
        reply = `Rather than replacing your core CRM like Salesforce or HubSpot, Skarworld Revenue OS serves as an autonomous intelligence acceleration layer on top of it. It automates omni-channel engagement and qualification so your reps only spend time on high-conviction meetings.`;
      } else if (lower.includes('demo') || lower.includes('call') || lower.includes('schedule')) {
        reply = `I would be glad to coordinate a tailored discovery session with our Solutions Engineering team. I have availability tomorrow at 2:00 PM EST or Thursday at 11:00 AM EST. Does either of those align with your schedule?`;
      } else {
        reply = `Understood. Based on your goals in scaling enterprise revenue, Skarworld Revenue OS automates lead capture across WhatsApp, webchat, and email while maintaining strict qualification thresholds. What specific bottlenecks is your team experiencing right now?`;
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 900);
  };

  // Reset conversation
  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg-init',
        sender: 'assistant',
        text: `Hello! I am ${agentName}. How can I assist you with your sales automation objectives today?`,
        timestamp: 'Just now',
      },
    ]);
    toast({ title: 'Conversation Reset', description: 'Session context cleared.' });
  };

  // Live compiled system prompt preview string
  const compiledSystemPrompt = `You are ${agentName}, an AI sales agent for SKARWORLD REVENUE OS.
PERSONALITY: ${personality}. ${communicationStyle}
BUSINESS CONTEXT: ${businessContext}
TARGET AUDIENCE: ${targetAudience}
SALES OBJECTIVES: ${salesObjectives}
PRICING POLICY: ${pricingPolicies}
RESTRICTED CLAIMS:
${restrictedClaims}
PROHIBITED ACTIONS:
${prohibitedActions}
ESCALATION TRIGGERS:
${escalationRules}
SUPPORTED LANGUAGES: ${languages.join(', ')}
CAPABILITIES: ${Object.entries(capabilities)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join(', ')}`;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <PageHeader
        title="AI Agent Configuration"
        description="Configure autonomous sales agents, behavioral directives, knowledge retrieval, and test live prompts in sandbox."
        icon={Bot}
        actions={
          <Button onClick={handleSaveAll} className="gap-2 shadow-sm">
            <Save className="h-4 w-4" />
            <span>Save Configuration</span>
          </Button>
        }
      />

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="border-b">
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full max-w-4xl h-auto p-1 bg-muted/60">
            <TabsTrigger value="identity" className="text-xs">Identity</TabsTrigger>
            <TabsTrigger value="instructions" className="text-xs">Instructions</TabsTrigger>
            <TabsTrigger value="capabilities" className="text-xs">Capabilities</TabsTrigger>
            <TabsTrigger value="automation" className="text-xs">Automation</TabsTrigger>
            <TabsTrigger value="knowledge" className="text-xs">Knowledge Base</TabsTrigger>
            <TabsTrigger value="playground" className="text-xs">Playground</TabsTrigger>
          </TabsList>
        </div>

        {/* 1. IDENTITY TAB */}
        <TabsContent value="identity" className="space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-semibold text-foreground">Agent Identity & Brand Persona</h3>
              <p className="text-xs text-muted-foreground">
                Define the outward profile, voice tonality, and multi-lingual capabilities of your agent.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="agent-name">Agent Display Name</Label>
                <Input
                  id="agent-name"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="personality">Business Personality</Label>
                <Select
                  value={personality}
                  onValueChange={(val) => setPersonality(val as typeof personality)}
                >
                  <SelectTrigger id="personality">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional & Authoritative</SelectItem>
                    <SelectItem value="friendly">Friendly & Consultative</SelectItem>
                    <SelectItem value="casual">Casual & Direct</SelectItem>
                    <SelectItem value="formal">Formal & Corporate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="agent-desc">Agent Profile Description</Label>
              <Textarea
                id="agent-desc"
                rows={2}
                value={agentDescription}
                onChange={(e) => setAgentDescription(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="comm-style">Communication Style & Voice Directive</Label>
              <Textarea
                id="comm-style"
                rows={3}
                value={communicationStyle}
                onChange={(e) => setCommunicationStyle(e.target.value)}
              />
            </div>

            <div className="space-y-3 border-t pt-4">
              <Label>Supported Autonomous Languages</Label>
              <p className="text-xs text-muted-foreground">
                Agent will automatically detect inbound prospect language and respond with native fluency.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {AVAILABLE_LANGUAGES.map((lang) => {
                  const isChecked = languages.includes(lang);
                  return (
                    <label
                      key={lang}
                      onClick={() => toggleLanguage(lang)}
                      className={cn(
                        'flex items-center gap-2.5 rounded-lg border p-3 cursor-pointer transition-all select-none',
                        isChecked
                          ? 'border-primary bg-primary/5 text-foreground font-medium'
                          : 'border-border text-muted-foreground hover:bg-muted/40'
                      )}
                    >
                      <Checkbox checked={isChecked} />
                      <span className="text-xs">{lang}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 2. INSTRUCTIONS TAB */}
        <TabsContent value="instructions" className="space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">Sales Directives & Prompt Rules</h3>
                <p className="text-xs text-muted-foreground">
                  Core mission context, commercial boundaries, target audience, and safety guardrails.
                </p>
              </div>
              <a
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <span>View Products & Catalog Reference</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="biz-context">Business & Product Context (Large)</Label>
              <Textarea
                id="biz-context"
                rows={4}
                value={businessContext}
                onChange={(e) => setBusinessContext(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="target-aud">Target Audience & Buyer Personas</Label>
                <Textarea
                  id="target-aud"
                  rows={4}
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sales-obj">Sales Objectives & Milestones</Label>
                <Textarea
                  id="sales-obj"
                  rows={4}
                  value={salesObjectives}
                  onChange={(e) => setSalesObjectives(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pricing-pol">Pricing & Discount Policies</Label>
              <Textarea
                id="pricing-pol"
                rows={3}
                value={pricingPolicies}
                onChange={(e) => setPricingPolicies(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-destructive font-medium text-xs">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>Restricted Claims (Must NOT Say)</span>
                </div>
                <Textarea
                  rows={5}
                  value={restrictedClaims}
                  onChange={(e) => setRestrictedClaims(e.target.value)}
                  className="font-mono text-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-600 font-medium text-xs">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>Prohibited Autonomous Actions</span>
                </div>
                <Textarea
                  rows={5}
                  value={prohibitedActions}
                  onChange={(e) => setProhibitedActions(e.target.value)}
                  className="font-mono text-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-primary font-medium text-xs">
                  <Zap className="h-3.5 w-3.5" />
                  <span>Human Escalation Rules</span>
                </div>
                <Textarea
                  rows={5}
                  value={escalationRules}
                  onChange={(e) => setEscalationRules(e.target.value)}
                  className="font-mono text-2xs"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 3. CAPABILITIES TAB */}
        <TabsContent value="capabilities" className="space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">Active Agent Capabilities</h3>
              <p className="text-xs text-muted-foreground">
                Toggle operational skills that the agent is permitted to execute across pipeline stages.
              </p>
            </div>

            <div className="divide-y divide-border pt-2">
              {[
                {
                  key: 'research',
                  title: 'Deep Prospect & Account Research',
                  desc: 'Autonomously scans prospect domain, LinkedIn signals, and news via Tavily before drafting first outreach.',
                },
                {
                  key: 'qualification',
                  title: 'Conversational Qualification (BANT/MEDDPIC)',
                  desc: 'Asks clarifying questions to determine budget, authority, timeline, and decision criteria.',
                },
                {
                  key: 'scoring',
                  title: 'Dynamic Lead Scoring & Intent Classification',
                  desc: 'Continuously updates lead score (0-100) based on sentiment, engagement velocity, and firmographics.',
                },
                {
                  key: 'conversation',
                  title: 'Omnichannel Conversation Flow',
                  desc: 'Maintains long-term context across WhatsApp, Telegram, email, and website live chat.',
                },
                {
                  key: 'objectionHandling',
                  title: 'Enterprise Objection Handling',
                  desc: 'Addresses pricing, competitor comparisons, and feature gaps using approved knowledge base facts.',
                },
                {
                  key: 'proposalGeneration',
                  title: 'Automated Proposal & SOW Drafting',
                  desc: 'Generates standardized proposal summaries referencing valid product catalog prices and SKU terms.',
                },
                {
                  key: 'followUp',
                  title: 'Intelligent Multi-touch Follow-up',
                  desc: 'Triggers context-aware reminders when prospects do not respond within specified cadence windows.',
                },
              ].map((item) => {
                const isEnabled = capabilities[item.key as keyof typeof capabilities];
                return (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-4 first:pt-2 last:pb-2 gap-4"
                  >
                    <div className="space-y-0.5">
                      <div className="font-medium text-sm text-foreground">{item.title}</div>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={(checked) =>
                        setCapabilities((prev) => ({ ...prev, [item.key]: checked }))
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* 4. AUTOMATION TAB */}
        <TabsContent value="automation" className="space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-semibold text-foreground">Autonomy & Takeover Controls</h3>
              <p className="text-xs text-muted-foreground">
                Control the boundary between automated AI execution and required human-in-the-loop sign-off.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium text-foreground">Automatic Nurturing</div>
                  <p className="text-xs text-muted-foreground">
                    Send automated value-add content and check-ins to cold or stalled pipeline contacts.
                  </p>
                </div>
                <Switch
                  checked={automation.autoNurturing}
                  onCheckedChange={(checked) =>
                    setAutomation((prev) => ({ ...prev, autoNurturing: checked }))
                  }
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border p-4 gap-4">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium text-foreground">Automatic Qualification</div>
                  <p className="text-xs text-muted-foreground">
                    Automatically advance leads to 'Qualified' stage when score crosses threshold.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    Score Threshold:
                  </span>
                  <Select
                    value={qualificationThreshold}
                    onValueChange={setQualificationThreshold}
                    disabled={!automation.autoQualification}
                  >
                    <SelectTrigger className="w-[100px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">60+</SelectItem>
                      <SelectItem value="75">75+ (Default)</SelectItem>
                      <SelectItem value="85">85+ (Strict)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Switch
                    checked={automation.autoQualification}
                    onCheckedChange={(checked) =>
                      setAutomation((prev) => ({ ...prev, autoQualification: checked }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium text-foreground">AI Response Suggestions (Copilot Mode)</div>
                  <p className="text-xs text-muted-foreground">
                    Draft suggested replies for human reps rather than sending directly to live prospects.
                  </p>
                </div>
                <Switch
                  checked={automation.aiSuggestions}
                  onCheckedChange={(checked) =>
                    setAutomation((prev) => ({ ...prev, aiSuggestions: checked }))
                  }
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border p-4 gap-4">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium text-foreground">Human Takeover Triggers</div>
                  <p className="text-xs text-muted-foreground">
                    Pause AI and alert sales rep whenever negative sentiment or complex query is detected.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    Sensitivity:
                  </span>
                  <Select
                    value={takeoverSensitivity}
                    onValueChange={setTakeoverSensitivity}
                    disabled={!automation.humanTakeover}
                  >
                    <SelectTrigger className="w-[120px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Fewer alerts)</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="high">High (Paranoid)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Switch
                    checked={automation.humanTakeover}
                    onCheckedChange={(checked) =>
                      setAutomation((prev) => ({ ...prev, humanTakeover: checked }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium text-foreground">Approval Requirements</div>
                  <p className="text-xs text-muted-foreground">
                    Require manager sign-off in Approval Center before issuing quotes or custom proposals.
                  </p>
                </div>
                <Switch
                  checked={automation.approvalRequirements}
                  onCheckedChange={(checked) =>
                    setAutomation((prev) => ({ ...prev, approvalRequirements: checked }))
                  }
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 5. KNOWLEDGE BASE TAB */}
        <TabsContent value="knowledge" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Document Upload Area & Files */}
            <div className="rounded-xl border bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Document Knowledge</h3>
                  <p className="text-xs text-muted-foreground">
                    PDFs, whitepapers, compliance sheets, and pitch decks.
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={handleSimulateUpload} className="gap-1.5 text-xs">
                  <Plus className="h-3.5 w-3.5" />
                  Upload Mock Doc
                </Button>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onClick={handleSimulateUpload}
                className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-6 text-center hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold text-foreground">
                  Click or drag files here to upload
                </p>
                <span className="text-2xs text-muted-foreground mt-0.5">
                  Supports PDF, DOCX, TXT up to 25MB each
                </span>
              </div>

              {/* Uploaded Files List */}
              <div className="space-y-2">
                <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Indexed Files ({knowledgeFiles.length})
                </span>
                <div className="divide-y divide-border rounded-lg border">
                  {knowledgeFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <div className="truncate">
                          <p className="font-medium text-foreground truncate">{file.name}</p>
                          <span className="text-2xs text-muted-foreground">
                            {file.size} · Uploaded {file.uploadedAt}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => handleRemoveFile(file.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Web URLs & FAQs */}
            <div className="rounded-xl border bg-card p-6 shadow-xs space-y-6">
              {/* Web URLs */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Live Website Sources</h3>
                  <p className="text-xs text-muted-foreground">
                    Public documentation or marketing pages to scrape on schedule.
                  </p>
                </div>

                <form onSubmit={handleAddUrl} className="flex gap-2">
                  <Input
                    placeholder="https://yourcompany.com/product"
                    value={newUrlInput}
                    onChange={(e) => setNewUrlInput(e.target.value)}
                    className="text-xs h-9"
                  />
                  <Button type="submit" size="sm" className="h-9 gap-1.5 shrink-0 text-xs">
                    <Plus className="h-3.5 w-3.5" /> Add URL
                  </Button>
                </form>

                <div className="space-y-1.5">
                  {urls.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between rounded-lg border p-2.5 text-xs"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Globe className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="truncate text-foreground font-mono text-2xs">{u.url}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-2xs text-muted-foreground hidden sm:inline">{u.lastCrawled}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveUrl(u.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div className="space-y-3 border-t pt-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Direct Q&A Pairs</h4>
                  <p className="text-xs text-muted-foreground">
                    Exact question and answer benchmarks indexed for priority retrieval.
                  </p>
                </div>

                <form onSubmit={handleAddFaq} className="space-y-2 bg-muted/20 p-3 rounded-lg border">
                  <Input
                    placeholder="Question (e.g. Do you support HIPAA?)"
                    value={newFaqQ}
                    onChange={(e) => setNewFaqQ(e.target.value)}
                    className="text-xs h-8"
                  />
                  <Textarea
                    placeholder="Answer (e.g. Yes, our Enterprise tier includes signed BAA...)"
                    value={newFaqA}
                    onChange={(e) => setNewFaqA(e.target.value)}
                    rows={2}
                    className="text-xs"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" className="h-7 text-xs gap-1">
                      <Plus className="h-3 w-3" /> Add FAQ
                    </Button>
                  </div>
                </form>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {faqs.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-start justify-between rounded-lg border p-2.5 text-xs gap-2"
                    >
                      <div className="space-y-1">
                        <div className="font-semibold text-foreground">Q: {f.question}</div>
                        <div className="text-muted-foreground text-2xs">A: {f.answer}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => handleRemoveFaq(f.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 6. PLAYGROUND TAB */}
        <TabsContent value="playground" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Chat Simulator */}
            <div className="lg:col-span-2 rounded-xl border bg-card shadow-xs flex flex-col h-[650px]">
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">{agentName} Simulator</h4>
                    <span className="text-2xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Runtime Ready · {personality}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 border rounded-lg px-2.5 py-1 text-xs">
                    <span className="text-2xs text-muted-foreground">Test as Prospect</span>
                    <Switch
                      checked={testAsCustomer}
                      onCheckedChange={setTestAsCustomer}
                      className="scale-75"
                    />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetChat}
                    className="h-8 gap-1.5 text-xs"
                    title="Reset simulation"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m) => {
                  const isBot = m.sender === 'assistant';
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        'flex gap-3 max-w-[85%]',
                        isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'
                      )}
                    >
                      <Avatar className="h-7 w-7 text-2xs shrink-0 mt-0.5">
                        <AvatarFallback
                          className={isBot ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                        >
                          {isBot ? <Sparkles className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                        </AvatarFallback>
                      </Avatar>

                      <div className="space-y-1">
                        <div
                          className={cn(
                            'rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-xs',
                            isBot
                              ? 'bg-muted/70 text-foreground rounded-tl-sm'
                              : 'bg-primary text-primary-foreground rounded-tr-sm'
                          )}
                        >
                          {m.text}
                        </div>
                        <span className="text-3xs text-muted-foreground px-1 block">
                          {isBot ? agentName : testAsCustomer ? 'Prospect (Inbound)' : 'Internal Rep'} · {m.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex gap-3 max-w-[80%] mr-auto items-center">
                    <Avatar className="h-7 w-7 text-2xs shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Sparkles className="h-3.5 w-3.5 animate-spin" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="rounded-2xl rounded-tl-sm bg-muted/70 px-4 py-2 text-xs text-muted-foreground flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-foreground/40 animate-bounce" />
                      <span className="h-1.5 w-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:0.2s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2">
                <Input
                  placeholder={
                    testAsCustomer
                      ? 'Type as a prospect (e.g. "What does this cost?", "Can you do a 30% discount?")...'
                      : 'Test sales inquiry prompt...'
                  }
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="text-xs"
                />
                <Button type="submit" disabled={!inputMessage.trim() || isTyping} className="gap-1.5 text-xs shrink-0">
                  <Send className="h-3.5 w-3.5" />
                  Send
                </Button>
              </form>
            </div>

            {/* Right Col: System Prompt Preview */}
            <div className="rounded-xl border bg-card p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold text-sm text-foreground">System Prompt Preview</h4>
                  </div>
                  <Badge variant="outline" className="text-2xs font-mono">
                    Live Compiled
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  The compiled instruction payload delivered to LLM inference pipelines during execution.
                </p>

                <div className="rounded-lg bg-muted/40 p-3 border font-mono text-2xs leading-relaxed max-h-[440px] overflow-y-auto whitespace-pre-wrap text-foreground/80">
                  {compiledSystemPrompt}
                </div>
              </div>

              <div className="rounded-lg border bg-indigo-50/50 dark:bg-indigo-950/20 p-3 text-xs space-y-1">
                <div className="font-semibold text-indigo-900 dark:text-indigo-200">
                  Model Guardrail Verification
                </div>
                <p className="text-2xs text-muted-foreground">
                  Hallucination filter and strict regex validators active on all playground simulation runs.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
