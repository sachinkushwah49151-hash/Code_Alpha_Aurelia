import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const Register = () => {
  useDocumentTitle('Create Account');
  const navigate = useNavigate();
  const { login } = useCart();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please provide your full name');
      return;
    }
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!agreed) {
      setError('Please accept our terms of service to continue');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.register({ fullName, email, password });
      login(response.user);
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT COLUMN: Brand Lifestyle Visual (5 cols) */}
        <div className="relative hidden lg:block lg:col-span-5 bg-neutral-950 p-10 text-white flex flex-col justify-between overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=80"
            alt="NOVA Atelier Craft"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />

          {/* Top Wordmark */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-1.5 focus:outline-none">
              <span className="font-bold text-xl tracking-[0.28em] uppercase text-white">
                NOVA
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </Link>
          </div>

          {/* Bottom Editorial Copy */}
          <div className="relative z-10 space-y-3">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-stone-400">
              Join The Cohort
            </p>
            <p className="text-xl font-light leading-snug text-stone-100">
              &ldquo;Good design is as little design as possible.&rdquo;
            </p>
            <p className="text-xs text-stone-400 font-light">
              Become a verified collector. Enjoy priority dispatch, complimentary tailoring consultations,
              and private releases.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Registration Form (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-stone-500">
                New Membership
              </span>
              <h1 className="text-2xl sm:text-3xl font-light text-neutral-950 mt-1">
                Create your <span className="font-semibold">account</span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Register to track your shipments and receive archival release privileges.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                required
                icon={User}
                placeholder="Alex Vance"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <Input
                label="Email Address"
                type="email"
                required
                icon={Mail}
                placeholder="alex.vance@studio-nova.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  type="password"
                  required
                  icon={Lock}
                  placeholder="At least 6 chars"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  required
                  icon={Lock}
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-neutral-600">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="accent-neutral-900 rounded mt-0.5"
                  />
                  <span>
                    I agree to the NOVA Privacy Policy and acknowledge the 30-day trial terms.
                  </span>
                </label>
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
                  <span>Create account</span>
                  <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </form>

            <p className="text-center text-xs text-neutral-500 pt-4 border-t border-stone-100">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-neutral-950 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
