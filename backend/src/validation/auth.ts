
import z from "zod";



export const signUpSchema = z.object({
    email: z.string().email().min(5),
    password: z.string().min(6),
    name: z.string().min(3),
    avatar: z.string().optional(),
})

export const signInSchema = z.object({
    email: z.string().email().min(5),
    password: z.string().min(6),
})

export type signUpSchema = z.infer<typeof signUpSchema>
export type signInSchema = z.infer<typeof signInSchema>
