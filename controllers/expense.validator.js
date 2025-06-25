import { z } from 'zod/v4'

const Expense = z.object({
  description: z.string().min(4),
  amount: z.number().min(0),
  category: z.enum([
    'Groceries',
    'Leisure',
    'Electronics',
    'Utilities',
    'Clothing',
    'Health',
    'Others'
  ])
})

export function validateExpense(input) {
  return Expense.safeParse(input)
}

export function validatePartialExpense(input) {
  return Expense.partial().safeParse(input)
}
