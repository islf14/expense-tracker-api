import { Router } from 'express'
import { UserController } from '../controllers/user.controller.js'

const userController = new UserController()

export const registerRouter = Router()
registerRouter.post('/', userController.register)

export const loginRouter = Router()
loginRouter.post('/', userController.login)
