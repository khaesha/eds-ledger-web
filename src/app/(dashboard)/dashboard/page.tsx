'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import StatCard from '@/components/ui/StatCard';
import ScoreRing from '@/components/ui/ScoreRing';
import { reportsApi } from '@/lib/api';
import { formatIDR, type MonthlyReport, type ExpenseCategory } from '@/types';

const CHART_COLORS: Record<string, string> = {
  food: '#F59E0B',
  transport: '#3B82F6',
  entertainment: '#8B5CF6',
  subscriptions: '#A78BFA',
  shopping: '#EC4899',
  health: '#10B981',
  education: '#6366F1',
  utilities: '#64748B',
  other: '#6B7280',
};

const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function DashboardPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    reportsApi.get(year, month)
      .then((res) => setReport(res.data))
      .catch(() => setReport(null))
      .finally(() => setLoading(false));
  }, [year, month]);

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    try {
      const res = await reportsApi.generate(year, month);
      setReport(res.data);
    } catch {
      setError('Ed failed to generate the report. Try again later.');
    } finally {
      setGenerating(false);
    }
  }

  const categoryData = report
    ? Object.entries(report.categoryTotals)
        .filter(([, amount]) => amount > 0)
        .map(([cat, amount]) => ({
          name: cat.charAt(0).toUpperCase() + cat.slice(1),
          amount,
          color: CHART_COLORS[cat as ExpenseCategory] ?? '#6B7280',
        }))
    : [];

  const total = categoryData.reduce((s, d) => s + d.amount, 0);
  const topCategory = categoryData.sort((a, b) => b.amount - a.amount)[0];
  const leakCount = report?.leaks.length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-edward-muted text-sm mt-1">
            Ed&apos;s financial bounty report — {MONTH_NAMES[month]} {year}
          </p>
        </div>
        {!loading && (
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="ed-btn text-sm disabled:opacity-50"
          >
            {generating ? 'Generating…' : report ? '↻ Regenerate' : '✨ Generate Report'}
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      {loading ? (
        <div className="text-edward-muted text-sm">Loading report…</div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Spent"
              value={report ? formatIDR(total) : '—'}
              icon="💸"
              trend="neutral"
              trendLabel={report ? `${categoryData.length} categories` : 'No report yet'}
            />
            <StatCard
              label="Spending Score"
              value={report ? `${report.score} / 100` : '—'}
              icon="🎯"
              trend="neutral"
              trendLabel={report?.scoreReason ?? 'Generate a report'}
            />
            <StatCard
              label="Money Leaks"
              value={report ? `${leakCount} found` : '—'}
              icon="🔍"
              trend={leakCount > 0 ? 'up' : 'neutral'}
              trendLabel={leakCount > 0 ? `Ed spotted ${leakCount} issue${leakCount > 1 ? 's' : ''}` : 'No leaks found'}
            />
            <StatCard
              label="Top Category"
              value={topCategory?.name ?? '—'}
              icon="🍜"
              trend="neutral"
              trendLabel={topCategory ? formatIDR(topCategory.amount) + ' this month' : 'No data'}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="ed-card lg:col-span-2">
              <h2 className="text-white font-semibold mb-4">Spending by Category</h2>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={categoryData} barSize={36}>
                    <XAxis dataKey="name" stroke="#6B7280" tick={{ fontSize: 12 }} />
                    <YAxis
                      stroke="#6B7280"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => 'Rp' + v / 1000 + 'k'}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: 8,
                        color: '#fff',
                      }}
                      formatter={(v) => [formatIDR(Number(v)), 'Amount']}
                    />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                      {categoryData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-60 text-edward-muted text-sm">
                  No expenses recorded this month yet.
                </div>
              )}
            </div>

            <div className="ed-card flex flex-col items-center justify-center gap-4">
              <h2 className="text-white font-semibold self-start">Edda&apos;s Verdict</h2>
              {report ? (
                <>
                  <div className="relative flex flex-col items-center">
                    <ScoreRing score={report.score} size={130} />
                    <p className="absolute top-10 text-3xl font-bold text-white">
                      {report.score}
                    </p>
                  </div>
                  <p className="text-edward-muted text-xs text-center">
                    {report.summary}
                  </p>
                  <a href="/report" className="ed-btn text-sm w-full text-center">
                    View Full Report →
                  </a>
                </>
              ) : (
                <p className="text-edward-muted text-sm text-center">
                  No report generated yet. Click &quot;Generate Report&quot; to let Ed analyse your spending.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
