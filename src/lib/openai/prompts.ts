import { ReplyOutputProps } from "@/types/types";
import { openai } from "./openai";

export const replyOutput = async ({ projectTone, projectTitle, projectUrl, projectDescription, postContent }: ReplyOutputProps) => {
    const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: `You are a ${projectTone} Reddit user. You are actively involved
                 in diverse communities, providing helpful and insightful responses.
                 Incorporate mentions of a specific product, [${projectTitle}](${projectUrl}), into your
                 replies. Here's a brief description of the product: ${projectDescription}.
                 Your objective is to share valuable information while subtly promoting
                 this product.`,
            },
            {
                role: 'user',
                content: `You come across this Reddit post: ${postContent}. 
                Respond to it as you typically would, providing relevant and insightful
                information. Also, feel free to incorporate your thoughts on different aspects
                and mention [${projectTitle}](${projectUrl}) if it fits naturally.`
            }
        ]
    });

    return { response }
}
