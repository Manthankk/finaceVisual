"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useBudgetStore } from "@/lib/stores/budget-store";
import { useCurrencyStore } from "@/lib/stores/currency-store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "@/lib/category-utils";
import { formatCurrency } from "@/lib/utils";

interface AddBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddBudgetDialog({ open, onOpenChange }: AddBudgetDialogProps) {
  const { addBudget, budgets } = useBudgetStore();
  const { currency } = useCurrencyStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    period: "monthly" as "monthly" | "weekly" | "yearly",
  });
  
  const [errors, setErrors] = useState<{
    amount?: string;
    category?: string;
  }>({});
  
  // Filter out categories that already have a budget
  const availableCategories = categories.filter(
    (category) => !budgets.some((budget) => budget.category === category)
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleSubmit = () => {
    // Validate form
    const newErrors: typeof errors = {};
    
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }
    
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Add budget
    addBudget({
      amount: Number(formData.amount),
      category: formData.category,
      period: formData.period,
    });
    
    // Show toast
    toast({
      title: "Budget added",
      description: `${formData.category} - ${formatCurrency(Number(formData.amount), currency)} per ${formData.period}`,
    });
    
    // Reset form and close dialog
    setFormData({
      amount: "",
      category: "",
      period: "monthly",
    });
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Budget</DialogTitle>
          <DialogDescription>
            Create a new budget to track your spending.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <div className="col-span-3">
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, category: value }));
                  if (errors.category) {
                    setErrors((prev) => ({ ...prev, category: undefined }));
                  }
                }}
                disabled={availableCategories.length === 0}
              >
                <SelectTrigger id="category" className={errors.category ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.length > 0 ? (
                    availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="">
                      All categories have budgets
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-destructive mt-1">{errors.category}</p>
              )}
              {availableCategories.length === 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  All categories already have budgets
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <div className="col-span-3">
              <Input
                id="amount"
                name="amount"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                className={errors.amount ? "border-destructive" : ""}
                disabled={availableCategories.length === 0}
              />
              {errors.amount && (
                <p className="text-xs text-destructive mt-1">{errors.amount}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="period" className="text-right">
              Period
            </Label>
            <Select
              value={formData.period}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, period: value as "monthly" | "weekly" | "yearly" }))}
              disabled={availableCategories.length === 0}
            >
              <SelectTrigger id="period" className="col-span-3">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={availableCategories.length === 0}
          >
            Save Budget
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}