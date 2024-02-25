import * as z from 'zod'

export const RedditCampaignSchema = z.object({
    image: z.string().optional(),
    title: z.string().min(1, { message: 'Please add a title for your project.' }),
    description: z.string().min(4, { message: 'Please provide a valid description.' }).max(500, { message: 'Descriptions can only have up to 500 characters.' }),
    url: z.string().refine((value) => /^https:\/\/.{3,}\.(com|[a-z]{2,})$/.test(value), { message: 'Provide a valid URL' }),
    tone: z.string().min(1, { message: 'Please pick a tone for the AI.' }),
    autoReply: z.boolean()
})