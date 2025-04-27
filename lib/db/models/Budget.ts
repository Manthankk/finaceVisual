import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  period: {
    type: String,
    enum: ['monthly', 'weekly', 'yearly'],
    required: true,
  },
}, {
  timestamps: true,
});

export const Budget = mongoose.models.Budget || mongoose.model('Budget', BudgetSchema);