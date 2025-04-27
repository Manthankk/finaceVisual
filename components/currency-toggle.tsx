"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrencyStore } from "@/lib/stores/currency-store";

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrencyStore();
  
  const currencies = [
    { label: "USD ($)", value: "USD", symbol: "$" },
    { label: "EUR (€)", value: "EUR", symbol: "€" },
    { label: "GBP (£)", value: "GBP", symbol: "£" },
    { label: "INR (₹)", value: "INR", symbol: "₹" },
    { label: "JPY (¥)", value: "JPY", symbol: "¥" },
  ];

  const currentCurrency = currencies.find((c) => c.value === currency) || currencies[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-16">
          {currentCurrency.symbol}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currencies.map((c) => (
          <DropdownMenuItem key={c.value} onClick={() => setCurrency(c.value)}>
            {c.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}