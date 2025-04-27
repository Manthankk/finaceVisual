import { 
  ShoppingBag, 
  Utensils, 
  Home, 
  Car, 
  Tv, 
  Stethoscope, 
  Briefcase, 
  PiggyBank, 
  Droplets,
  Wifi,
  Glasses
} from "lucide-react";
import React from "react";

export const categories = [
  "Food", 
  "Shopping", 
  "Transport", 
  "Housing", 
  "Entertainment", 
  "Utilities", 
  "Healthcare", 
  "Income", 
  "Investments"
];

export const categoryColors: Record<string, string> = {
  Food: "hsl(var(--chart-1))",
  Shopping: "hsl(var(--chart-2))",
  Transport: "hsl(var(--chart-3))",
  Housing: "hsl(var(--chart-4))",
  Entertainment: "hsl(var(--chart-5))",
  Utilities: "hsl(220, 70%, 50%)",
  Healthcare: "hsl(280, 65%, 60%)",
  Income: "hsl(120, 60%, 45%)",
  Investments: "hsl(160, 60%, 45%)",
};

export function getCategoryIcon(category: string, size: number = 24) {
  switch (category) {
    case "Food":
      return <Utensils size={size} className="text-orange-500" />;
    case "Shopping":
      return <ShoppingBag size={size} className="text-blue-500" />;
    case "Transport":
      return <Car size={size} className="text-green-500" />;
    case "Housing":
      return <Home size={size} className="text-violet-500" />;
    case "Entertainment":
      return <Tv size={size} className="text-pink-500" />;
    case "Utilities":
      return <Wifi size={size} className="text-indigo-500" />;
    case "Healthcare":
      return <Stethoscope size={size} className="text-red-500" />;
    case "Income":
      return <Briefcase size={size} className="text-emerald-500" />;
    case "Investments":
      return <PiggyBank size={size} className="text-teal-500" />;
    default:
      return <ShoppingBag size={size} className="text-gray-500" />;
  }
}