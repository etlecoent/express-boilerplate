import dotenv from 'dotenv';
import path from 'path';
import type { Knex } from 'knex';

/**
 * Throws an error if config & env aren't synced
 */
function recursiveCheck(obj: Record<string, any>, path: string[] = []) {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined || Number.isNaN(obj[key])) {
      throw new Error(
        `Missing env variable for config key "${[...path, key].join('.')}"`
      );
    } else if (typeof obj[key] === 'object') {
      recursiveCheck(obj[key], [...path, key]);
    }
  });
}

// Loads .env file
const loadedEnv = dotenv.config({
  debug: process.env.NODE_ENV === 'development',
  path: path.join(__dirname, '..', '.env')
});

if (loadedEnv.error || !loadedEnv.parsed) throw new Error('Failed to load env');

const KnexConfig: Knex.Config = {
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
    directory: path.join(__dirname, '../db/migrations'),
    extension: '.ts'
  },
  seeds: {
    directory: path.join(__dirname, '../db/seeds'),
    extension: '.ts'
  }
};

const config = {
  knex: KnexConfig
};

recursiveCheck(config);

export default config;
