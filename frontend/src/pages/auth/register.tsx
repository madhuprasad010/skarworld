import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '@/schemas';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Sparkles,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Building2,
  Check,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('password') || '';

  // Calculate password strength
  const hasMinLength = passwordValue.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasNumber = /[0-9]/.test(passwordValue);
  const hasSpecial = /[^A-Za-z0-9]/.test(passwordValue);

  const strengthScore = [hasMinLength, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (!passwordValue) return { label: 'Password strength', color: 'text-muted-foreground', bg: 'bg-muted' };
    if (strengthScore <= 1) return { label: 'Weak', color: 'text-destructive', bg: 'bg-destructive' };
    if (strengthScore === 2) return { label: 'Fair', color: 'text-amber-500', bg: 'bg-amber-500' };
    if (strengthScore === 3) return { label: 'Good', color: 'text-indigo-500', bg: 'bg-indigo-500' };
    return { label: 'Strong', color: 'text-emerald-500', bg: 'bg-emerald-500' };
  };

  const strengthInfo = getStrengthLabel();

  const onSubmit = async (data: RegisterFormData) => {
    if (!acceptedTerms) {
      setTermsError('You must accept the terms of service and privacy policy to continue.');
      return;
    }
    setTermsError(null);
    setErrorMessage(null);
    setIsLoading(true);

    try {
      // Simulate tenant creation & user registration
      await new Promise((resolve) => setTimeout(resolve, 800));
      await login(data.email, data.password);
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to create account. Please try again or contact support.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-muted/40 to-background p-4 sm:p-6 lg:p-8">
      {/* Decorative Blur Spheres */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-70" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl opacity-70" />
      </div>

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Left Side: Brand & Feature Highlights */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 xl:p-10 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />

          {/* Brand Header */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-white">
                  SKARWORLD
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-indigo-300">
                  REVENUE OS
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white leading-tight">
                Transform Sales Operations with Autonomous AI
              </h2>
              <p className="text-sm text-slate-300">
                Join forward-thinking enterprise revenue teams deploying AI agents that capture, qualify, and close.
              </p>
            </div>
          </div>

          {/* Highlights */}
          <div className="relative z-10 my-8 space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-indigo-500/20 p-1.5 text-indigo-300">
                <Cpu className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Dedicated AI Agents</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pre-configured autonomous agents custom-trained on your product catalog and sales playbook.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-indigo-500/20 p-1.5 text-indigo-300">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Multi-Tenant Architecture</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Strict cryptographic tenant isolation, role-based controls, and complete data sovereignty.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-indigo-500/20 p-1.5 text-indigo-300">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">14-Day Enterprise Trial</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Full access to omnichannel engagement, lead intelligence, and executive dashboards.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Card */}
          <div className="relative z-10 pt-6 border-t border-slate-800/80">
            <div className="rounded-lg bg-slate-800/50 p-3 border border-slate-700/50">
              <p className="text-xs text-slate-300 italic">
                "SKARWORLD replaced 4 disjointed outbound tools and boosted qualified pipeline by 142% in 60 days."
              </p>
              <p className="text-[11px] text-indigo-300 font-medium mt-1">
                — Elena Rostova, VP of Global Sales Ops
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:col-span-7 flex flex-col justify-center p-6 sm:p-10 lg:p-12">
          {/* Mobile Header Branding */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-foreground">
                SKARWORLD
              </span>
              <span className="ml-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Revenue OS
              </span>
            </div>
          </div>

          <div className="space-y-1 mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Create your organization
            </h1>
            <p className="text-sm text-muted-foreground">
              Deploy your multi-tenant sales automation instance in under 2 minutes.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-medium text-foreground">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Alex Rivera"
                    autoComplete="name"
                    className="pl-9 text-sm"
                    error={!!errors.name}
                    {...register('name')}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Company Name */}
              <div className="space-y-1.5">
                <Label htmlFor="company" className="text-xs font-medium text-foreground">
                  Company Name
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="company"
                    type="text"
                    placeholder="Acme Global Inc"
                    autoComplete="organization"
                    className="pl-9 text-sm"
                    error={!!errors.company}
                    {...register('company')}
                  />
                </div>
                {errors.company && (
                  <p className="text-xs text-destructive">{errors.company.message}</p>
                )}
              </div>
            </div>

            {/* Work Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-foreground">
                Work Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="alex@acme.com"
                  autoComplete="email"
                  className="pl-9 text-sm"
                  error={!!errors.email}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 chars, 1 uppercase, 1 number"
                  autoComplete="new-password"
                  className="pl-9 pr-10 text-sm"
                  error={!!errors.password}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}

              {/* Password Strength Indicator */}
              {passwordValue && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Strength:</span>
                    <span className={`font-semibold ${strengthInfo.color}`}>
                      {strengthInfo.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        strengthScore >= 1 ? strengthInfo.bg : 'bg-transparent'
                      }`}
                    />
                    <div
                      className={`h-full rounded-full transition-all ${
                        strengthScore >= 2 ? strengthInfo.bg : 'bg-transparent'
                      }`}
                    />
                    <div
                      className={`h-full rounded-full transition-all ${
                        strengthScore >= 3 ? strengthInfo.bg : 'bg-transparent'
                      }`}
                    />
                    <div
                      className={`h-full rounded-full transition-all ${
                        strengthScore >= 4 ? strengthInfo.bg : 'bg-transparent'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-medium text-foreground">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className="pl-9 pr-10 text-sm"
                  error={!!errors.confirmPassword}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="pt-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => {
                    setAcceptedTerms(!!checked);
                    if (checked) setTermsError(null);
                  }}
                  className="mt-0.5"
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-muted-foreground leading-relaxed cursor-pointer select-none"
                >
                  I agree to the{' '}
                  <span className="text-primary hover:underline font-medium">Terms of Service</span>,{' '}
                  <span className="text-primary hover:underline font-medium">Privacy Policy</span>, and{' '}
                  data processing agreement.
                </label>
              </div>
              {termsError && (
                <p className="text-xs text-destructive mt-1.5">{termsError}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 mt-3 font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Workspace...
                </>
              ) : (
                <>
                  <span>Create Workspace & Start Trial</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center text-xs text-muted-foreground">
            Already have an active account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline transition-colors"
            >
              Sign in to workspace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
