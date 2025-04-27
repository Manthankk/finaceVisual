"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { format, subDays, differenceInDays } from "date-fns";

export type Transaction = {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: "income" | "expense";
};

type TransactionState = {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
};

// Generate sample transactions for the last 60 days
const generateSampleTransactions = (): Transaction[] => {
  const categories = [
    "Food", "Shopping", "Transport", "Housing", "Entertainment", 
    "Utilities", "Healthcare", "Income", "Investments"
  ];
  
  const transactions: Transaction[] = [];
  const today = new Date();
  
  // Generate random transactions for each day in the last 60 days
  for (let i = 0; i < 60; i++) {
    const date = subDays(today, i);
    const formattedDate = format(date, "yyyy-MM-dd");
    
    // Number of transactions for this day (1-3)
    const numTransactions = Math.floor(Math.random() * 3) + 1;
    
    for (let j = 0; j < numTransactions; j++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const isIncome = category === "Income" || category === "Investments";
      
      const transaction: Transaction = {
        id: uuidv4(),
        amount: Math.floor(Math.random() * 200) + 10,
        description: `${isIncome ? "Monthly" : "Daily"} ${category}`,
        category,
        date: formattedDate,
        type: isIncome ? "income" : "expense"
      };
      
      transactions.push(transaction);
    }
  }
  
  return transactions;
};

// Create the store with persistence
export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: generateSampleTransactions(),
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            { ...transaction, id: uuidv4() },
            ...state.transactions,
          ],
        })),
      updateTransaction: (id, transaction) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...transaction } : t
          ),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
    }),
    {
      name: "transactions-storage",
    }
  )
);