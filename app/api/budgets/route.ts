import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import { Budget } from '@/lib/db/models/Budget';

export async function GET() {
  try {
    await dbConnect();
    const budgets = await Budget.find({});
    return NextResponse.json(budgets);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const budget = await Budget.create(data);
    return NextResponse.json(budget);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 });
  }
}