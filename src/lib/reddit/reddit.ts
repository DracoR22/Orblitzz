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


export const userCredentials = [
    {
      userAgent: process.env.FIRST_REDDIT_USER_AGENT!,
      clientId: process.env.FIRST_REDDIT_CLIENT_ID!,
      clientSecret: process.env.FIRST_REDDIT_CLIENT_SECRET!,
      username: process.env.FIRST_REDDIT_USERNAME!,
      password: process.env.FIRST_REDDIT_PASSWORD!
    },
    {
      userAgent: process.env.SECOND_REDDIT_USER_AGENT!,
      clientId: process.env.SECOND_REDDIT_CLIENT_ID!,
      clientSecret: process.env.SECOND_REDDIT_CLIENT_SECRET!,
      username: process.env.SECOND_REDDIT_USERNAME!,
      password: process.env.SECOND_REDDIT_PASSWORD!
    },
    {
      userAgent: process.env.THIRD_REDDIT_USER_AGENT!,
      clientId: process.env.THIRD_REDDIT_CLIENT_ID!,
      clientSecret: process.env.THIRD_REDDIT_CLIENT_SECRET!,
      username: process.env.THIRD_REDDIT_USERNAME!,
      password: process.env.THIRD_REDDIT_PASSWORD!
    }
  ];