import { z } from 'zod'

export const searchSchema = z.object({
  q: z.string().optional(),
  page: z.number().optional().default(1),
})
