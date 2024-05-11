import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config({
    path: '.env'
})

if (!process.env.DATABASE_URL) {
    console.log('Cannot find database url')
}

export default {
    dialect: 'postgresql',
    schema: './src/lib/db/schema/*',
    dbCredentials: {
        url: process.env.DATABASE_URL!
    }
} satisfies Config