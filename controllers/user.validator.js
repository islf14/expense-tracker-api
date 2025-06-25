import { z } from 'zod/v4'

const registerUser = z.object({
  name: z.string().min(4),
  email: z.email(),
  password: z.string().min(4)
})

const loginUser = z.object({
  email: z.email(),
  password: z.string().min(4)
})

export function validateRegister(input) {
  return registerUser.safeParse(input)
}

export function validateLogin(input) {
  return loginUser.safeParse(input)
}
