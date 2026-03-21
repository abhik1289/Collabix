import { StatusCodes } from 'http-status-codes'


export type ErrorCode =
  | "VALIDATION_ERROR"
  |  "BAD_REQUEST"
  | "ZOD_VALIDATION_ERROR"
  | "INVALID_REQUEST"
  | "AUTHENTICATION_ERROR"
  | "INVALID_CREDENTIALS"
  | "TOKEN_EXPIRED"
  | "FORBIDDEN"
  | "RESOURCE_NOT_FOUND"
  | "RESOURCE_ALREADY_EXISTS"
  | "DATABASE_ERROR"
  | "DUPLICATE_KEY"
  | "EXTERNAL_SERVICE_ERROR"
  | "INTERNAL_SERVER_ERROR";


export class ApiError extends Error {
  public status: number
  public details?: any
  success: boolean;
  code: ErrorCode;

  constructor({
    message,
    code,
    status,
    details,
  }: {
    message: string
    code: ErrorCode
    status?: number
    details?: any

  }) {
    super(message)
    this.status = status ?? StatusCodes.BAD_REQUEST
    this.success = false
    this.details = details
    this.code = code
    Error.captureStackTrace(this, this.constructor)
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string,code?: ErrorCode) {
    super({ message, code:code??"RESOURCE_NOT_FOUND", status: StatusCodes.NOT_FOUND })
  }
}

export class BadRequestError extends ApiError {
  constructor({ message,code="BAD_REQUEST" }: { message: string,code?: ErrorCode }) {

    // console.log("=>>>>>",code)

    super({ message,code:code, status: StatusCodes.BAD_REQUEST })
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string,code?: ErrorCode) {
    super({ message,code:code??"AUTHENTICATION_ERROR", status: StatusCodes.UNAUTHORIZED })
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string,code?: ErrorCode) {
    super({ message,code:code??"FORBIDDEN", status: StatusCodes.FORBIDDEN })
  }
}


export class ZodValidationError extends ApiError {
  constructor(message: string,details?: any) {
    super({ message,code:"ZOD_VALIDATION_ERROR", status: StatusCodes.BAD_REQUEST,details })
  }
}

export class UnAuthenticatedError extends ApiError {
  constructor(message: string,code?: ErrorCode) {
    super({ message,code:code??"AUTHENTICATION_ERROR", status: StatusCodes.UNAUTHORIZED })
  }
}