import { UUID } from 'mongodb'
import { connection } from './connection.js'

async function connect() {
  try {
    const client = connection()
    await client.connect()
    const database = client.db('expenses')
    return database.collection('expense')
  } catch (error) {
    console.error('Error connecting to the database')
    await client.close()
  }
}

export class ExpenseModel {
  static async countAll({ userId }) {
    const db = await connect()
    try {
      const count = await db.countDocuments({ user_id: userId })
      return count
    } catch (error) {
      throw new Error('error count all')
    }
  }

  static async getAll({ userId, pageNumber, nPerPage, dateStart, dateEnd }) {
    const db = await connect()
    //// verify dateStart and dateEnd
    let query = {
      user_id: userId
    }
    if (!isNaN(dateStart) && isNaN(dateEnd)) {
      query = {
        user_id: userId,
        createdAt: { $gte: dateStart }
      }
    }
    if (isNaN(dateStart) && !isNaN(dateEnd)) {
      query = {
        user_id: userId,
        createdAt: { $lte: dateEnd }
      }
    }
    if (!isNaN(dateStart) && !isNaN(dateEnd)) {
      query = {
        user_id: userId,
        createdAt: { $gte: dateStart, $lte: dateEnd }
      }
    }
    /// get documents
    try {
      const data = await db
        .find(query)
        .sort({ createdAt: 1 })
        .skip(pageNumber > 1 ? (pageNumber - 1) * nPerPage : 0)
        .limit(nPerPage)
        .toArray()
      return data
    } catch (error) {
      console.log(error.message)
      throw new Error('error getting all expense')
    }
  }

  static async create({ input, userId }) {
    const db = await connect()
    const _id = new UUID()
    const newExpense = {
      _id,
      ...input,
      user_id: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const { insertedId } = await db.insertOne(newExpense)
    return insertedId
  }

  static async validateIdExpense({ id }) {
    const db = await connect()
    // verify valid ID
    let _id = null
    try {
      _id = new UUID(id)
    } catch (error) {
      throw new Error('ID must be 32 hex digits (UUID)')
    }
    // find expense to update
    const expense = await db.findOne({ _id })
    if (!expense) throw new Error('expense not found')
    return expense
  }

  static async update({ _id, input }) {
    const db = await connect()
    // updated data
    const updatedExpense = {
      ...input,
      updatedAt: new Date()
    }
    try {
      await db.updateOne({ _id }, { $set: updatedExpense })
      return updatedExpense
    } catch (error) {
      console.log(error.message)
      throw new Error('could not be updated')
    }
  }

  static async delete({ _id }) {
    const db = await connect()
    try {
      await db.deleteOne({ _id })
      return
    } catch (error) {
      console.log(error.message)
      throw new Error('could not be deleted')
    }
  }
}
