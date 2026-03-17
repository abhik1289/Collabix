import {Request,Response,NextFunction} from "express"
import { ZodObject } from 'zod'
import { asyncHandler } from '../utils/error/async-handler';



export const validation = (schema:ZodObject)=>{
    return asyncHandler(async (req:Request, _res:Response, next:NextFunction) => {
        try {
            await schema.parseAsync(req.body)
            next();
        } catch (error) {
            next(error)
        }
    })
}