import { z } from "zod"

export const createFormSchema = z.object({
    title: z.string().min(3).max(80),
    description: z.string().min(3).max(280)
})

export type CreateFormSchema = z.infer<typeof createFormSchema>