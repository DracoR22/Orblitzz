<a href="https://orblitzz.com">
  <img src="/public/showcase/dashboard.png">
  <h1 align="center">Orblitzz 🦨</h1>
</a>

<p align="center">
  Automatically get more people to know your product in Reddit with AI
</p>

### 📚 Overview
<p>
This platform automatically generates AI-powered Reddit replies, recommending products to users based on the context of the conversation. Leveraging state-of-the-art machine learning algorithms, it provides relevant and personalized product suggestions seamlessly integrated into Reddit threads.
</p>

### ✨ Features:

- 🧠 AI-Powered Replies: Generates contextually relevant replies recommending products.
- 🌐 Next.js Framework: Built using Next.js for server-side rendering and static site generation.
- 🔄 TRPC Integration: Utilizes TRPC for end-to-end typesafe APIs.
- 💾 Database Management: Implements DrizzleORM with PostgreSQL for robust data handling.
- 🔒 Secure Authentication: Integrates NextAuth V5 for secure user authentication.
- 📈 Real-time Analytics: Monitors and analyzes the performance of AI-generated replies.
- ⚡ High Performance: Ensures fast and responsive interactions on the platform.
- 🔍 Advanced Search and Filtering: Helps users quickly find relevant products and discussions.
- 📊 User Engagement Tracking: Tracks user interactions to continuously improve recommendation accuracy.

### 🛠 Tech Stack:
- ⚛️ Next.js: React-based framework for building server-side rendered and statically generated web applications.
- 🔗 TRPC: End-to-end typesafe API framework for TypeScript.
- 🌿 DrizzleORM: TypeScript ORM for SQL databases, providing a type-safe and fluent API for database operations.
- 🐘 PostgreSQL: Robust, scalable, and SQL-compliant relational database management system.
- 🔒 NextAuth V5: Authentication solution for Next.js applications with support for multiple providers.
- 🎉 Tailwind CSS: Utility-first CSS framework for rapid UI development.
- 🚀 Vercel: Deployment and hosting platform optimized for Next.js applications.

### Drag and drop your favorite keywords
<img src="/public/showcase/keywordsfull.png">

### Search for the posts to mention your product
<img src="/public/showcase/posts.png">

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