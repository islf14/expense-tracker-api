import { UserModel } from '../models/mongodb/user.model.js'
import { validateRegister } from './user.validator.js'

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

  login = () => {}
}
