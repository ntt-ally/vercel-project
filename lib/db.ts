import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL

export const isDatabaseConfigured = !!connectionString

const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    })
  : null

export default pool
