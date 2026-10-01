import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, Sparkles } from 'lucide-react';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const Login = () => {
  useDocumentTitle('Sign In');
  const navigate = useNavigate();
  const { login } = useCart();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.login({ email, password });
      login(response.user);
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail('alex.vance@studio-aurelia.co');
    setPassword('aurelia-demo-password');
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT COLUMN: Lifestyle / Brand Visual (5 cols) */}
        <div className="relative hidden lg:block lg:col-span-5 bg-neutral-950 p-10 text-white flex flex-col justify-between overflow-hidden">
          {/* Background image with subtle overlay */}
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80"
            alt="AURELIA Watch Lifestyle"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />

          {/* Top Wordmark */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-1.5 focus:outline-none">
              <span className="font-bold text-xl tracking-[0.28em] uppercase text-white">
                AURELIA
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            </Link>
          </div>

          {/* Bottom Editorial Quote */}
          <div className="relative z-10 space-y-3">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-stone-400">
              Member Sanctuary
            </p>
            <p className="text-xl font-light leading-snug text-stone-100">
              &ldquo;Simplicity is not the lack of clutter, but the presence of purpose.&rdquo;
            </p>
            <p className="text-xs text-stone-400 font-light">
              Track your acquisitions, manage studio addresses, and unlock private archival drops.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Login Form (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-stone-500">
                Welcome Back
              </span>
              <h1 className="text-2xl sm:text-3xl font-light text-neutral-950 mt-1">
                Sign into <span className="font-semibold">AURELIA</span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Enter your credentials to access your orders and profile.
              </p>
            </div>

            {/* Quick Fill Demo Banner for internship reviewers */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-stone-700">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Internship Demo Account</span>
              </div>
              <button
                type="button"
                onClick={fillDemoAccount}
                className="font-semibold text-neutral-900 hover:text-neutral-600 underline cursor-pointer"
              >
                1-Click Quick Fill
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                required
                icon={Mail}
                placeholder="alex.vance@studio-aurelia.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Password"
                type="password"
                required
                icon={Lock}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-neutral-900 rounded"
                  />
                  <span>Remember my terminal</span>
                </label>

                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset link simulated: Please check your inbox.');
                  }}
                  className="font-medium text-neutral-700 hover:text-neutral-950 underline"
                >
                  Forgot password?
                </a>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  className="group shadow-md"
                >
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </form>

            <p className="text-center text-xs text-neutral-500 pt-4 border-t border-stone-100">
              Don&apos;t have a membership yet?{' '}
              <Link to="/register" className="font-semibold text-neutral-950 hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
