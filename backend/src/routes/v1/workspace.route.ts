import express from 'express'
import { createWorkspaceHandler, getWorkSpaceById, getWorkSpaceMembersHandler, updateWorkSpaceHandler,deleteWorkSpaceHandler, joinWorkSpaceHandlerByJoinCodeHandler, leaveWorkSpaceHandler, getWorkSpaceChannelsHandler, addChannelWorkSpaceHandler } from '../../controllers/workspace.controller'
import { validation } from '../../validation';
import { createWorkspaceSchema } from '../../validation/workspace';

const workspaceWrouter = express.Router()




workspaceWrouter
.post('/',validation(createWorkspaceSchema),createWorkspaceHandler)
.get("/",getWorkSpaceMembersHandler)
.get("/:workspaceId",getWorkSpaceById)
.get("/:workspaceId/members",getWorkSpaceMembersHandler)
.get("/:workspaceId/channels",getWorkSpaceChannelsHandler)
.put("/:workspaceId",updateWorkSpaceHandler)
.delete("/:workspaceId",deleteWorkSpaceHandler)
.patch("/:workspaceId/code",joinWorkSpaceHandlerByJoinCodeHandler)
.patch("/:workspaceId/leave",leaveWorkSpaceHandler)
.patch("/:workspaceId/channels",addChannelWorkSpaceHandler)
.patch("/:workspaceId/members",addChannelWorkSpaceHandler)




export default workspaceWrouter
