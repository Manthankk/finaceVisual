"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export type Budget = {
  id: string;
  category: string;
  amount: number;
  period: "monthly" | "weekly" | "yearly";
};

type BudgetState = {
  budgets: Budget[];
  addBudget: (budget: Omit<Budget, "id">) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
};

const sampleBudgets: Budget[] = [
  {
    id: uuidv4(),
    category: "Food",
    amount: 400,
    period: "monthly",
  },
  {
    id: uuidv4(),
    category: "Housing",
    amount: 1200,
    period: "monthly",
  },
  {
    id: uuidv4(),
    category: "Transport",
    amount: 200,
    period: "monthly",
  },
  {
    id: uuidv4(),
    category: "Entertainment",
    amount: 150,
    period: "monthly",
  },
  {
    id: uuidv4(),
    category: "Shopping",
    amount: 300,
    period: "monthly",
  },
  {
    id: uuidv4(),
    category: "Utilities",
    amount: 250,
    period: "monthly",
  },
];

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set) => ({
      budgets: sampleBudgets,
      addBudget: (budget) =>
        set((state) => ({
          budgets: [...state.budgets, { ...budget, id: uuidv4() }],
        })),
      updateBudget: (id, budget) =>
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === id ? { ...b, ...budget } : b
          ),
        })),
      deleteBudget: (id) =>
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        })),
    }),
    {
      name: "budgets-storage",
    }
  )
);