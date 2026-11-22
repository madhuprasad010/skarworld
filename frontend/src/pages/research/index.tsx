import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import {
  Search,
  Plus,
  FileText,
  Building,
  User,
  TrendingUp,
  ExternalLink,
  Sparkles,
  Download,
  Share2,
  Calendar,
  Layers,
  CheckCircle2,
  RefreshCw,
  Copy,
} from 'lucide-react';

export type ResearchType = 'prospect' | 'company' | 'competitor' | 'industry';

export interface ResearchSource {
  title: string;
  url: string;
}

export interface ResearchReport {
  id: string;
  title: string;
  type: ResearchType;
  subject: string;
  summary: string;
  keyFindings: string[];
  fullContent: string;
  sources: ResearchSource[];
  generatedBy: 'AI Agent' | 'Alex Rivera' | 'Elena Rostova';
  createdAt: string;
}

const INITIAL_REPORTS: ResearchReport[] = [
  {
    id: 'res-001',
    title: 'CloudScale Tech Enterprise Architecture & Growth Brief',
    type: 'company',
    subject: 'CloudScale Tech',
    summary:
      'CloudScale is expanding its multi-cloud observability suite following a $45M Series B funding round. They are currently overhauling their enterprise sales pipeline and consolidating vendor footprints.',
    keyFindings: [
      'Announced $45M Series B led by Insight Partners with mandate to triple ARR in 18 months.',
      'Active job postings reveal 12 new Enterprise Account Executive openings in North America.',
      'Currently evaluating replacements for disjointed Apollo/Outreach stacks due to SOC2 compliance gaps.',
      'CTO publicly blogged about migrating internal systems to zero-trust architecture by Q4.',
    ],
    fullContent: `## Executive Overview
CloudScale Tech is a high-growth telemetry software company based in Austin, TX. The company has demonstrated 140% Net Revenue Retention (NRR) over the past four quarters but faces significant operational friction in outbound pipeline generation.

### Growth Signals & Capital Allocation
- Closed $45M Series B in Q1 2026.
- Expanding sales organization from 8 AEs to 24 AEs by end of year.
- Heavy focus on EMEA enterprise market expansion.

### Technology Stack & Bottlenecks
- Current CRM: Salesforce Enterprise (heavily customized, high technical debt).
- Current Outbound: Disjointed mix of manual spreadsheets and fragmented sequencing tools.
- Primary Pain Point: Severe latency (average 14 hours) between inbound lead form fill and initial rep outreach.

### Commercial Angle for Skarworld
Position Skarworld Revenue OS as the unified AI execution layer that sits on top of their Salesforce instance. Highlight our sub-5-second lead engagement speed across WhatsApp and webchat, which addresses their direct qualification bottleneck.`,
    sources: [
      { title: 'TechCrunch: CloudScale Raises $45M Series B', url: 'https://techcrunch.com/cloudscale-series-b' },
      { title: 'LinkedIn Talent Insights: CloudScale Hiring Trajectory', url: 'https://linkedin.com/company/cloudscale/jobs' },
      { title: 'CloudScale Engineering Blog on Zero Trust', url: 'https://cloudscale.tech/blog/zero-trust' },
    ],
    generatedBy: 'AI Agent',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: 'res-002',
    title: 'Sarah Jenkins (CTO) Persona & Decision Matrix',
    type: 'prospect',
    subject: 'Sarah Jenkins',
    summary:
      'Sarah Jenkins serves as Chief Technology Officer at CloudScale Tech. Ex-AWS Senior Principal Engineer with high sensitivity to data privacy, HIPAA/SOC2 compliance, and API latency.',
    keyFindings: [
      'Prefers technical documentation and architectural blueprints over high-level sales decks.',
      'Key buying objection: Customer telemetry data must not be stored in shared multi-tenant memory pools.',
      'Co-authored open-source distributed tracing standards; values developer-first API integrations.',
      'Final technical signatory on software purchases exceeding $100k annually.',
    ],
    fullContent: `## Stakeholder Profile: Sarah Jenkins
- Title: Chief Technology Officer, CloudScale Tech
- Former Roles: Senior Principal Engineer at AWS (8 years), Director of Infrastructure at Datadog.
- Education: M.S. Computer Science, Stanford University.

### Behavioral Tendencies & Communication Guidelines
- **Approach**: Highly analytical. Open conversations with engineering specifications, SLA uptime guarantees, and encryption in transit/rest.
- **Tone**: Consultative, concise, zero marketing jargon.
- **Objections**: Will immediately probe how LLMs interact with customer data. Be ready to furnish our SOC2 Type II report and zero-retention API commitment.

### Recommended Value Proposition
Emphasize that Skarworld Revenue OS operates via tenant-isolated enclaves and supports customer-managed KMS encryption keys.`,
    sources: [
      { title: 'GitHub Profile & Open Source Repositories', url: 'https://github.com/sjenkins-tech' },
      { title: 'Podcast Interview: Observability at Scale (Ep. 42)', url: 'https://softwareengineeringdaily.com/sjenkins' },
      { title: 'LinkedIn Profile & Historical Endorsements', url: 'https://linkedin.com/in/sarah-jenkins-cto' },
    ],
    generatedBy: 'AI Agent',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'res-003',
    title: 'Finovate Capital Competitor Displacement Analysis',
    type: 'competitor',
    subject: 'Finovate Capital / OutboundIQ',
    summary:
      'In-depth competitive tear-down comparing Skarworld Revenue OS with OutboundIQ. Explores why Finovate is seeking contract termination with legacy incumbent.',
    keyFindings: [
      'Incumbent OutboundIQ suffered 3 major deliverability downgrades in last 6 months.',
      'Finovate reps report 40% bounce rate on OutboundIQ contact database.',
      'Competitor lacks multi-channel WhatsApp and Telegram autonomous conversation nodes.',
      'Incumbent renewal is due on Nov 30; customer is actively seeking early exit clause.',
    ],
    fullContent: `## Competitive Tear-Down: Skarworld vs OutboundIQ
Finovate Capital has deployed OutboundIQ across 45 seats for 18 months. However, changing spam filters and domain reputation penalties have degraded their cold outreach performance.

### Comparative Feature Grid
1. **Deliverability & Warmup**: Skarworld provides automated domain rotation and dedicated IP pools. OutboundIQ uses shared tenant IP pools resulting in high collateral spam tagging.
2. **Multi-Channel Coverage**: OutboundIQ supports only SMTP email. Skarworld supports WhatsApp Business, Telegram, Webchat, and Email natively.
3. **AI Autonomous Reasoning**: OutboundIQ relies on static templating. Skarworld uses Claude 3.5 Sonnet with dynamic account research synthesis.

### Strategy to Win
Offer a migration onboarding credit that offsets the remaining two months of their legacy contract if they commit to a 2-year Skarworld Enterprise term.`,
    sources: [
      { title: 'G2 Crowd Review Sentiment: OutboundIQ Deliverability', url: 'https://g2.com/products/outboundiq/reviews' },
      { title: 'Spamhaus IP Reputation Benchmark Report', url: 'https://spamhaus.org/reputation-check' },
    ],
    generatedBy: 'Elena Rostova',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'res-004',
    title: 'North American B2B SaaS RevOps Benchmarks 2026',
    type: 'industry',
    subject: 'B2B Enterprise SaaS Industry',
    summary:
      'Comprehensive benchmark analysis tracking the shift from human-only SDR pods to hybrid AI revenue agent workflows across 250 mid-market software vendors.',
    keyFindings: [
      'Average sales development rep ramp time has lengthened from 3.2 months to 5.4 months.',
      'Teams leveraging autonomous AI inbound qualification report 3.8x higher demo attendance rate.',
      'Customer acquisition cost (CAC) payback period reduced by 28% for AI-first revenue organizations.',
      '78% of enterprise buyers now demand instant qualification responses within 5 minutes.',
    ],
    fullContent: `## Industry State of the Market
Macroeconomic efficiency pressures have made bloated SDR teams financially unsustainable for Series B through pre-IPO SaaS companies.

### Macro Industry Shifts
1. **Speed to Lead is Paramount**: Inbound conversion drops 8x if initial engagement takes longer than 10 minutes.
2. **Channel Diversification**: Buyers increasingly prefer messaging apps (WhatsApp, Telegram) over cluttered email inboxes.
3. **Budget Rationalization**: Consolidation of point solutions (enrichment, dialers, sequencers) into unified operating platforms.

### Strategic Implications
Highlight Skarworld's all-in-one architecture to C-level buyers to demonstrate 40%+ software consolidation cost reduction.`,
    sources: [
      { title: 'Gartner 2026 Future of B2B Sales Technology Report', url: 'https://gartner.com/research/future-of-sales' },
      { title: 'Bessemer Venture Partners State of the Cloud 2026', url: 'https://bvp.com/atlas/state-of-the-cloud' },
      { title: 'Bridge Group SaaS SDR Metric Benchmark', url: 'https://bridgegroupinc.com/metrics' },
    ],
    generatedBy: 'AI Agent',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
];

export function ResearchPage() {
  const { toast } = useToast();
  const [reports, setReports] = useState<ResearchReport[]>(INITIAL_REPORTS);
  const [activeTab, setActiveTab] = useState<string>('all');

  // View Report Modal
  const [selectedReport, setSelectedReport] = useState<ResearchReport | null>(null);

  // New Research Dialog
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [newType, setNewType] = useState<ResearchType>('company');
  const [newSubject, setNewSubject] = useState('');
  const [newContext, setNewContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Tab Filtering
  const filteredReports = useMemo(() => {
    if (activeTab === 'all') return reports;
    return reports.filter((r) => r.type === activeTab);
  }, [reports, activeTab]);

  const counts = useMemo(() => {
    return {
      all: reports.length,
      prospect: reports.filter((r) => r.type === 'prospect').length,
      company: reports.filter((r) => r.type === 'company').length,
      competitor: reports.filter((r) => r.type === 'competitor').length,
      industry: reports.filter((r) => r.type === 'industry').length,
    };
  }, [reports]);

  const getTypeBadge = (type: ResearchType) => {
    switch (type) {
      case 'prospect':
        return (
          <Badge variant="indigo" className="gap-1 capitalize font-medium">
            <User className="h-3 w-3" /> Prospect
          </Badge>
        );
      case 'company':
        return (
          <Badge variant="secondary" className="gap-1 capitalize font-medium">
            <Building className="h-3 w-3" /> Company
          </Badge>
        );
      case 'competitor':
        return (
          <Badge variant="destructive" className="gap-1 capitalize font-medium">
            <TrendingUp className="h-3 w-3" /> Competitor
          </Badge>
        );
      case 'industry':
      default:
        return (
          <Badge variant="outline" className="gap-1 capitalize font-medium">
            <Layers className="h-3 w-3" /> Industry
          </Badge>
        );
    }
  };

  // Generate New Research Simulation
  const handleGenerateResearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) {
      toast({
        title: 'Subject Required',
        description: 'Please specify the subject or target organization.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const generatedReport: ResearchReport = {
        id: `res-${Date.now()}`,
        title: `${newSubject.trim()} Autonomous Intelligence Dossier`,
        type: newType,
        subject: newSubject.trim(),
        summary: `Autonomous intelligence dossier compiled on ${newSubject.trim()}. Evaluates operational milestones, technology footprint, and strategic alignment with Skarworld Revenue OS.`,
        keyFindings: [
          `Identified executive leadership changes and recent capital commitments at ${newSubject.trim()}.`,
          'Identified legacy CRM and outbound infrastructure migration windows.',
          'Detected high strategic fit with Skarworld autonomous inbound qualification capabilities.',
          'Formulated optimal outreach sequence and commercial discount threshold.',
        ],
        fullContent: `## Intelligence Dossier: ${newSubject.trim()}
Generated autonomously by Skarworld Research Agent via multi-source web crawling and Tavily search index.

### Subject Summary
- Target Entity: ${newSubject.trim()}
- Analysis Focus: ${newType.toUpperCase()}
- Strategic Directives: ${newContext || 'Standard enterprise sales qualification and intent telemetry.'}

### Recommended Sales Actions
1. Deploy personalized multi-touch outreach referencing recent organizational initiatives.
2. Position 24/7 lead response SLA as primary competitive differentiator.
3. Coordinate discovery call with technical decision makers.`,
        sources: [
          { title: `${newSubject.trim()} Corporate Press Releases`, url: `https://${newSubject.toLowerCase().replace(/\s+/g, '')}.com/news` },
          { title: 'Tavily Search Intelligence Aggregation', url: 'https://tavily.com/results' },
        ],
        generatedBy: 'AI Agent',
        createdAt: new Date().toISOString(),
      };

      setReports((prev) => [generatedReport, ...prev]);
      setIsGenerating(false);
      setIsNewDialogOpen(false);
      setNewSubject('');
      setNewContext('');
      setSelectedReport(generatedReport);

      toast({
        title: 'Research Dossier Generated',
        description: `Intelligence brief for "${generatedReport.subject}" is ready for review.`,
        variant: 'success',
      });
    }, 1500);
  };

  // Export report
  const handleExport = (report: ResearchReport) => {
    navigator.clipboard?.writeText(report.fullContent);
    toast({
      title: 'Report Copied to Clipboard',
      description: `Full markdown brief for "${report.title}" copied.`,
      variant: 'success',
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Research"
        description="Autonomous AI company dossiers, executive prospect profiles, competitor teardowns, and market benchmarks."
        icon={Search}
        actions={
          <Button onClick={() => setIsNewDialogOpen(true)} className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            <span>New Research</span>
          </Button>
        }
      />

      {/* Tabs */}
      <div className="border-b pb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-5 w-full sm:w-auto">
            <TabsTrigger value="all" className="gap-1.5">
              All <Badge variant="secondary" className="px-1.5 py-0 text-2xs">{counts.all}</Badge>
            </TabsTrigger>
            <TabsTrigger value="prospect" className="gap-1.5">
              Prospect <Badge variant="secondary" className="px-1.5 py-0 text-2xs">{counts.prospect}</Badge>
            </TabsTrigger>
            <TabsTrigger value="company" className="gap-1.5">
              Company <Badge variant="secondary" className="px-1.5 py-0 text-2xs">{counts.company}</Badge>
            </TabsTrigger>
            <TabsTrigger value="competitor" className="gap-1.5">
              Competitor <Badge variant="secondary" className="px-1.5 py-0 text-2xs">{counts.competitor}</Badge>
            </TabsTrigger>
            <TabsTrigger value="industry" className="gap-1.5">
              Industry <Badge variant="secondary" className="px-1.5 py-0 text-2xs">{counts.industry}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Research Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="group relative flex flex-col justify-between rounded-xl border bg-card p-5 shadow-xs transition-all hover:shadow-md hover:border-primary/40 space-y-4"
          >
            <div className="space-y-3">
              {/* Card Header: Type Badge, Generated Date */}
              <div className="flex items-center justify-between gap-2">
                {getTypeBadge(report.type)}
                <div className="flex items-center gap-1.5 text-2xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{format(parseISO(report.createdAt), 'MMM d, yyyy')}</span>
                </div>
              </div>

              {/* Title & Subject */}
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground text-base tracking-tight leading-snug group-hover:text-primary transition-colors">
                  {report.title}
                </h3>
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  Subject: <strong className="text-foreground">{report.subject}</strong>
                </span>
              </div>

              {/* Summary (3 lines truncated) */}
              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                {report.summary}
              </p>

              {/* Meta stats */}
              <div className="flex flex-wrap items-center gap-4 text-2xs text-muted-foreground border-t pt-3">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-primary" />
                  {report.keyFindings.length} Key Findings
                </span>
                <span className="flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  {report.sources.length} Verified Sources
                </span>
                <span className="flex items-center gap-1">
                  By {report.generatedBy}
                </span>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="border-t pt-3 flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedReport(report)}
                className="w-full gap-1.5 text-xs h-8"
              >
                <FileText className="h-3.5 w-3.5 text-primary" />
                <span>View Full Report</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Expandable Full Report Modal */}
      <Dialog
        open={!!selectedReport}
        onOpenChange={(open) => !open && setSelectedReport(null)}
      >
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {selectedReport && (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  {getTypeBadge(selectedReport.type)}
                  <span className="text-xs text-muted-foreground">
                    Generated by {selectedReport.generatedBy} on{' '}
                    {format(parseISO(selectedReport.createdAt), 'MMMM d, yyyy · h:mm a')}
                  </span>
                </div>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  {selectedReport.title}
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  Target Subject: <span className="font-semibold text-foreground">{selectedReport.subject}</span>
                </p>
              </DialogHeader>

              {/* Key Findings Box */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Executive Key Findings
                  </h4>
                </div>
                <ul className="space-y-2">
                  {selectedReport.keyFindings.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-foreground/90 leading-relaxed">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Formatted Full Content Body */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Comprehensive Intelligence Report
                </h4>
                <div className="rounded-lg border bg-card p-5 font-sans text-xs leading-relaxed space-y-3 whitespace-pre-wrap text-foreground/90">
                  {selectedReport.fullContent}
                </div>
              </div>

              {/* Sources */}
              <div className="space-y-2 border-t pt-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Primary Sources & Research Citations
                </h4>
                <div className="space-y-1.5">
                  {selectedReport.sources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-md border p-2.5 text-xs hover:bg-muted/40 transition-colors"
                    >
                      <span className="font-medium text-foreground">{source.title}</span>
                      <div className="flex items-center gap-1 text-primary text-2xs">
                        <span>{source.url}</span>
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <DialogFooter className="pt-2 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport(selectedReport)}
                  className="gap-1.5 text-xs"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy Markdown
                </Button>
                <Button size="sm" onClick={() => setSelectedReport(null)}>
                  Close Report
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Research Generation Dialog */}
      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Initiate AI Research Dossier</span>
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              Direct the autonomous research agent to crawl web intelligence, news feeds, and executive profiles.
            </p>
          </DialogHeader>

          <form onSubmit={handleGenerateResearch} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="res-type">Research Type</Label>
              <Select
                value={newType}
                onValueChange={(val) => setNewType(val as ResearchType)}
              >
                <SelectTrigger id="res-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company">Company Account Dossier</SelectItem>
                  <SelectItem value="prospect">Executive Prospect Persona</SelectItem>
                  <SelectItem value="competitor">Competitor Battlecard & Displacement</SelectItem>
                  <SelectItem value="industry">Industry Trends & Benchmark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="res-subject">Target Subject / Entity Name *</Label>
              <Input
                id="res-subject"
                placeholder="e.g. Acme Corp or Jane Doe (VP Engineering)"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="res-context">Additional Context & Specific Questions</Label>
              <Textarea
                id="res-context"
                rows={3}
                placeholder="e.g. Focus on their upcoming security renewal and whether they use AWS or Azure..."
                value={newContext}
                onChange={(e) => setNewContext(e.target.value)}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNewDialogOpen(false)}
                disabled={isGenerating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isGenerating} className="gap-2">
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Synthesizing Dossier...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Dossier</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ResearchPage;
