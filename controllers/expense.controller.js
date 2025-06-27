import { ExpenseModel } from '../models/mongodb/expense.model.js'
import { validateExpense, validatePartialExpense } from './expense.validator.js'

export class ExpenseController {
  getAll = async (req, res) => {
    const { page, limit, start, end, filter } = req.query
    //set page and limit
    let pageNumber = parseInt(page)
    let nPerPage = parseInt(limit)
    if (isNaN(pageNumber) || pageNumber <= 0) pageNumber = 1
    if (isNaN(nPerPage) || nPerPage <= 0) nPerPage = 20

    // count all documents
    const count = await ExpenseModel.countAll({ userId: req.session.user._id })

    // date start and end in input
    const dateStart = new Date(start)
    const dateEnd = new Date(end)
    const now = new Date()
    let newDateStart
    let newDateEnd

    // filter is active when does exist start and end
    // last week  =pw    // past month =pm    // last three months =3m
    if (filter && isNaN(dateStart) && isNaN(dateEnd)) {
      if (filter === 'pw') {
        // get day of the week
        const dayWeek = now.getDay()
        // 86400000 is (1440 * 60000) // one day
        const pastWeek = new Date(now.getTime() - dayWeek * 86400000)
        // beginning of the day in UTC
        newDateStart = new Date(
          pastWeek.getFullYear(),
          pastWeek.getMonth(),
          pastWeek.getDate()
        )
      }
      if (filter === 'pm') {
        newDateStart = new Date(now.getFullYear(), now.getMonth())
      }
      if (filter === '3m') {
        newDateStart = new Date(now.getFullYear(), now.getMonth() - 2)
      }
    }
    // make start an end Date
    // difference UTC in minutes
    const diff = now.getTimezoneOffset()
    // beginning of the day in UTC
    if (!isNaN(dateStart))
      newDateStart = new Date(dateStart.getTime() + diff * 60000)
    // end of the day in UTC
    if (!isNaN(dateEnd)) {
      // 23 hours 59 minutes and 59 seconds
      // 1439 is (24h * 60min - 1min), 60000 is 1min, 59999 is 59.999 seconds
      const lastSecond = 1439 * 60000 + 59999
      newDateEnd = new Date(dateEnd.getTime() + lastSecond + diff * 60000)
    }

    // find in all documents in db
    try {
      const data = await ExpenseModel.getAll({
        userId: req.session.user._id,
        pageNumber,
        nPerPage,
        dateStart: newDateStart,
        dateEnd: newDateEnd
      })
      // return data
      const expense = {
        data,
        page: pageNumber,
        limit: nPerPage,
        start: newDateStart,
        end: newDateEnd,
        filter,
        total: count
      }
      res.json(expense)
    } catch (error) {
      console.log({ error: error.message })
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
