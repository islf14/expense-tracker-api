import { Router } from 'express'
import { ExpenseController } from '../controllers/expense.controller.js'
import { expenseMiddleware } from '../middlewares/expense.middleware.js'

export const createExpenseRouter = () => {
  const expenseRouter = Router()
  const expenseController = new ExpenseController()

  expenseRouter.use(expenseMiddleware)
  expenseRouter.get('/', expenseController.getAll)
  expenseRouter.post('/', expenseController.crete)
  expenseRouter.put('/:id', expenseController.update)
  expenseRouter.delete('/:id', expenseController.delete)

  return expenseRouter
}
