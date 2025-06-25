import { UserModel } from '../models/mongodb/user.model.js'
import { validateLogin, validateRegister } from './user.validator.js'
import jwt from 'jsonwebtoken'

export class UserController {
  register = async (req, res) => {
    if (!req.body)
      return res.status(400).json({ message: 'please enter valid values' })
    const result = validateRegister(req.body)
    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    try {
      const insertedId = await UserModel.register({ input: result.data })
      console.log(insertedId)
      return res.status(201).json({ insertedId })
    } catch (error) {
      console.log({ error: error.message })
      return res.status(400).json({ error: 'error in register' })
    }
  }

  login = async (req, res) => {
    if (!req.body)
      return res.status(400).json({ message: 'please enter valid values' })
    const result = validateLogin(req.body)
    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    try {
      const user = await UserModel.login({ input: result.data })
      // generate token
      const token = jwt.sign(
        {
          _id: user._id,
          name: user.name,
          email: user.email
        },
        process.env.SIGN_JWT_SECRET,
        {
          expiresIn: '1h'
        }
      )
      // set token with cookie
      return res
        .status(200)
        .cookie('access_expense', token, {
          maxAge: 1000 * 60 * 60,
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production'
        })
        .send({ token })
    } catch (error) {
      console.log({ error: error.message })
      return res.status(400).json({ error: 'error in login' })
    }
  }
}
