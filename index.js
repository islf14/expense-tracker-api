import express, { json } from 'express'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import { loginRouter, registerRouter } from './routes/user.route.js'
import { createExpenseRouter } from './routes/expense.route.js'

const app = express()
const port = process.env.PORT ?? 3000
app.disable('x-powered-by')
app.use(json())
app.use(cookieParser())

app.use('/register', registerRouter)
app.use('/login', loginRouter)
app.use('/expense', createExpenseRouter())
app.get('/', (req, res) => {
  res.json('Welcome')
})

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
