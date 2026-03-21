

import z from "zod";




export const createWorkspaceSchema = z.object({
    name: z.string().min(3),
    description: z.string().optional(),
})

export const updateWorkspaceSchema = createWorkspaceSchema.partial()
export const createChannelSchema = z.object({

    name: z.string().min(3),

})
export const addMemberSchema = z.object({

    memberId: z.string().min(3),
})


export type IWorkspace = z.infer<typeof createWorkspaceSchema>
export type IAddMember = z.infer<typeof addMemberSchema>
export type ICreateChannel = z.infer<typeof createChannelSchema>