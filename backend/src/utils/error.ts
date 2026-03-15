import { StatusCodes } from 'http-status-codes'

class ClientError extends Error {
  public status?: number
  public details?: any

  constructor({
    message,
    status,
    details,
  }: {
    message: string
    status?: number
    details?: any
  }) {
    super(message)
    this.status = status ?? StatusCodes.BAD_REQUEST
    this.details = details
    Error.captureStackTrace(this, this.constructor)
  }
}

export class NotFoundError extends ClientError {
  constructor(message: string) {
    super({ message, status: StatusCodes.NOT_FOUND })
  }
}

export class BadRequestError extends ClientError {
  constructor(message: string) {
    super({ message, status: StatusCodes.BAD_REQUEST })
  }
}

export class UnauthorizedError extends ClientError {
  constructor(message: string) {
    super({ message, status: StatusCodes.UNAUTHORIZED })
  }
}

export class ForbiddenError extends ClientError {
  constructor(message: string) {
    super({ message, status: StatusCodes.FORBIDDEN })
  }
}
