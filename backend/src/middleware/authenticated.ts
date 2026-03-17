

import {NextFunction,Request,Response} from "express"
import { verifyAccessToken } from "../utils/token";
import User from "../models/user.model";
import { AuthUser } from "../types/express";


export const isAuthenticated =async (req:Request,res:Response,next:NextFunction) =>{


    const token =  req.headers['x-access-token'] as string;
    if(!token) return res.status(401).json({message:"Unauthorized"});


    const payload = verifyAccessToken(token);


    if(!payload)
    {
        return res.status(401).json({message:"Unauthorized"});
    }
    

    const findUser = await User.findById(payload.id);
    if(!findUser)
    {
        return res.status(401).json({message:"Unauthorized"});
    }


    // const req.user as 


    req.user as {
        id:string,
        name:string,
        email:string
    }

    req.user = {
        id:payload.id,
        name:findUser.name,
        email:findUser.email
    } as AuthUser

    next();



}