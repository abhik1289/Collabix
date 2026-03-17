import express from 'express'
import { validation } from '../../validation'
import { addChannelWorkSpaceHandler, addMemberHandler, createWorkspaceHandler, delteWorkSpaceHandler, getWorkSpaceByUserIdHandler, getWorkSpaceChannelsHandler, getWorkSpaceMembersHandler, leaveWorkSpaceHandler, updateWorkSpaceHandler } from '../../controllers/workspace.controller'
import { createWorkspaceSchema } from '../../validation/workspace'
import { isAuthenticated } from '../../middleware/authenticated';

const workspaceRouter = express.Router();


workspaceRouter.use(isAuthenticated)
.post('/',validation(createWorkspaceSchema), createWorkspaceHandler)
.get("/",getWorkSpaceByUserIdHandler)
.delete("/:workspaceId",delteWorkSpaceHandler)
.put("/:workspaceId",updateWorkSpaceHandler)
.get("/:workspaceId/members",getWorkSpaceMembersHandler)
.get("/:workspaceId/channels",getWorkSpaceChannelsHandler)
.patch("/:workspaceId/member/:memberId",addMemberHandler)
.patch("/:workspaceId/channel/:channelId",addChannelWorkSpaceHandler)
.patch("/:workspaceId/leave",leaveWorkSpaceHandler)



export default workspaceRouter