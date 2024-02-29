import * as z from 'zod'

export const RedditCampaignSchema = z.object({
    image: z.string().optional(),
    title: z.string().min(1, { message: 'Please add a title for your project.' }),
    description: z.string().min(4, { message: 'Please provide a valid description.' }).max(500, { message: 'Descriptions can only have up to 500 characters.' }),
    url: z.string().refine((value) => /^https:\/\/.{3,}\.(com|[a-z]{2,})$/.test(value), { message: 'Provide a valid URL' }),
    tone: z.string().min(1, { message: 'Please pick a tone for the AI.' }),
    autoReply: z.boolean()
})

export const CreateReplySchema = z.object({
    userCredentials: z.object({
        userAgent: z.string().min(1, { message: 'UserAgent is required.' }),
        clientId: z.string().min(1, { message: 'ClientId is required.' }),
        clientSecret: z.string().min(1, { message: 'ClientSecret is required.' }),
        username: z.string().min(1, { message: 'UserName is required.' }),
        password: z.string().min(1, { message: 'Password is required.' }),
    }),
    postId: z.string().min(1, { message: 'PostId is required' }),
    projectId: z.string().min(1, { message: 'ProjectId is required' }),
    postContent: z.string().min(1, { message: 'PostContent is required' })
})