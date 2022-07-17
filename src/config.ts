import dotenv from 'dotenv';
import path from 'path';

/**
 * Throws an error if config & env aren't synced
 */
function recursiveCheck(obj: Record<string, any>, keyPath: string[] = []) {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined || Number.isNaN(obj[key])) {
      throw new Error(
        `Missing env variable for config key "${[...keyPath, key].join('.')}"`
      );
    } else if (typeof obj[key] === 'object') {
      recursiveCheck(obj[key], [...keyPath, key]);
    }
  });
}

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
    database: process.env.DB_NAME!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!
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
  host: process.env.HOST!,
  port: Number(process.env.PORT)!
} as const;

const config = {
  knex: KnexConfig,
  server: ServerConfig
} as const;

recursiveCheck(config);

export default config;
