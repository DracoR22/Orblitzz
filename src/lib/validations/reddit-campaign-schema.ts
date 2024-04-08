import * as z from 'zod'

export const RedditCampaignSchema = z.object({
    image: z.string().optional(),
    title: z.string().min(1, { message: 'Please add a title for your project.' }).max(20, { message: 'Keep your title shorter.' }),
    description: z.string().min(4, { message: 'Please provide a valid description.' }).max(500, { message: 'Descriptions can only have up to 500 characters.' }),
    url: z.string().refine((value) => /^https:\/\/.{3,}\.(com|[a-z]{2,})$/.test(value), { message: 'Provide a valid URL' }),
    tone: z.string().min(1, { message: 'Please pick a tone for the AI.' }),
    autoReply: z.boolean(),
    autoReplyLimit: z.number()
})

export const UpdateRedditCampaignSchema = z.object({
    id: z.string().min(1, { message: 'Project Id is required' }),
    image: z.string().optional(),
    title: z.string().min(1, { message: 'Please add a title for your project.' }),
    description: z.string().min(4, { message: 'Please provide a valid description.' }).max(500, { message: 'Descriptions can only have up to 500 characters.' }),
    url: z.string().refine((value) => /^https:\/\/.{3,}\.(com|[a-z]{2,})$/.test(value), { message: 'Provide a valid URL' }),
    tone: z.string().min(1, { message: 'Please pick a tone for the AI.' }),
    autoReply: z.boolean(),
    autoReplyLimit: z.number()
})

export const CreateReplySchema = z.object({
    postId: z.string().min(1, { message: 'PostId is required' }),
    projectId: z.string().min(1, { message: 'ProjectId is required' }),
    postContent: z.string().min(1, { message: 'PostContent is required' }),
    postUrl: z.string().min(1, { message: 'PostUrl is required' }),
    postAuthor: z.string().min(1, { message: 'PostAuthor is required' }),
    postTitle: z.string().min(1, { message: 'PostTitle is required' })
})

export const CreateAutoReplySchema = z.object({
    projectId: z.string().min(1, { message: 'ProjectId is required' }),
    allKeywords: z.array(z.string()),
})

export const GetPostsSchema = z.object({
    allKeywords: z.array(z.string()),
    projectId: z.string().min(1, { message: 'ProjectId is required' }),
})