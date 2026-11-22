import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import {
  Sparkles,
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RotateCcw,
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      // Simulate API call for password reset
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmittedEmail(data.email);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to send reset link. Please check the email and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-muted/40 to-background p-4 sm:p-6 lg:p-8">
      {/* Decorative Blur Spheres */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-70" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Top Brand Logo */}
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            SKARWORLD REVENUE OS
          </h2>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mt-0.5">
            Autonomous Sales Automation
          </p>
        </div>

        <Card className="border-border shadow-xl backdrop-blur-sm bg-card/95">
          {submittedEmail ? (
            /* Success State */
            <>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <CardTitle className="text-xl font-bold">Check your inbox</CardTitle>
                <CardDescription className="text-sm mt-1.5 leading-relaxed">
                  We've sent password reset instructions to{' '}
                  <span className="font-semibold text-foreground">{submittedEmail}</span>.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Didn't receive the email? Check your spam folder, or click below to request another link.
                </p>

                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSubmittedEmail(null)}
                    className="w-full text-xs font-medium gap-2"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Send another link</span>
                  </Button>
                </div>
              </CardContent>

              <CardFooter className="flex justify-center border-t border-border pt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Return to sign in</span>
                </Link>
              </CardFooter>
            </>
          ) : (
            /* Request Form State */
            <>
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl font-bold">Reset your password</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Enter your verified work email address and we will dispatch a secure recovery link.
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
                  <div className="space-y-1.5">
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
                        className="pl-9 text-sm"
                        error={!!errors.email}
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 font-medium"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Reset Link...
                      </>
                    ) : (
                      'Send Reset Instructions'
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
                  <span>Back to login</span>
                </Link>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
