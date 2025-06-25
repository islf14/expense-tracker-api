import { ExpenseModel } from '../models/mongodb/expense.model.js'
import { validateExpense, validatePartialExpense } from './expense.validator.js'

export class ExpenseController {
  getAll = async (req, res) => {
    const { page, limit } = req.query
    //set page and limit
    let pageNumber = parseInt(page)
    let nPerPage = parseInt(limit)
    if (isNaN(pageNumber) || pageNumber <= 0) pageNumber = 1
    if (isNaN(nPerPage) || nPerPage <= 0) nPerPage = 20

    // count all documents
    const count = await ExpenseModel.countAll({ userId: req.session.user._id })
    // find in all documents in db
    try {
      const data = await ExpenseModel.getAll({
        userId: req.session.user._id,
        pageNumber,
        nPerPage
      })
      // return data
      const expense = {
        data,
        page: pageNumber,
        limit: nPerPage,
        total: count
      }
      res.json(expense)
    } catch (error) {
      console.log(error.message)
      return res.status(400).json('error getting all')
    }
  }

  crete = async (req, res) => {
    if (!req.body)
      return res.status(400).json({ message: 'please enter valid values' })
    const result = validateExpense(req.body)
    if (result.error)
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    try {
      const insertedId = await ExpenseModel.create({
        input: result.data,
        userId: req.session.user._id
      })
      return res.json({ insertedId })
    } catch (error) {
      console.log({ error: error.message })
      return res.status(400).json('error in create')
    }
  }

  update = async (req, res) => {
    if (!req.body)
      return res.status(400).json({ message: 'please enter valid values' })
    const result = validatePartialExpense(req.body)
    if (result.error)
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    const { id } = req.params

    // verify valid ID
    let expense
    try {
      expense = await ExpenseModel.validateIdExpense({ id })
    } catch (error) {
      console.log({ error: error.message })
      return res.status(400).json({ error: error.message })
    }

    // verify permission
    if (expense.user_id === req.session.user._id) {
      // send idExpense and data to Update
      try {
        const updated = await ExpenseModel.update({
          _id: expense._id,
          input: result.data
        })
        return res.json({ updated })
      } catch (error) {
        console.log({ error: error.message })
        return res.status(400).json({ error: error.message })
      }
    } else {
      return res.status(403).json({ message: 'Forbidden' })
    }
  }

  delete = async (req, res) => {
    const { id } = req.params
    // verify valid ID
    let expense
    try {
      expense = await ExpenseModel.validateIdExpense({ id })
    } catch (error) {
      console.log({ error: error.message })
      return res.status(400).json({ error: error.message })
    }
    // verify permission
    if (expense.user_id === req.session.user._id) {
      try {
        await ExpenseModel.delete({ _id: expense._id })
        return res.status(204).json('deleted')
      } catch (error) {
        console.log({ error: error.message })
        return res.status(400).json({ error: error.message })
      }
    } else {
      return res.status(403).json({ message: 'Forbidden' })
    }
  }
}
