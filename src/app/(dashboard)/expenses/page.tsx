'use client';

import { useEffect, useRef, useState } from 'react';
import { expensesApi } from '@/lib/api';
import { useExpenseStore } from '@/store/expenseStore';
import { formatIDR, CATEGORY_COLORS, type Expense } from '@/types';
import { Button, Card, Input, Badge } from '@/components/ui';

export default function ExpensesPage() {
  const { expenses, loading, fetch, remove } = useExpenseStore();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ description: '', amount: '', date: '' });
  const [formError, setFormError] = useState('');
  const [importing, setImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const amount = parseInt(form.amount);
    if (isNaN(amount) || amount <= 0) {
      setFormError('Amount must be a positive number');
      return;
    }
    setAdding(true);
    try {
      await expensesApi.create({
        description: form.description,
        amount,
        date: form.date || new Date().toISOString().slice(0, 10),
      });
      setForm({ description: '', amount: '', date: '' });
      fetch();
    } catch {
      setFormError('Failed to add expense');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this expense?')) return;
    await expensesApi.remove(id);
    remove(id);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      await expensesApi.importCsv(fd);
      fetch();
    } catch {
      alert('CSV import failed');
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="px-8 py-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Expenses</h2>

      <Card className="mb-6">
        <h3 className="font-semibold mb-4">Add Expense</h3>
        <form onSubmit={handleAdd} className="space-y-3">
          <Input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            maxLength={500}
          />
          <div className="flex gap-3">
            <Input
              type="number"
              placeholder="Amount (IDR)"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
              min={1}
              className="flex-1"
            />
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="flex-1"
            />
          </div>
          {formError && <p className="text-red-400 text-xs">{formError}</p>}
          <Button type="submit" loading={adding} className="w-full py-2">
            Add Expense
          </Button>
        </form>

        <div className="mt-4 pt-4 border-t border-gray-800">
          <p className="text-xs text-gray-400 mb-2">Or import CSV (columns: description, amount, date)</p>
          <input ref={fileRef} type="file" accept=".csv" onChange={handleImport} className="hidden" />
          <Button
            variant="secondary"
            onClick={() => fileRef.current?.click()}
            loading={importing}
            className="w-full py-2"
          >
            Import CSV
          </Button>
        </div>
      </Card>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : expenses.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">
          No expenses yet. Add your first one above!
        </p>
      ) : (
        <div className="space-y-2">
          {expenses.map((exp: Expense) => (
            <Card
              key={exp.id}
              padding="sm"
              className="flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <Badge
                    label={exp.category}
                    className={CATEGORY_COLORS[exp.category] ?? 'bg-gray-700 text-gray-300'}
                  />
                  <span className="text-xs text-gray-500">
                    {new Date(exp.date).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <p className="text-sm truncate">{exp.description}</p>
                {exp.aiNote && (
                  <p className="text-xs text-gray-500 mt-0.5 italic">{exp.aiNote}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold text-sm">{formatIDR(exp.amount)}</p>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="text-xs text-red-500 hover:text-red-400 mt-0.5"
                >
                  Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
