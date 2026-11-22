import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/schemas';
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
  CheckCircle2,
  AlertCircle,
  Loader2,
  TrendingUp,
  Bot,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null);
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to sign in. Please verify your credentials and try again.');
      }
    }
  };

  const handleFillDemo = () => {
    setValue('email', 'demo@skarworld.com', { shouldValidate: true });
    setValue('password', 'password123', { shouldValidate: true });
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-muted/40 to-background p-4 sm:p-6 lg:p-8">
      {/* Background Decorative Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-70" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl opacity-70" />
      </div>

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Left Side: Brand & Feature Highlights (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 xl:p-10 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
          {/* Subtle Accent Glow */}
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
                Autonomous Revenue Intelligence & Sales Orchestration
              </h2>
              <p className="text-sm text-slate-300">
                Accelerate lead velocity, automate qualification, and close more pipeline with AI agents.
              </p>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="relative z-10 my-8 space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-indigo-500/20 p-1.5 text-indigo-300">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Autonomous Agent Qualification</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  AI agents engage inbound leads across WhatsApp, Email & SMS within seconds.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-indigo-500/20 p-1.5 text-indigo-300">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Predictive Pipeline Telemetry</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time deal health scoring, stage velocity, and AI win probability analytics.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-indigo-500/20 p-1.5 text-indigo-300">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Enterprise Agent Guardrails</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  SOC2-ready approval workflows for quotes, contracts, and discounts.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Social Proof */}
          <div className="relative z-10 pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>Orchestrating $312M+ in qualified sales pipeline</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
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

          <div className="space-y-2 mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Sign in to your workspace
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your enterprise credentials to access your sales automation cockpit.
            </p>
          </div>

          {/* Demo Hint Banner */}
          <div className="mb-6 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3.5 dark:bg-indigo-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-indigo-500" />
                <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                  Demo Credentials:
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  demo@skarworld.com / password123
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleFillDemo}
                className="h-7 text-xs px-2.5 font-medium border-indigo-500/30 hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
              >
                Auto-fill
              </Button>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium text-foreground">
                Work Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="alex.rivera@skarworld.com"
                  autoComplete="email"
                  className="pl-9"
                  error={!!errors.email}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium text-foreground">
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-primary hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="pl-9 pr-10"
                  error={!!errors.password}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(!!checked)}
              />
              <label
                htmlFor="remember"
                className="text-xs font-normal text-muted-foreground cursor-pointer select-none leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember this device for 30 days
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 mt-2 font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </Button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
            Don't have a workspace?{' '}
            <Link
              to="/register"
              className="font-medium text-primary hover:underline transition-colors inline-flex items-center gap-1"
            >
              <span>Create organization</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
