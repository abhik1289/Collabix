
import { Request,Response } from "express"
import { asyncHandler } from "../utils/error/async-handler"
import { AuthUser } from "../types/express";
import { WorkSpaceService } from "../services/workspace-service";
import { ApiSuccess } from "../utils/api-success";
import { BadRequestError } from "../utils/error/error";


const workSpaceService = new WorkSpaceService()


export const createWorkspaceHandler = asyncHandler(async (req:Request, res:Response) => {


    const {name,description} = req.body;
    const {id:userId} = req.user as AuthUser;


    const workspace = await workSpaceService.createWorkSpace({name,description},userId);

    const response = new ApiSuccess(workspace);

    res.status(201).json(response);


})


export const getWorkSpaceById = asyncHandler(async (req:Request, res:Response) => {


    const workspaceId = req.params.id as string;

    if(!workspaceId){
        throw new BadRequestError({message:"Workspace id is required"})
    }

    const workspace = await workSpaceService.getWorkSpaceById(workspaceId);
    const response = new ApiSuccess(workspace);

     res.status(200).json(response);
})


export const updateWorkSpaceHandler = asyncHandler(async (req:Request, res:Response) => {})

export const delteWorkSpaceHandler = asyncHandler(async (req:Request, res:Response) => {})

export const joinWorkSpaceHandlerByJoinCodeHandler = asyncHandler(async (req:Request, res:Response) => {})

export const leaveWorkSpaceHandler = asyncHandler(async (req:Request, res:Response) => {})


export const getWorkSpaceMembersHandler = asyncHandler(async (req:Request, res:Response) => {})

export const getWorkSpaceChannelsHandler = asyncHandler(async (req:Request, res:Response) => {})

export const addChannelWorkSpaceHandler = asyncHandler(async (req:Request, res:Response) => {})

export const getWorkSpaceByUserIdHandler = asyncHandler(async (req:Request, res:Response) => {
    

    

    const {userId} = req.params as {userId:string};

    const workspace = await workSpaceService.getWorkSpaceById(userId);
    const response = new ApiSuccess(workspace);

     res.status(200).json(response);




})


export const addMemberHandler = asyncHandler(async (req:Request, res:Response) => {
    const {workSpaceId,userId} = req.params as {workSpaceId:string,userId:string};
  
    

    const workspace = await workSpaceService.joinWorkSpaceService(workSpaceId,userId,req.body.joinCode);

})