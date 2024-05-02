# ORBLITZZ

<p align="center">
<img alt='/' src="/public/logo-bg.png" width="60px" height="auto"/>
</p>

Key Features:

🤖 AI Reddit automated replies
📈 Realtime dashboard
🦾 AI generated keywords
💎 Shadcn UI & Acernity UI for clean animations
📱 Full responsiveness for all devices
🔒 Next Auth V5 for authentication & security
📦 DrizzleORM for database management
📺 free Reddit posts feed
💻 TRPC for backend type safety

### Prerequisites

**Node version 14.x**

### Cloning the repository

```shell
git clone https://github.com/DracoR22/Orblitzz
```

### Install packages

```shell
pnpm install
```

### Setup .env file

```js
PORT=3000

DATABASE_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

NEXTAUTH_SECRET=

OPENAI_API_KEY=

RESEND_API_KEY=

NEXT_PUBLIC_CRISP_WEBSITE_ID=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

FIRST_REDDIT_USER_AGENT=
FIRST_REDDIT_CLIENT_ID=
FIRST_REDDIT_CLIENT_SECRET=
FIRST_REDDIT_USERNAME=
FIRST_REDDIT_PASSWORD=
```

### Start the app

```shell
pnpm dev
```

## Available commands

Running commands with npm `pnpm [command]`

| command | description                              |
| :------ | :--------------------------------------- |
| `dev`   | Starts a development instance of the app |