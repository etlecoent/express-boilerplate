import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

const KnexConfigSchema = z.object({
  debug: z.boolean(),
  client: z.literal('pg'),
  connection: z.object({
    database: z.string(),
    user: z.string(),
    password: z.string()
  }),
  pool: z.object({
    min: z.number().int().positive().min(0),
    max: z.number().int().positive().min(1)
  }),
  migrations: z.object({
    tableName: z.literal('knex_migrations'),
    directory: z.string()
  }),
  seeds: z.object({
    directory: z.string()
  })
});

const ServerConfigSchema = z.object({
  host: z.string(),
  port: z.preprocess((val: unknown) => Number(val), z.number().int().positive())
});

const ConfigSchema = z.object({
  knex: KnexConfigSchema,
  server: ServerConfigSchema
});

// Loads .env file
const loadedEnv = dotenv.config({
  debug: process.env.NODE_ENV === 'development',
  path: path.join(__dirname, '..', '.env')
});

if (loadedEnv.error || !loadedEnv.parsed) throw new Error('Failed to load env');

const KnexConfig = {
  debug: process.env.NODE_ENV === 'development',
  client: 'pg',
  connection: {
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: path.join(__dirname, '../db/migrations')
  },
  seeds: {
    directory: path.join(__dirname, '../db/seeds')
  }
} as const;

const ServerConfig = {
  host: process.env.HOST,
  port: process.env.PORT
} as const;

const config = ConfigSchema.parse({
  knex: KnexConfig,
  server: ServerConfig
});

export default config;
