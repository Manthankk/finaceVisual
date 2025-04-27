"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon, TrendingUp, TrendingDown, Wallet, Target } from "lucide-react";
import { Transaction } from "@/lib/stores/transaction-store";
import { Budget } from "@/lib/stores/budget-store";
import { useCurrencyStore } from "@/lib/stores/currency-store";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

interface FinancialSummaryProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export function FinancialSummary({ transactions, budgets }: FinancialSummaryProps) {
  const { currency } = useCurrencyStore();
  
  // Filter transactions for the current month
  const now = new Date();
  const startMonth = startOfMonth(now);
  const endMonth = endOfMonth(now);
  
  const monthlyTransactions = transactions.filter(transaction => {
    const date = new Date(transaction.date);
    return isWithinInterval(date, { start: startMonth, end: endMonth });
  });
  
  // Calculate financial metrics
  const totalIncome = monthlyTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = monthlyTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const netSavings = totalIncome - totalExpenses;
  
  // Calculate total budget
  const totalBudget = budgets
    .filter(b => b.period === "monthly")
    .reduce((sum, b) => sum + b.amount, 0);
    
  const budgetUtilization = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Monthly Income
          </CardTitle>
          <ArrowUpIcon className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalIncome, currency)}</div>
          <p className="text-xs text-muted-foreground">
            Current month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Monthly Expenses
          </CardTitle>
          <ArrowDownIcon className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalExpenses, currency)}</div>
          <p className="text-xs text-muted-foreground">
            {budgetUtilization.toFixed(1)}% of total budget
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Savings</CardTitle>
          {netSavings >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(netSavings, currency)}</div>
          <p className="text-xs text-muted-foreground">
            {netSavings >= 0 ? "Net positive" : "Net negative"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Budget Status
          </CardTitle>
          <Target className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalBudget - totalExpenses, currency)}</div>
          <p className="text-xs text-muted-foreground">
            {totalBudget > 0 ? `${(100 - budgetUtilization).toFixed(1)}% remaining` : "No budgets set"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}