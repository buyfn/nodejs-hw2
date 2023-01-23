import knex from 'knex';

import knexConfig from '../../knexfile.js';

const env = process.env.ENV || 'development';

export const db = knex(knexConfig[env]);
