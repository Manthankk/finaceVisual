"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layouts/main-layout";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { FinancialSummary } from "@/components/dashboard/financial-summary";
import { TransactionList } from "@/components/transactions/transaction-list";
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown";
import { MonthlySpendingChart } from "@/components/dashboard/monthly-spending-chart";
import { useBudgetStore } from "@/lib/stores/budget-store";
import { useTransactionStore } from "@/lib/stores/transaction-store";
import { BudgetOverview } from "@/components/budget/budget-overview";

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { transactions } = useTransactionStore();
  const { budgets } = useBudgetStore();

  return (
    <MainLayout>
      <div className="space-y-8">
        <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {activeTab === "overview" && (
          <>
            <FinancialSummary transactions={transactions} budgets={budgets} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CategoryBreakdown transactions={transactions} />
              <MonthlySpendingChart transactions={transactions} />
            </div>
            <BudgetOverview />
            <TransactionList limit={5} showViewAll={true} />
          </>
        )}
        
        {activeTab === "transactions" && (
          <TransactionList showViewAll={false} />
        )}
        
        {activeTab === "budgets" && (
          <div className="space-y-6">
            <BudgetOverview />
          </div>
        )}
      </div>
    </MainLayout>
  );
}