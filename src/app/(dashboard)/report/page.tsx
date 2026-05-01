'use client';

import { useEffect, useState } from 'react';
import { reportsApi } from '@/lib/api';
import { formatIDR, type MonthlyReport } from '@/types';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function scoreColor(score: number) {
  if (score >= 80) return 'text-green-400';
  if (score >= 50) return 'text-yellow-400';
  return 'text-red-400';
}

export default function ReportPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchReport();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchReport = async () => {
    setLoading(true);
    setNotFound(false);
    setReport(null);
    try {
      const res = await reportsApi.get(year, month);
      setReport(res.data);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 404) setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await reportsApi.generate(year, month);
      setReport(res.data);
      setNotFound(false);
    } catch {
      alert('Failed to generate report. Make sure you have expenses for this period.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="px-8 py-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Edda&apos;s Monthly Report</h2>

      <div className="flex items-center gap-3 mb-6">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-sm"
        >
          {MONTHS.map((m, i) => (
            <option key={i} value={i + 1}>{m}</option>
          ))}
        </select>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-24 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-sm"
          min={2020}
          max={2100}
        />
        <button
          onClick={fetchReport}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm font-semibold transition"
        >
          Load
        </button>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold transition disabled:opacity-50"
        >
          {generating ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {loading && <p className="text-gray-500 text-sm">Loading...</p>}

      {notFound && !loading && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
          <p className="text-gray-400">No report for {MONTHS[month - 1]} {year}.</p>
          <p className="text-gray-500 text-sm mt-1">Click &quot;Generate&quot; to create one with AI.</p>
        </div>
      )}

      {report && (
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
            <p className="text-xs text-gray-400 mb-1">Financial Health Score</p>
            <p className={`text-6xl font-bold ${scoreColor(report.score)}`}>{report.score}</p>
            <p className="text-gray-400 text-sm mt-2 italic">{report.scoreReason}</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <h3 className="font-semibold mb-2">Summary</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{report.summary}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <h3 className="font-semibold text-green-400 mb-3">✅ Wins</h3>
              <ul className="space-y-1">
                {report.wins.map((w, i) => (
                  <li key={i} className="text-sm text-gray-300">• {w}</li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <h3 className="font-semibold text-red-400 mb-3">🚨 Leaks</h3>
              <ul className="space-y-1">
                {report.leaks.map((l, i) => (
                  <li key={i} className="text-sm text-gray-300">• <span className="font-medium">{l.name}</span> — {l.tip}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <h3 className="font-semibold mb-3">Spending by Category</h3>
            <div className="space-y-2">
              {Object.entries(report.categoryTotals)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, total]) => (
                  <div key={cat} className="flex justify-between text-sm">
                    <span className="capitalize text-gray-300">{cat}</span>
                    <span className="font-medium">{formatIDR(total as number)}</span>
                  </div>
                ))}
            </div>
          </div>

          <p className="text-xs text-gray-600 text-center">
            Generated {new Date(report.generatedAt).toLocaleString('id-ID')}
          </p>
        </div>
      )}
    </div>
  );
}
