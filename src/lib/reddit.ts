import Snoowrap from "snoowrap"

type CreateRedditInstanceProps = {
    userAgent: string
    clientId: string
    clientSecret: string
    username: string
    password: string
}

export const createRedditInstance = ({ userAgent, clientId, clientSecret, username, password }: CreateRedditInstanceProps) => {
    const reddit = new Snoowrap({
        userAgent,
        clientId,
        clientSecret,
        username,
        password,
    });

    return reddit;
};

// Example usage: const redditInstance = createRedditInstance(userAgent, clientId, clientSecret, username, password);

export const userOne = {
    userAgent: process.env.NEXT_PUBLIC_FIRST_REDDIT_USER_AGENT!,
    clientId: process.env.NEXT_PUBLIC_FIRST_REDDIT_CLIENT_ID!,
    clientSecret: process.env.NEXT_PUBLIC_FIRST_REDDIT_CLIENT_SECRET!,
    username: process.env.NEXT_PUBLIC_FIRST_REDDIT_USERNAME!,
    password: process.env.NEXT_PUBLIC_FIRST_REDDIT_PASSWORD!
}
