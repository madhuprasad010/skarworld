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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Product, ProductCategory, PricingModel, ProductFAQ } from '@/types';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Check,
  CheckCircle2,
  DollarSign,
  HelpCircle,
  Sparkles,
  Layers,
  ArrowRight,
  Eye,
} from 'lucide-react';

interface ExtendedProduct extends Product {
  aiInstructions?: string;
}

const INITIAL_PRODUCTS: ExtendedProduct[] = [
  {
    id: 'prod-001',
    name: 'Skarworld Revenue Copilot Core',
    code: 'SW-CORE-SaaS',
    category: 'Software',
    description:
      'Autonomous AI sales intelligence engine that captures inbound leads, qualifies prospect intent, and schedules high-value demo calls directly into rep calendars.',
    pricingModel: 'monthly',
    basePrice: 499,
    currency: 'USD',
    billingPeriod: 'per tenant / month',
    isActive: true,
    features: [
      'Omnichannel lead capture (WhatsApp, Telegram, Web)',
      'Autonomous conversational qualification',
      'Dynamic CRM sync with real-time lead scoring',
      'Custom intent classification models',
      'Instant calendar booking integrations',
    ],
    faq: [
      {
        question: 'How fast does the AI agent engage with inbound inquiries?',
        answer: 'Average response latency is under 3 seconds across WhatsApp, Telegram, and Webchat.',
      },
      {
        question: 'Does it sync with Salesforce and HubSpot?',
        answer: 'Yes, full bi-directional synchronization is supported with conflict resolution.',
      },
    ],
    aiInstructions:
      'Highlight 24/7 instant responsiveness. Target mid-market B2B companies struggling with lead follow-up lag time. Do not promise custom LLM fine-tuning on the Core tier.',
    tenantId: 'tenant-001',
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'prod-002',
    name: 'Enterprise Autonomous Outreach Engine',
    code: 'SW-ENT-OUT',
    category: 'Software',
    description:
      'High-throughput hyper-personalized cold outreach system leveraging multi-source prospect research, verified email infrastructure, and automated follow-up sequences.',
    pricingModel: 'annual',
    basePrice: 12000,
    currency: 'USD',
    billingPeriod: 'billed annually',
    isActive: true,
    features: [
      'Deep prospect dossier generation (Tavily/Brave research)',
      'Automated email warmup & deliverability protection',
      'Multi-touch dynamic email cadences',
      'AI objection anticipation and auto-draft replies',
      'Dedicated IP and enterprise custom domains',
    ],
    faq: [
      {
        question: 'What email volume is included per month?',
        answer: 'Up to 50,000 verified delivered emails per month with dedicated warmup pools.',
      },
    ],
    aiInstructions:
      'Focus on ROI and rep productivity savings. Emphasize that automated research prevents generic spam and maintains deliverability above 98%.',
    tenantId: 'tenant-001',
    createdAt: '2026-01-20T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'prod-003',
    name: 'Strategic RevOps & AI Sales Implementation',
    code: 'SW-CNS-STRAT',
    category: 'Consulting',
    description:
      'Hands-on architecture and implementation package led by senior revenue engineers to design custom qualification rubrics, playbook prompts, and CRM automations.',
    pricingModel: 'one_time',
    basePrice: 7500,
    currency: 'USD',
    billingPeriod: 'one-time engagement',
    isActive: true,
    features: [
      'Comprehensive 4-week workflow diagnostic',
      'Custom LLM prompt library & guardrail formulation',
      'Legacy CRM schema normalization & data migration',
      'Executive dashboard and attribution reporting setup',
    ],
    faq: [
      {
        question: 'What is the implementation timeline?',
        answer: 'Standard timeline is 4 weeks from kickoff to go-live with bi-weekly milestones.',
      },
    ],
    aiInstructions:
      'Recommend to enterprises with complex legacy CRMs or regulatory restrictions requiring specialized prompt guardrails.',
    tenantId: 'tenant-001',
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'prod-004',
    name: 'AI Sales Playbook Masterclass & Certification',
    code: 'SW-TRN-CERT',
    category: 'Training',
    description:
      'Interactive cohort-based training program certifying sales reps and SDR managers on AI copilot collaboration, prompt engineering for sales, and objection handling.',
    pricingModel: 'per_user',
    basePrice: 350,
    currency: 'USD',
    billingPeriod: 'per seat / cohort',
    isActive: true,
    features: [
      '8 live module sessions with certified revenue coaches',
      'Interactive playground roleplay simulators',
      'Official Skarworld Certified AI Seller badge',
      'Lifetime access to template updates & prompt library',
    ],
    faq: [
      {
        question: 'Are sessions recorded?',
        answer: 'Yes, full session recordings and workshop assignments are available on-demand.',
      },
    ],
    aiInstructions:
      'Upsell to customers with teams greater than 5 sales reps to accelerate user adoption and quota ramp times.',
    tenantId: 'tenant-001',
    createdAt: '2026-02-10T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'prod-005',
    name: '24/7 Enterprise Dedicated SLA Support',
    code: 'SW-SUP-247',
    category: 'Support',
    description:
      'Priority engineering escalation SLA with dedicated Slack/Teams connect channel, 15-minute response guarantee, and monthly prompt optimization reviews.',
    pricingModel: 'monthly',
    basePrice: 990,
    currency: 'USD',
    billingPeriod: 'per month',
    isActive: false,
    features: [
      '15-minute urgent incident response guarantee',
      'Dedicated Technical Account Manager (TAM)',
      'Direct Shared Slack/Teams channel',
      'Monthly agent prompt calibration & accuracy audit',
    ],
    faq: [
      {
        question: 'Is phone support included?',
        answer: 'Yes, tier-1 emergency phone bridge is provided for P1 outages.',
      },
    ],
    aiInstructions:
      'Currently waitlisted for new signups. Only quote with prior VP of Sales approval.',
    tenantId: 'tenant-001',
    createdAt: '2026-02-15T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'prod-006',
    name: 'Bespoke ERP & Core Banking Integration Gateway',
    code: 'SW-DEV-ERP',
    category: 'Custom Development',
    description:
      'Tailored middleware and secure connector development linking Skarworld AI decisioning to proprietary mainframe, SAP, Oracle, or on-premise banking systems.',
    pricingModel: 'custom',
    basePrice: 18500,
    currency: 'USD',
    billingPeriod: 'project-based',
    isActive: true,
    features: [
      'Custom zero-trust VPC peering & mTLS connectors',
      'HIPAA / PCI-DSS compliance architecture',
      'Custom webhook triggers & bi-directional ETL',
      'Full source-code escrow & deployment documentation',
    ],
    faq: [
      {
        question: 'Does this support on-premise deployments?',
        answer: 'Yes, agents can run in hybrid enclave or customer-managed Kubernetes clusters.',
      },
    ],
    aiInstructions:
      'Requires technical discovery call with Solutions Architect before issuing formal SOW.',
    tenantId: 'tenant-001',
    createdAt: '2026-02-20T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },
];

export default function ProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<ExtendedProduct[]>(INITIAL_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Detail Modal State
  const [selectedProduct, setSelectedProduct] = useState<ExtendedProduct | null>(null);

  // Create / Edit Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ExtendedProduct | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('Software');
  const [formDescription, setFormDescription] = useState('');
  const [formPricingModel, setFormPricingModel] = useState<PricingModel>('monthly');
  const [formBasePrice, setFormBasePrice] = useState<number>(499);
  const [formCurrency, setFormCurrency] = useState('USD');
  const [formBillingPeriod, setFormBillingPeriod] = useState('per month');
  const [formFeatures, setFormFeatures] = useState('');
  const [formAiInstructions, setFormAiInstructions] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Toggle availability on product card
  const handleToggleAvailability = (productId: string, currentStatus: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updated = !currentStatus;
          toast({
            title: updated ? 'Product Enabled' : 'Product Disabled',
            description: `"${p.name}" availability set to ${updated ? 'Active' : 'Inactive'}.`,
            variant: updated ? 'success' : 'default',
          });
          return { ...p, isActive: updated, updatedAt: new Date().toISOString() };
        }
        return p;
      })
    );
  };

  // Open Create Dialog
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCode(`SW-${Math.floor(100 + Math.random() * 900)}`);
    setFormCategory('Software');
    setFormDescription('');
    setFormPricingModel('monthly');
    setFormBasePrice(299);
    setFormCurrency('USD');
    setFormBillingPeriod('per month');
    setFormFeatures('AI Automation\nCRM Integration\nReal-time Analytics');
    setFormAiInstructions('');
    setFormIsActive(true);
    setFormErrors({});
    setIsFormOpen(true);
  };

  // Open Edit Dialog
  const handleOpenEdit = (prod: ExtendedProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCode(prod.code);
    setFormCategory(prod.category);
    setFormDescription(prod.description);
    setFormPricingModel(prod.pricingModel);
    setFormBasePrice(prod.basePrice);
    setFormCurrency(prod.currency);
    setFormBillingPeriod(prod.billingPeriod || '');
    setFormFeatures(prod.features.join('\n'));
    setFormAiInstructions(prod.aiInstructions || '');
    setFormIsActive(prod.isActive);
    setFormErrors({});
    setIsFormOpen(true);
  };

  // Save Product (Create or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!formName.trim()) errors.name = 'Product name is required';
    if (!formCode.trim()) errors.code = 'Product SKU code is required';
    if (!formDescription.trim()) errors.description = 'Description is required';
    if (formBasePrice < 0) errors.basePrice = 'Price must be positive';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const featureList = formFeatures
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formName.trim(),
                code: formCode.trim(),
                category: formCategory,
                description: formDescription.trim(),
                pricingModel: formPricingModel,
                basePrice: Number(formBasePrice),
                currency: formCurrency,
                billingPeriod: formBillingPeriod.trim() || undefined,
                features: featureList,
                aiInstructions: formAiInstructions.trim() || undefined,
                isActive: formIsActive,
                updatedAt: new Date().toISOString(),
              }
            : p
        )
      );
      toast({
        title: 'Product Updated',
        description: `"${formName.trim()}" has been saved.`,
      });
    } else {
      const newProduct: ExtendedProduct = {
        id: `prod-${Date.now()}`,
        name: formName.trim(),
        code: formCode.trim(),
        category: formCategory,
        description: formDescription.trim(),
        pricingModel: formPricingModel,
        basePrice: Number(formBasePrice),
        currency: formCurrency,
        billingPeriod: formBillingPeriod.trim() || undefined,
        features: featureList,
        faq: [],
        aiInstructions: formAiInstructions.trim() || undefined,
        isActive: formIsActive,
        tenantId: 'tenant-001',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProducts((prev) => [newProduct, ...prev]);
      toast({
        title: 'Product Created',
        description: `"${formName.trim()}" has been added to the catalog.`,
        variant: 'success',
      });
    }

    setIsFormOpen(false);
  };

  // Delete product
  const handleDeleteProduct = () => {
    if (!deletingProductId) return;
    setProducts((prev) => prev.filter((p) => p.id !== deletingProductId));
    toast({
      title: 'Product Removed',
      description: 'The product catalog item has been deleted.',
    });
    setDeletingProductId(null);
    if (selectedProduct?.id === deletingProductId) {
      setSelectedProduct(null);
    }
  };

  // Filter products by tab
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  const formatPrice = (prod: ExtendedProduct) => {
    if (prod.pricingModel === 'custom') {
      return (
        <span className="text-base font-bold text-foreground">
          Custom Enterprise Quote
        </span>
      );
    }

    const priceStr = `$${prod.basePrice.toLocaleString()}`;
    const periodStr =
      prod.pricingModel === 'monthly'
        ? '/mo'
        : prod.pricingModel === 'annual'
        ? '/yr'
        : prod.pricingModel === 'per_user'
        ? '/user/mo'
        : ' one-time';

    return (
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold text-foreground tracking-tight">{priceStr}</span>
        <span className="text-xs text-muted-foreground font-medium">{periodStr}</span>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Products & Services"
        description="Configure commercial catalog items, tier pricing models, SLAs, and AI copilot sales directives."
        icon={Package}
        actions={
          <Button onClick={handleOpenCreate} className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>
        }
      />

      {/* Tabs */}
      <div className="border-b pb-4">
        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="w-full"
        >
          <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0">
            {[
              'All',
              'Software',
              'Consulting',
              'Training',
              'Support',
              'Custom Development',
            ].map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="rounded-lg border px-3 py-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {cat}
                <span className="ml-1.5 opacity-60">
                  {cat === 'All'
                    ? products.length
                    : products.filter((p) => p.category === cat).length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            className={cn(
              'group relative flex flex-col justify-between rounded-xl border bg-card p-5 shadow-xs transition-all hover:shadow-md hover:border-primary/40 cursor-pointer',
              !product.isActive && 'opacity-75 bg-muted/20 border-dashed'
            )}
          >
            <div>
              {/* Card Top: Category Badge & Availability Switch */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <Badge variant="outline" className="text-2xs font-semibold uppercase tracking-wider">
                  {product.category}
                </Badge>

                {/* Availability Toggle */}
                <div
                  onClick={(e) => handleToggleAvailability(product.id, product.isActive, e)}
                  className="flex items-center gap-1.5 cursor-pointer rounded-full px-2 py-0.5 transition-colors hover:bg-muted"
                  title="Click to toggle availability"
                >
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full',
                      product.isActive ? 'bg-emerald-500 ring-2 ring-emerald-500/20' : 'bg-destructive ring-2 ring-destructive/20'
                    )}
                  />
                  <span
                    className={cn(
                      'text-2xs font-medium',
                      product.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
                    )}
                  >
                    {product.isActive ? 'Available' : 'Paused'}
                  </span>
                </div>
              </div>

              {/* Title & SKU */}
              <div className="space-y-1 mb-2">
                <h3 className="font-semibold text-foreground text-base tracking-tight group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <span className="text-2xs text-muted-foreground font-mono block">
                  {product.code}
                </span>
              </div>

              {/* Description (2 lines truncated) */}
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Features List (first 3) */}
              <div className="space-y-1.5 mb-4 border-t pt-3">
                <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Key Capabilities
                </span>
                {product.features.slice(0, 3).map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-foreground/90">
                    <Check className="h-3 w-3 text-primary shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
                {product.features.length > 3 && (
                  <span className="text-2xs text-muted-foreground italic">
                    +{product.features.length - 3} more features
                  </span>
                )}
              </div>
            </div>

            {/* Bottom: Pricing & Actions */}
            <div className="border-t pt-3 flex items-center justify-between gap-2 mt-2">
              <div>{formatPrice(product)}</div>

              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => setSelectedProduct(product)}
                  title="View details"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={(e) => handleOpenEdit(product, e)}
                  title="Edit product"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletingProductId(product.id);
                  }}
                  title="Delete product"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      <Dialog
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedProduct && (
            <div className="space-y-5">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline">{selectedProduct.category}</Badge>
                  <span
                    className={cn(
                      'text-xs font-semibold flex items-center gap-1',
                      selectedProduct.isActive ? 'text-emerald-600' : 'text-destructive'
                    )}
                  >
                    <span
                      className={cn(
                        'h-2 w-2 rounded-full',
                        selectedProduct.isActive ? 'bg-emerald-500' : 'bg-destructive'
                      )}
                    />
                    {selectedProduct.isActive ? 'Active in Catalog' : 'Paused'}
                  </span>
                </div>
                <DialogTitle className="text-xl font-bold">
                  {selectedProduct.name}
                </DialogTitle>
                <span className="text-xs text-muted-foreground font-mono">
                  SKU: {selectedProduct.code}
                </span>
              </DialogHeader>

              {/* Pricing banner */}
              <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3.5 border">
                <div>
                  <span className="text-2xs font-semibold uppercase text-muted-foreground block">
                    Commercial Terms
                  </span>
                  <div className="mt-0.5">{formatPrice(selectedProduct)}</div>
                </div>
                {selectedProduct.billingPeriod && (
                  <span className="text-xs text-muted-foreground capitalize">
                    {selectedProduct.billingPeriod}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Description
                </h4>
                <p className="text-sm text-foreground leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              {/* All Features */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Included Features & Entitlements
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProduct.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 rounded-md border bg-card p-2 text-xs"
                    >
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Instructions / Pitch Directives */}
              {selectedProduct.aiInstructions && (
                <div className="rounded-lg border border-indigo-500/30 bg-indigo-50/40 dark:bg-indigo-950/20 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-950 dark:text-indigo-200">
                      AI Agent Positioning Directives
                    </h4>
                  </div>
                  <p className="text-xs text-foreground/90 leading-relaxed italic">
                    "{selectedProduct.aiInstructions}"
                  </p>
                </div>
              )}

              {/* FAQs */}
              {selectedProduct.faq && selectedProduct.faq.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4" />
                    Frequently Asked Questions
                  </h4>
                  <div className="space-y-2">
                    {selectedProduct.faq.map((item, idx) => (
                      <div key={idx} className="rounded-lg border bg-muted/20 p-3 space-y-1 text-xs">
                        <div className="font-semibold text-foreground">Q: {item.question}</div>
                        <div className="text-muted-foreground">A: {item.answer}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <DialogFooter className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const prod = selectedProduct;
                    setSelectedProduct(null);
                    setEditingProduct(prod);
                    setFormName(prod.name);
                    setFormCode(prod.code);
                    setFormCategory(prod.category);
                    setFormDescription(prod.description);
                    setFormPricingModel(prod.pricingModel);
                    setFormBasePrice(prod.basePrice);
                    setFormCurrency(prod.currency);
                    setFormBillingPeriod(prod.billingPeriod || '');
                    setFormFeatures(prod.features.join('\n'));
                    setFormAiInstructions(prod.aiInstructions || '');
                    setFormIsActive(prod.isActive);
                    setIsFormOpen(true);
                  }}
                  className="gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Product
                </Button>
                <Button onClick={() => setSelectedProduct(null)}>Done</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create / Edit Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product & Pricing' : 'Add New Product to Catalog'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveProduct} className="space-y-4 pt-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="prod-name">Product Name *</Label>
                <Input
                  id="prod-name"
                  placeholder="e.g. Autonomous AI Voice Qualification"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className={formErrors.name ? 'border-destructive' : ''}
                />
                {formErrors.name && (
                  <p className="text-xs text-destructive">{formErrors.name}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prod-code">SKU Code *</Label>
                <Input
                  id="prod-code"
                  placeholder="SW-VCE-01"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  className={formErrors.code ? 'border-destructive' : ''}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="prod-category">Category</Label>
                <Select
                  value={formCategory}
                  onValueChange={(val) => setFormCategory(val as ProductCategory)}
                >
                  <SelectTrigger id="prod-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Software">Software</SelectItem>
                    <SelectItem value="Consulting">Consulting</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                    <SelectItem value="Custom Development">Custom Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prod-pricing-model">Pricing Model</Label>
                <Select
                  value={formPricingModel}
                  onValueChange={(val) => setFormPricingModel(val as PricingModel)}
                >
                  <SelectTrigger id="prod-pricing-model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly Subscription</SelectItem>
                    <SelectItem value="annual">Annual Subscription</SelectItem>
                    <SelectItem value="one_time">One-Time Fee</SelectItem>
                    <SelectItem value="per_user">Per User / Seat</SelectItem>
                    <SelectItem value="custom">Custom Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="prod-price">Base Price ($ USD) *</Label>
                <Input
                  id="prod-price"
                  type="number"
                  min="0"
                  step="1"
                  value={formBasePrice}
                  onChange={(e) => setFormBasePrice(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prod-period">Billing Period Label</Label>
                <Input
                  id="prod-period"
                  placeholder="e.g. per month, one-time"
                  value={formBillingPeriod}
                  onChange={(e) => setFormBillingPeriod(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prod-desc">Description *</Label>
              <Textarea
                id="prod-desc"
                rows={3}
                placeholder="Detailed customer-facing description..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className={formErrors.description ? 'border-destructive' : ''}
              />
              {formErrors.description && (
                <p className="text-xs text-destructive">{formErrors.description}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prod-features">Features (One per line)</Label>
              <Textarea
                id="prod-features"
                rows={4}
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                value={formFeatures}
                onChange={(e) => setFormFeatures(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prod-ai-instructions">AI Sales Agent Instructions</Label>
              <Textarea
                id="prod-ai-instructions"
                rows={2}
                placeholder="Directives for AI agents when pitching this item (e.g. target buyer, discount limits)..."
                value={formAiInstructions}
                onChange={(e) => setFormAiInstructions(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="prod-status">Active in Sales Catalog</Label>
                <p className="text-xs text-muted-foreground">
                  When enabled, AI agents and reps can quote this product in proposals.
                </p>
              </div>
              <Switch
                id="prod-status"
                checked={formIsActive}
                onCheckedChange={setFormIsActive}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!deletingProductId}
        onOpenChange={(open) => !open && setDeletingProductId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove this product from the commercial catalog. Active proposals referencing this product will retain snapshot terms.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
