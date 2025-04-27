"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { Transaction } from "@/lib/stores/transaction-store";
import { useCurrencyStore } from "@/lib/stores/currency-store";
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from "date-fns";

interface MonthlySpendingChartProps {
  transactions: Transaction[];
}

export function MonthlySpendingChart({ transactions }: MonthlySpendingChartProps) {
  const { currency } = useCurrencyStore();
  
  // Get the last 6 months
  const now = new Date();
  const sixMonthsAgo = subMonths(now, 5);
  
  const monthRange = eachMonthOfInterval({
    start: startOfMonth(sixMonthsAgo),
    end: endOfMonth(now),
  });
  
  // Create data for each month
  const data = monthRange.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    // Filter transactions for this month
    const monthTransactions = transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return date >= monthStart && date <= monthEnd;
    });
    
    // Calculate income and expenses
    const income = monthTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expenses = monthTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      name: format(month, "MMM"),
      income,
      expenses,
    };
  });
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded p-2 shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-green-500">
            Income: {formatCurrency(payload[0].value, currency)}
          </p>
          <p className="text-sm text-red-500">
            Expenses: {formatCurrency(payload[1].value, currency)}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
        <CardDescription>Income vs. expenses over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis 
                className="text-xs"
                tickFormatter={(value) => 
                  formatCurrency(value, currency, { notation: 'compact' })
                } 
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" fill="hsl(var(--chart-2))" name="Income" />
              <Bar dataKey="expenses" fill="hsl(var(--chart-1))" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}