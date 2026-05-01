export interface User {
  id: string;
  name: string;
  email: string;
  currency: string;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: string;
  source: 'manual' | 'csv';
  aiNote?: string;
  createdAt: string;
}

export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'subscriptions'
  | 'shopping'
  | 'health'
  | 'education'
  | 'utilities'
  | 'other';

export interface MonthlyReport {
  id: string;
  userId: string;
  year: number;
  month: number;
  score: number;
  scoreReason: string;
  summary: string;
  leaks: MoneyLeak[];
  wins: string[];
  categoryTotals: Record<ExpenseCategory, number>;
  generatedAt: string;
}

export interface MoneyLeak {
  name: string;
  amount: number;
  tip: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export const CATEGORY_COLORS: Record<string, string> = {
  food: 'bg-orange-500/20 text-orange-400',
  transport: 'bg-blue-500/20 text-blue-400',
  entertainment: 'bg-purple-500/20 text-purple-400',
  subscriptions: 'bg-yellow-500/20 text-yellow-400',
  shopping: 'bg-pink-500/20 text-pink-400',
  health: 'bg-green-500/20 text-green-400',
  education: 'bg-indigo-500/20 text-indigo-400',
  utilities: 'bg-gray-500/20 text-gray-400',
  other: 'bg-slate-500/20 text-slate-400',
};

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}
