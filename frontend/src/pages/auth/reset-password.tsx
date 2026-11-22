import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import {
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('password') || '';
  const confirmPasswordValue = watch('confirmPassword') || '';

  // Checklist validation flags
  const reqLength = passwordValue.length >= 8;
  const reqUpper = /[A-Z]/.test(passwordValue);
  const reqNumber = /[0-9]/.test(passwordValue);
  const reqMatch = passwordValue.length > 0 && passwordValue === confirmPasswordValue;

  const onSubmit = async (_data: ResetPasswordFormData) => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      // Simulate password reset API request
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSuccess(true);
      // Automatically redirect after 2.5 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to reset password. The link may have expired.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-muted/40 to-background p-4 sm:p-6 lg:p-8">
      {/* Ambient background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-70" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            SKARWORLD REVENUE OS
          </h2>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mt-0.5">
            Security & Authentication
          </p>
        </div>

        <Card className="border-border shadow-xl backdrop-blur-sm bg-card/95">
          {isSuccess ? (
            /* Success State */
            <>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <CardTitle className="text-xl font-bold">Password Reset Successful</CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Your credentials have been securely updated. Redirecting you to the sign-in screen...
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-2">
                <Button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full h-10 font-medium"
                >
                  Sign In Immediately
                </Button>
              </CardContent>
            </>
          ) : (
            /* Reset Password Form */
            <>
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl font-bold">Set new password</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Choose a robust password to safeguard your sales automation organization.
                </CardDescription>
              </CardHeader>

              <CardContent>
                {errorMessage && (
                  <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-destructive text-xs">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* New Password */}
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs font-medium text-foreground">
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
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
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-xs font-medium text-foreground">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
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

                  {/* Password Requirements Checklist */}
                  <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Security Requirements
                    </p>
                    <ul className="space-y-1.5 text-xs">
                      <li className="flex items-center gap-2">
                        {reqLength ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500 stroke-[3]" />
                        ) : (
                          <X className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        <span className={reqLength ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                          At least 8 characters in length
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        {reqUpper ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500 stroke-[3]" />
                        ) : (
                          <X className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        <span className={reqUpper ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                          At least one uppercase letter (A-Z)
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        {reqNumber ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500 stroke-[3]" />
                        ) : (
                          <X className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        <span className={reqNumber ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                          At least one numeric digit (0-9)
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        {reqMatch ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500 stroke-[3]" />
                        ) : (
                          <X className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        <span className={reqMatch ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                          Passwords must match exactly
                        </span>
                      </li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 font-medium"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      'Update Password & Sign In'
                    )}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="flex justify-center border-t border-border pt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Return to login</span>
                </Link>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
