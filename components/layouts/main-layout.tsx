"use client";

import { ReactNode } from "react";
import { MainNav } from "@/components/navigation/main-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { CurrencyToggle } from "@/components/currency-toggle";
import { MobileNav } from "@/components/navigation/mobile-nav";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <CurrencyToggle />
            <ModeToggle />
          </div>
          <MobileNav />
        </div>
      </header>
      <main className="flex-1 container py-6 md:py-10">
        {children}
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 Personal Finance Visualizer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}