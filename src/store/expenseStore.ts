import { create } from 'zustand';
import type { Expense } from '@/types';
import { expensesApi } from '@/lib/api';

interface ExpenseState {
  expenses: Expense[];
  loading: boolean;
  fetch: () => Promise<void>;
  add: (expense: Expense) => void;
  remove: (id: string) => void;
  reset: () => void;
}

export const useExpenseStore = create<ExpenseState>()((set) => ({
  expenses: [],
  loading: false,
  fetch: async () => {
    set({ loading: true });
    try {
      const res = await expensesApi.list();
      set({ expenses: res.data });
    } finally {
      set({ loading: false });
    }
  },
  add: (expense) =>
    set((state) => ({ expenses: [expense, ...state.expenses] })),
  remove: (id) =>
    set((state) => ({
      expenses: state.expenses.filter((e) => e.id !== id),
    })),
  reset: () => set({ expenses: [], loading: false }),
}));
