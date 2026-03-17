
import { Request, Response, NextFunction } from "express";
import { ApiError, ZodValidationError } from "../utils/error/error";
import { ZodError } from "zod";
// import { error } from "node:console";



export const errorMiddleware = (error: any, _req: Request, res: Response, _next: NextFunction) => {
    if(error instanceof ApiError) {
        return res.status(error.status).json({
            message: error.message,
            code: error.code,
            status: error.status,
            details: error.details,
            success: false
        })
    };
    if(error instanceof ZodError) {
        const err = error.issues.map((issue) => ({
            path: issue.path,
            message: issue.message
        }));
        res.status(400).json( new ZodValidationError('Validation Error', err));
    };
    return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    statusCode: 500
  });

}