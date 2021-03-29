const knex = require('knex');
const psql = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: '',
    password: '',
    database: 'conservicehr',
  },
});

module.exports = psql;
