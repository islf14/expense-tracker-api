import { UUID } from 'mongodb'
import { connection } from './connection.js'
import bcrypt from 'bcrypt'

async function connect() {
  try {
    const client = connection()
    await client.connect()
    const database = client.db('expenses')
    return database.collection('expense')
  } catch (error) {
    console.log({ error: error.message })
    console.error('Error connecting to the database')
    await client.close()
  }
}

export class UserModel {
  static async register({ input }) {
    const { name, email, password } = input
    const db = await connect()
    // verify that it is unique
    const userFound = await db.findOne({ email })
    if (userFound) throw new Error('user already exist')
    // create user
    const _id = new UUID()
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS)
    )
    const newUser = {
      _id,
      name,
      email,
      password: hashedPassword
    }
    const { insertedId } = await db.insertOne(newUser)
    return insertedId
  }

  static login() {}
}
