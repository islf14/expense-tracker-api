import jwt from 'jsonwebtoken'

export function expenseMiddleware(req, res, next) {
  let token
  // token from authorization
  if (req.headers.authorization) {
    const auth = req.headers.authorization
    if (auth.toLowerCase().startsWith('bearer ')) {
      token = auth.substring(7)
    }
  }
  // token from cookie
  if (req.cookies.access_expense) {
    token = req.cookies.access_expense
  }
  //
  req.session = { user: null }
  if (token) {
    try {
      const user = jwt.verify(token, process.env.SIGN_JWT_SECRET)
      req.session.user = user
      return next()
    } catch (error) {
      console.log({ error: error.message })
    }
  }
  return res.status(401).json({ message: 'Unauthorized' })
}
