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
const time = new Date();
const now = time.getFullYear() + '/' + time.getMonth() + '/' + time.getDate();
const findEndDateInsertionId = (historys) => {
  for (let i = 0; i < historys.length; i++) {
    if (!historys[i].end_date) {
      return historys[i].his_id;
    }
  }
};

module.exports = {
  addNew: async (req, res) => {
    const {
      name,
      address,
      email,
      phoneNumber,
      position,
      department,
      startingDate,
      endDate,
      shift,
      manager,
      favColor,
    } = req.body;
    const validate = await psql
      .select('em_id')
      .from('employees')
      .where('name', name);
    if (validate[0]) {
      return res.json({ error: true, message: 'employee already exist!' });
    }
    const resoult = await psql
      .select('dep_id')
      .from('department')
      .where('department_name', department);
    if (resoult[0]) {
      const dep_id = resoult[0].dep_id;
      psql.transaction((trx) => {
        trx
          .insert({
            name: name,
            address: address,
            email: email,
            phone: phoneNumber,
            position: position,
            fav_color: favColor,
            dep_id: dep_id,
            start_date: startingDate,
            shift: shift,
          })
          .into('employees')
          .returning('em_id')
          .then((em_id) => {
            trx('job_history')
              .returning('*')
              .insert({
                em_id: em_id[0],
                end_date: endDate,
                start_date: startingDate,
                job: position,
              })
              .then((history_info) => {
                res.json({
                  error: false,
                  message: 'Information Saved!',
                  info: history_info,
                });
              })
              .then(trx.commit)
              .catch(trx.rollback);
          });
      });
    } else {
      psql.transaction((trx) => {
        trx
          .insert({
            department_name: department,
            manager: manager,
          })
          .into('department')
          .returning('dep_id')
          .then((dep_id) => {
            trx('employees')
              .returning('em_id')
              .insert({
                name: name,
                address: address,
                email: email,
                phone: phoneNumber,
                job: position,
                fav_color: favColor,
                dep_id: dep_id[0],
                start_date: startingDate,
                shift: shift,
              })
              .then((em_id) => {
                trx('job_history')
                  .returning('*')
                  .insert({
                    em_id: em_id[0],
                    start_date: startingDate,
                    end_date: endDate,
                    job: position,
                  })
                  .then((history_info) =>
                    res.json({
                      error: false,
                      message: 'Information saved!',
                      info: history_info,
                    })
                  )
                  .then(trx.commit)
                  .catch(trx.rollback);
              });
          });
      });
    }
  },

  getAllInof: async (req, res) => {
    try {
      const info = await psql
        .select('*')
        .from('employees')
        .leftJoin('department', 'department.dep_id', 'employees.dep_id');
      res.json({ error: false, message: 'DB CONNECTED', info: info });
    } catch (error) {
      console.log(error.message);
    }
  },

  updateInfo: async (req, res) => {
    const { id } = req.params;
    const {
      name,
      address,
      email,
      phoneNumber,
      position,
      department,
      shift,
      manager,
      favColor,
    } = req.body;
    const em = await psql.select('*').from('employees').where('em_id', id);
    if (!em[0]) {
      return res.json({ error: true, message: 'Employee not find' });
    }
    const dep = await psql
      .select('*')
      .from('department')
      .where('department_name', department);
    if (!dep[0]) {
      return res.json({ error: true, message: 'Department not find' });
    }
    const dep_id = dep[0].dep_id;
    const em_position = em[0].job;
    if (em_position == position) {
      psql.transaction((trx) => {
        trx('employees')
          .update({
            name: name,
            address: address,
            email: email,
            phone: phoneNumber,
            fav_color: favColor,
            shift: shift,
          })
          .where('em_id', id)
          .returning('dep_id')
          .then((dep_id) => {
            console.log(dep_id);
            trx('department')
              .update({
                manager: manager,
              })
              .where('dep_id', dep_id[0])
              .returning('*')
              .then((dep_info) => {
                res.json({
                  error: false,
                  message: 'DB update without position change',
                  info: dep_info,
                });
              })
              .then(trx.commit)
              .catch(trx.rollback);
          });
      });
    } else {
      const em_historys = await psql
        .select('*')
        .from('job_history')
        .where('em_id', em[0].em_id);
      const his_id = findEndDateInsertionId(em_historys);
      psql.transaction((trx) => {
        trx('job_history')
          .update({
            end_date: now,
          })
          .where('his_id', his_id)
          .returning('end_date')
          .then((end_date) => {
            trx('job_history')
              .insert({
                em_id: id,
                start_date: end_date,
                end_date: null,
                job: position,
              })
              .returning('em_id')
              .then((em_id) => {
                trx('employees')
                  .update({
                    dep_id: dep_id,
                    position: position,
                  })
                  .where('em_id', em_id[0])
                  .returning('*')
                  .then((em_info) => {
                    res.json({
                      error: false,
                      message: 'info updated!',
                      info: em_info,
                    });
                  })
                  .then(trx.commit)
                  .catch(trx.rollback);
              });
          });
      });
    }
  },
  deleteInfo: async (req, res) => {
    const { id } = req.params;
    try {
      const em_info = await psql
        .select('*')
        .from('employees')
        .where('em_id', id);
      if (!em_info[0]) {
        return res.json({ error: true, message: 'Employee not find' });
      }
      const resoult = await psql('employees').where('em_id', id).del();
      const notification = await psql
        .insert({
          not_message: `${em_info[0].name} removed from the team`,
        })
        .into('notification')
        .returning('not_message');
      console.log(notification);
      res.json({ error: false, message: notification, info: resoult });
    } catch (error) {
      res.json({ error: true, message: error.message });
    }
  },
};
