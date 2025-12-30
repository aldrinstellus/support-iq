'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Mail, Lock, Chrome, AlertCircle, Sparkles, Loader2, Building2 } from 'lucide-react';

function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard/drafts';
  const error = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleDemoLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError('');

    try {
      await signIn('demo-login', {
        email,
        password,
        callbackUrl,
        redirect: true,
      });
    } catch {
      setLocalError('Invalid credentials. Use a demo email with password "demo"');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await signIn('google', { callbackUrl });
  };

  const handleMicrosoftLogin = async () => {
    setIsLoading(true);
    await signIn('microsoft-entra-id', { callbackUrl });
  };

  const demoAccounts = [
    { email: 'agent@demo.com', role: 'Support Agent' },
    { email: 'manager@demo.com', role: 'CS Manager' },
    { email: 'admin@demo.com', role: 'Admin' },
  ];

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">ITSS</h1>
        </div>
        <p className="text-muted-foreground">
          AI-Powered IT Support System
        </p>
      </div>

      {/* Error Message */}
      {(error || localError) && (
        <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-destructive font-medium">
              {error === 'OAuthAccountNotLinked'
                ? 'This email is already associated with another account.'
                : localError || 'An error occurred during sign in.'}
            </p>
          </div>
        </div>
      )}

      {/* Sign In Card */}
      <div className="glass-card rounded-lg border border-border bg-card/70 p-6 backdrop-blur-md">
        {/* Microsoft Entra ID Sign In - Primary SSO */}
        <button
          onClick={handleMicrosoftLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-[#0078D4] text-white font-medium hover:bg-[#106EBE] transition-colors disabled:opacity-50"
        >
          <Building2 className="h-5 w-5" />
          <span>Continue with Microsoft</span>
        </button>

        {/* Google Sign In - Alternative */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-border bg-card hover:bg-muted transition-colors disabled:opacity-50 mt-3"
        >
          <Chrome className="h-5 w-5" />
          <span className="font-medium">Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with demo</span>
          </div>
        </div>

        {/* Demo Login Form */}
        <form onSubmit={handleDemoLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@demo.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="demo"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Accounts */}
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground mb-3">Demo accounts (password: demo):</p>
          <div className="space-y-2">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                onClick={() => {
                  setEmail(account.email);
                  setPassword('demo');
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted text-sm transition-colors"
              >
                <span className="text-foreground">{account.email}</span>
                <span className="text-xs text-muted-foreground">{account.role}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground mt-6">
        Protected by NextAuth.js with Microsoft Entra ID &amp; Google OAuth
      </p>
    </div>
  );
}

function SignInLoading() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">ITSS</h1>
        </div>
        <p className="text-muted-foreground">
          AI-Powered IT Support System
        </p>
      </div>
      <div className="glass-card rounded-lg border border-border bg-card/70 p-6 backdrop-blur-md flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Suspense fallback={<SignInLoading />}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
