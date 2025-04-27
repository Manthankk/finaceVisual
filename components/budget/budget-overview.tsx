"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBudgetStore, Budget } from "@/lib/stores/budget-store";
import { useTransactionStore } from "@/lib/stores/transaction-store";
import { formatCurrency } from "@/lib/utils";
import { useCurrencyStore } from "@/lib/stores/currency-store";
import { getCategoryIcon } from "@/lib/category-utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Check, PlusCircle } from "lucide-react";
import { AddBudgetDialog } from "@/components/budget/add-budget-dialog";
import { EditBudgetDialog } from "@/components/budget/edit-budget-dialog";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export function BudgetOverview() {
  const { budgets } = useBudgetStore();
  const { transactions } = useTransactionStore();
  const { currency } = useCurrencyStore();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  
  // Get monthly transactions
  const now = new Date();
  const startMonth = startOfMonth(now);
  const endMonth = endOfMonth(now);
  
  const monthlyTransactions = transactions.filter(transaction => {
    const date = new Date(transaction.date);
    return isWithinInterval(date, { start: startMonth, end: endMonth }) && transaction.type === "expense";
  });
  
  // Calculate spending by category
  const spendingByCategory = monthlyTransactions.reduce<Record<string, number>>((acc, transaction) => {
    const { category, amount } = transaction;
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {});
  
  return (
    <>
      <Card id="budgets">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Monthly Budgets</CardTitle>
            <CardDescription>Track your spending against budget limits</CardDescription>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Budget
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {budgets.length > 0 ? (
              budgets.map((budget) => {
                const spent = spendingByCategory[budget.category] || 0;
                const percentage = budget.amount > 0 ? Math.min(100, (spent / budget.amount) * 100) : 0;
                const remaining = budget.amount - spent;
                const isExceeded = remaining < 0;
                
                return (
                  <div
                    key={budget.id}
                    className="flex flex-col space-y-2 rounded-lg border p-4 transition-all hover:bg-accent"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(budget.category, 18)}
                        <span className="font-medium">{budget.category}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingBudget(budget)}
                      >
                        Edit
                      </Button>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Budget: {formatCurrency(budget.amount, currency)}</span>
                      <span 
                        className={isExceeded ? "text-destructive" : "text-muted-foreground"}
                      >
                        Spent: {formatCurrency(spent, currency)}
                      </span>
                    </div>
                    
                    <Progress value={percentage} className={isExceeded ? "bg-destructive/30" : ""} />
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span 
                          className={
                            isExceeded 
                              ? "text-destructive flex items-center" 
                              : "text-muted-foreground"
                          }
                        >
                          {isExceeded ? (
                            <>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Exceeded by {formatCurrency(Math.abs(remaining), currency)}
                            </>
                          ) : (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              {formatCurrency(remaining, currency)} remaining
                            </>
                          )}
                        </span>
                      </div>
                      <div className="text-sm font-medium">
                        {percentage.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="rounded-full bg-muted p-3">
                  <PlusCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No budgets set</h3>
                <p className="text-muted-foreground">
                  Set your first budget to start tracking your spending
                </p>
                <Button className="mt-4" onClick={() => setShowAddDialog(true)}>
                  Add Budget
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <AddBudgetDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
      
      {editingBudget && (
        <EditBudgetDialog
          budget={editingBudget}
          open={!!editingBudget}
          onOpenChange={() => setEditingBudget(null)}
        />
      )}
    </>
  );
}