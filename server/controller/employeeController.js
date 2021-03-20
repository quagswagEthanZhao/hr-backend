const knex = require('knex');
const psql = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: '',
    password: '',
    database: 'hr',
  },
});

module.exports = {
  test: async (req, res) => {
    try {
      const resoult = await psql.select('*').from('department');
      console.log(resoult);
      res.send('DB CONNECTED!');
    } catch (error) {
      console.log(error);
    }
  },
};
