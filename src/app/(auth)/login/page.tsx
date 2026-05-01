'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, setToken } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Button, Input } from '@/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const { setToken: storeToken, setUser } = useAuthStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res =
        mode === 'login'
          ? await authApi.login(form.email, form.password)
          : await authApi.register(form.name, form.email, form.password);
      setToken(res.data.token);
      storeToken(res.data.token);
      setUser(res.data.user ?? { id: '', email: form.email, name: form.name });
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })
        ?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm bg-gray-900 rounded-2xl p-8 shadow-xl">
      <h1 className="text-3xl font-bold text-center text-white mb-2">💸 EDS Ledger</h1>
      <p className="text-center text-gray-400 mb-6 text-sm">Your AI-powered expense tracker</p>

      <div className="flex rounded-lg overflow-hidden mb-6 bg-gray-800">
        {(['login', 'register'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              mode === m ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {m === 'login' ? 'Sign In' : 'Register'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <Input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            maxLength={100}
          />
        )}
        <Input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          minLength={8}
        />

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <Button type="submit" loading={loading} className="w-full py-2.5">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>
    </div>
  );
}
