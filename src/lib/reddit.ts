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