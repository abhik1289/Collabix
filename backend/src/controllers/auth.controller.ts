import { AuthService } from '../services/auth.service'
import { ApiSuccess } from '../utils/api-success'
import { asyncHandler } from '../utils/error/async-handler'
// import { signInSchema } from '../validation/auth'

const authService = new AuthService()

export const signUpHandler = asyncHandler(async (req, res) => {
  const user = await authService.signUp(req.body)

  const response = new ApiSuccess(user)

  res.status(201).json(response)
})

export const signInHandler = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const { accessToken, refreshToken } = await authService.signIn(
    email,
    password,
  )

  res.cookie('accessToken', accessToken, { httpOnly: true })
  res.cookie('refreshToken', refreshToken, { httpOnly: true })

  const response = new ApiSuccess({ accessToken, refreshToken })

  res.status(200).json(response)
})
