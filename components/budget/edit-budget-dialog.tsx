"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useBudgetStore, Budget } from "@/lib/stores/budget-store";
import { useCurrencyStore } from "@/lib/stores/currency-store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { formatCurrency } from "@/lib/utils";

interface EditBudgetDialogProps {
  budget: Budget;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditBudgetDialog({ budget, open, onOpenChange }: EditBudgetDialogProps) {
  const { updateBudget, deleteBudget } = useBudgetStore();
  const { currency } = useCurrencyStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    amount: String(budget.amount),
    period: budget.period,
  });
  
  const [errors, setErrors] = useState<{
    amount?: string;
  }>({});
  
  useEffect(() => {
    if (budget) {
      setFormData({
        amount: String(budget.amount),
        period: budget.period,
      });
    }
  }, [budget]);
  
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
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Update budget
    updateBudget(budget.id, {
      amount: Number(formData.amount),
      period: formData.period as "monthly" | "weekly" | "yearly",
    });
    
    // Show toast
    toast({
      title: "Budget updated",
      description: `${budget.category} - ${formatCurrency(Number(formData.amount), currency)} per ${formData.period}`,
    });
    
    // Close dialog
    onOpenChange(false);
  };
  
  const handleDelete = () => {
    deleteBudget(budget.id);
    
    // Show toast
    toast({
      title: "Budget deleted",
      description: `${budget.category} budget has been removed`,
    });
    
    // Close dialog
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Budget: {budget.category}</DialogTitle>
          <DialogDescription>
            Update your budget settings.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-amount" className="text-right">
              Amount
            </Label>
            <div className="col-span-3">
              <Input
                id="edit-amount"
                name="amount"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                className={errors.amount ? "border-destructive" : ""}
              />
              {errors.amount && (
                <p className="text-xs text-destructive mt-1">{errors.amount}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-period" className="text-right">
              Period
            </Label>
            <Select
              value={formData.period}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, period: value as "monthly" | "weekly" | "yearly" }))}
            >
              <SelectTrigger id="edit-period" className="col-span-3">
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
        <DialogFooter className="flex justify-between sm:justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Budget</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this budget? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save Changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}