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
      userAgent: 'first',
      clientId: 'Fl3QTm2uojQLZ2oMFLlf9Q',
      clientSecret: 'hOKp5qRY4s1lwdpQwgejlBnKbDZDbA',
      username: 'NeckGood3393',
      password: 'lunataco123'
    },
    {
      userAgent: 'orblitzz',
      clientId: 'VBSUtCtO7Ik_gV3wiaOtRQ',
      clientSecret: 'ZHbkrshNo7y8j4qVthpMeGdhbMOpwQ',
      username: 'Interesting_Eye3977',
      password: 'QNmwXKkH3+edGwU'
    },
    {
      userAgent: 'app3',
      clientId: 'TSviHmBk5cz6oIPzGLvUTQ',
      clientSecret: 'OMQHhF9mt78WWM-aenSI_cC7MUgl3Q',
      username: 'Correct-Tennis4132',
      password: 'rest435tgy6'
    },
    {
      userAgent: 'app4',
      clientId: '9Ow9jyWG1YgS4g80epcSSQ',
      clientSecret: 'zk3PD2RdJ9tGdTQHO_z63g_jnoXxMg',
      username: 'Limitless342',
      password: '23edr3sloi'
    }
  ];