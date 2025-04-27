"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { Transaction } from "@/lib/stores/transaction-store";
import { useCurrencyStore } from "@/lib/stores/currency-store";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { categoryColors, getCategoryIcon } from "@/lib/category-utils";

interface CategoryBreakdownProps {
  transactions: Transaction[];
}

export function CategoryBreakdown({ transactions }: CategoryBreakdownProps) {
  const { currency } = useCurrencyStore();
  const [period, setPeriod] = useState<"monthly" | "all">("monthly");
  
  // Filter transactions based on the selected period
  let filteredTransactions = transactions;
  
  if (period === "monthly") {
    const now = new Date();
    const startMonth = startOfMonth(now);
    const endMonth = endOfMonth(now);
    
    filteredTransactions = transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return isWithinInterval(date, { start: startMonth, end: endMonth });
    });
  }
  
  // Only include expenses
  filteredTransactions = filteredTransactions.filter(t => t.type === "expense");
  
  // Group transactions by category
  const categoryMap = filteredTransactions.reduce<Record<string, number>>((acc, transaction) => {
    const { category, amount } = transaction;
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {});
  
  // Convert to array for chart
  const data = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
  }));
  
  // Sort by value descending
  data.sort((a, b) => b.value - a.value);
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      return (
        <div className="bg-background border rounded p-2 shadow-md">
          <p className="font-medium">{name}</p>
          <p className="text-sm">{formatCurrency(value, currency)}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Spending by Category</CardTitle>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPeriod("monthly")}
              className={`text-xs px-2 py-1 rounded ${
                period === "monthly" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPeriod("all")}
              className={`text-xs px-2 py-1 rounded ${
                period === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}
            >
              All Time
            </button>
          </div>
        </div>
        <CardDescription>
          {period === "monthly" ? "Current month breakdown" : "All time breakdown"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={categoryColors[entry.name] || `hsl(var(--chart-${(index % 5) + 1}))`} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No expense data available</p>
          </div>
        )}
        <div className="mt-4 space-y-2">
          {data.slice(0, 5).map((category) => (
            <div key={category.name} className="flex justify-between items-center">
              <div className="flex items-center">
                {getCategoryIcon(category.name, 16)}
                <span className="ml-2 text-sm">{category.name}</span>
              </div>
              <span className="text-sm font-medium">
                {formatCurrency(category.value, currency)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}