import { Router } from 'express'
import { ExpenseController } from '../controllers/expense.controller.js'

const expenseController = new ExpenseController()

export const expenseRouter = Router()

expenseRouter.get('/', expenseController.getAll)
expenseRouter.post('/', expenseController.crete)
expenseRouter.put('/:id', expenseController.update)
expenseRouter.delete('/:id', expenseController.delete)
