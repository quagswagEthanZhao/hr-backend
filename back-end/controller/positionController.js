const psql = require('../model/DbConfig');

module.exports = {
  insertPosition: async (req, res) => {
    const { position_title, min_salary, max_salary, shift } = req.body;
    try {
      const checkError = await psql
        .select('*')
        .from('jobs')
        .where('job_title', position_title.toUpperCase());
      if (checkError[0]) {
        return res.json({ error: true, message: 'Position already exist' });
      }
      const resoult = await psql
        .insert({
          job_title: position_title.toUpperCase(),
          min_salary: min_salary,
          max_salary: max_salary,
          shift: shift,
        })
        .into('jobs')
        .returning('job_title');
      const notification = await psql
        .insert({
          not_message: `New position: ${resoult[0]} added into the database !`,
        })
        .into('notification')
        .returning('not_message');
      res.json({ error: false, message: notification[0], info: resoult[0] });
    } catch (error) {
      res.json({ error: true, message: error.message });
    }
  },
};
