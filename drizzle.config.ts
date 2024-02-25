import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config({
    path: '.env'
})

if (!process.env.DATABASE_URL) {
    console.log('Cannot find database url')
}

export default {
    driver: 'pg',
    schema: './src/lib/db/schema/*',
    dbCredentials: {
        connectionString: process.env.DATABASE_URL!
    }
} satisfies Config