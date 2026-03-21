import express from 'express'
import { createWorkspaceHandler, getWorkSpaceById, getWorkSpaceMembersHandler, updateWorkSpaceHandler,deleteWorkSpaceHandler, joinWorkSpaceHandlerByJoinCodeHandler, leaveWorkSpaceHandler, getWorkSpaceChannelsHandler, addChannelWorkSpaceHandler, getWorkSpaceByUserIdHandler, addMemberToWorkSpaceHandler, deleteChannelToWorkSpaceHandler } from '../../controllers/workspace.controller'
import { validation } from '../../validation';
import { addMemberSchema, createChannelSchema, createWorkspaceSchema } from '../../validation/workspace';
import { isAuthenticated } from '../../middleware/authenticated';

const workspaceRrouter = express.Router()


workspaceRrouter.use(isAuthenticated)


workspaceRrouter
.post('/',validation(createWorkspaceSchema),createWorkspaceHandler)
.get("/",getWorkSpaceByUserIdHandler)
.get("/:workspaceId",getWorkSpaceById)
.get("/:workspaceId/members",getWorkSpaceMembersHandler)
.get("/:workspaceId/channels",getWorkSpaceChannelsHandler)
.put("/:workspaceId",updateWorkSpaceHandler)
.delete("/:workspaceId",deleteWorkSpaceHandler)
.patch("/:workspaceId/code",joinWorkSpaceHandlerByJoinCodeHandler)
.patch("/:workspaceId/leave",leaveWorkSpaceHandler)
.patch("/:workspaceId/remove/:memberId",addMemberToWorkSpaceHandler)
.patch("/:workspaceId/remove/:channelId",deleteChannelToWorkSpaceHandler)
.patch("/:workspaceId/channels", validation(createChannelSchema), addChannelWorkSpaceHandler)
.patch("/:workspaceId/members",validation(addMemberSchema), addMemberToWorkSpaceHandler)




export default workspaceRrouter
