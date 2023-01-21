import knex from 'knex';

import config from '../../knexfile.js';

const ENV = process.env.ENV || 'development';

export const db = knex(config[ENV]);
