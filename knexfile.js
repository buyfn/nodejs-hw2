import 'dotenv/config.js';

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.POSTGRESQL_HOST,
      port: process.env.POSTGRESQL_PORT,
      database: process.env.POSTGRESQL_DB,
      user: process.env.POSTGRESQL_USER,
      password: process.env.POSTGRESQL_PASSWORD,
      ssl: {
        rejectUnauthorized: false
      }
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'users',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'users',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
