"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LineChart, WalletCards, Target, BarChart } from "lucide-react";

export function MainNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="hidden md:flex md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <BarChart className="h-6 w-6" />
        <span className="font-bold">Finance Visualizer</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/" ? "text-foreground" : "text-foreground/60"
          )}
        >
          <div className="flex items-center gap-1">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </div>
        </Link>
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("transactions")?.scrollIntoView({ behavior: "smooth" });
          }}
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/transactions") ? "text-foreground" : "text-foreground/60"
          )}
        >
          <div className="flex items-center gap-1">
            <WalletCards className="h-4 w-4" />
            <span>Transactions</span>
          </div>
        </Link>
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("budgets")?.scrollIntoView({ behavior: "smooth" });
          }}
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/budgets") ? "text-foreground" : "text-foreground/60"
          )}
        >
          <div className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            <span>Budgets</span>
          </div>
        </Link>
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("analytics")?.scrollIntoView({ behavior: "smooth" });
          }}
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/analytics") ? "text-foreground" : "text-foreground/60"
          )}
        >
          <div className="flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            <span>Analytics</span>
          </div>
        </Link>
      </nav>
    </div>
  );
}