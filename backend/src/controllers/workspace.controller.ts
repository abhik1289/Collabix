
import { Request,Response } from "express"
import { asyncHandler } from "../utils/error/async-handler"
import { AuthUser } from "../types/express";
import { WorkSpaceService } from "../services/workspace.service";
import { ApiSuccess } from "../utils/api-success";
import { BadRequestError } from "../utils/error/error";
import { IAddMember} from "../validation/workspace";


const workSpaceService = new WorkSpaceService()


export const createWorkspaceHandler = asyncHandler(async (req:Request, res:Response) => {


    const {name,description} = req.body;
    const {id:userId} = req.user as AuthUser;


    const workspace = await workSpaceService.createWorkSpace({name,description},userId);

    const response = new ApiSuccess(workspace);

    res.status(201).json(response);


});


export const getWorkSpacesHandler = asyncHandler(async (req:Request, res:Response) => {


     const {id:userId} = req.user as AuthUser;

    const workspaces = await workSpaceService.getWorkSpaceById(userId);
    const response = new ApiSuccess(workspaces);
     res.status(200).json(response);
})

export const getWorkSpaceById = asyncHandler(async (req:Request, res:Response) => {


    const workspaceId = req.params.workspaceId as string;

    if(!workspaceId){
        throw new BadRequestError({message:"Workspace id is required"})
    }

    const workspace = await workSpaceService.getWorkSpaceById(workspaceId);
    const response = new ApiSuccess(workspace);

     res.status(200).json(response);
})


export const updateWorkSpaceHandler = asyncHandler(async (req:Request, res:Response) => {


    const workspaceId = req.params.workspaceId as string;
    const {id:userId} = req.user as AuthUser;

    // console.log(req.body)

    if(!workspaceId){
        throw new BadRequestError({message:"Workspace id is required"})
    }

    const workspace = await workSpaceService.updateWorkSpace(workspaceId,userId,req.body);
    const response = new ApiSuccess(workspace);

     res.status(200).json(response);

})

export const deleteWorkSpaceHandler = asyncHandler(async (req:Request, res:Response) => {


    const workspaceId = req.params.id as string;
    const {id:userId} = req.user as AuthUser;

    if(!workspaceId){
        throw new BadRequestError({message:"Workspace id is required"})
    }

    const workspace = await workSpaceService.deleteWorkSpace(workspaceId,userId);
    const response = new ApiSuccess(workspace);

    res.status(200).json(response);

})

export const joinWorkSpaceHandlerByJoinCodeHandler = asyncHandler(async (req:Request, res:Response) => {


    const workspaceId = req.params.id as string;
    const {joinCode} = req.body;
    const {id:userId} = req.user as AuthUser;


    if(!workspaceId || !joinCode){
        throw new BadRequestError({message:"Workspace id or join code is required"})
    }

    const workspace = await workSpaceService.joinWorkSpaceService(workspaceId,userId,joinCode);
    const response = new ApiSuccess(workspace); 

    res.status(200).json(response);


})

export const leaveWorkSpaceHandler = asyncHandler(async (req:Request, res:Response) => {

    const {workspaceId} = req.params as {workspaceId:string};
    
    const {id:userId} = req.user as AuthUser;

    if(!workspaceId || !userId){
        throw new BadRequestError({message:"Workspace id or user id missing"})
    }

     await workSpaceService.leaveWorkSpaceService(workspaceId,userId);
    const response = new ApiSuccess({
        message:"You have successfully left the workspace",
    });

    res.status(200).json(response);


})

export const getWorkSpaceMembersHandler = asyncHandler(async (req:Request, res:Response) => {

 const workspaceId = req.params.workspaceId as string;


    if(!workspaceId){
        throw new BadRequestError({message:"Workspace id is required"})
    }

    const workspace = await workSpaceService.getWorkSpaceMembersService(workspaceId);
    const response = new ApiSuccess(workspace);

     res.status(200).json(response);


})

export const getWorkSpaceChannelsHandler = asyncHandler(async (req:Request, res:Response) => {


    const workspaceId = req.params.workspaceId as string;


    if(!workspaceId){
        throw new BadRequestError({message:"Workspace id is required"})
    }

    const workspace = await workSpaceService.getWorkSpaceChannelsService(workspaceId);
    const response = new ApiSuccess(workspace);

     res.status(200).json(response);




})

export const addChannelWorkSpaceHandler = asyncHandler(async (req:Request, res:Response) => {
    const workspaceId = req.params.workspaceId as string;
    const {id:userId} = req.user as AuthUser;
    if(!workspaceId){
        throw new BadRequestError({message:"Workspace id is required"})
    }

    const {name} = req.body;

    await workSpaceService.addChannelToWorkSpace(workspaceId,name,userId);
   const response = new ApiSuccess({
       message:"Channel added to workspace successfully"
   });

     res.status(200).json(response);


})


export const deleteChannelToWorkSpaceHandler = asyncHandler(async (req:Request, res:Response) => {

    const workspaceId = req.params.workspaceId as string;
    const channelId = req.params.channelId as string;

    const {id:userId} = req.user as AuthUser;

    if(!workspaceId || !channelId){
        throw new BadRequestError({message:"Workspace id or channel id is required"})
    }

    const workspace = await workSpaceService.deleteChannelToWorkSpace(workspaceId,userId,channelId);
    const response = new ApiSuccess(workspace);
    res.status(200).json(response);
})

export const getWorkSpaceByUserIdHandler = asyncHandler(async (req:Request, res:Response) => {
    

    

    

    const {id:userId} = req.user as AuthUser;

    if(!userId)
{
    throw new BadRequestError({message:"User id is required"})
}
// console.log(userId)
    const workspace = await workSpaceService.getWorkSpaces(userId);
    const response = new ApiSuccess(workspace);

     res.status(200).json(response);




})


export const addMemberToWorkSpaceHandler = asyncHandler(async (req:Request, res:Response) => {
    const {workspaceId} = req.params as {workspaceId:string};

    const {memberId} = req.body as IAddMember;

    const {id:userId} = req.user as AuthUser;
  
    

    const workspace = await workSpaceService.addMemberToWorkSpaceService(workspaceId,userId,memberId);


    const response = new ApiSuccess(workspace);
     res.status(200).json(response);

})

