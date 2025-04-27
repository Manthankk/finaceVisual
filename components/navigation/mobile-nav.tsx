"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LayoutDashboard, LineChart, WalletCards, Target, BarChart } from "lucide-react";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0">
          <Link
            href="/"
            className="flex items-center"
            onClick={() => setOpen(false)}
          >
            <BarChart className="h-6 w-6 mr-2" />
            <span className="font-bold">Finance Visualizer</span>
          </Link>
          <div className="flex flex-col space-y-3 mt-8">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/"
              onClick={() => {
                setOpen(false);
                setTimeout(() => {
                  document.getElementById("transactions")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
            >
              <WalletCards className="h-5 w-5" />
              <span>Transactions</span>
            </Link>
            <Link
              href="/"
              onClick={() => {
                setOpen(false);
                setTimeout(() => {
                  document.getElementById("budgets")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
            >
              <Target className="h-5 w-5" />
              <span>Budgets</span>
            </Link>
            <Link
              href="/"
              onClick={() => {
                setOpen(false);
                setTimeout(() => {
                  document.getElementById("analytics")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
            >
              <LineChart className="h-5 w-5" />
              <span>Analytics</span>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}