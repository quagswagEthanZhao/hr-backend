const psql = require('../model/DbConfig');

const findChange = (before, after) => {
  return Object.keys(before).filter(
    (k) => before[k].toString() !== after[k].toString()
  );
};

module.exports = {
  getAll: async (req, res) => {
    const resoult = await psql
      .select('*')
      .from('employees AS em')
      .leftJoin('departments AS dep', 'em.department_id', 'dep.department_id')
      .leftJoin('jobs as j', 'j.job_id', 'em.job_id');
    res.send(resoult);
  },
  addNew: async (req, res) => {
    const {
      name,
      address,
      email,
      phoneNumber,
      position,
      department,
      startingDate,
      shift,
      manager,
      favColor,
    } = req.body;
    //All job and dep name need to be uppercase in front-end
    const checkExist = await psql
      .select('*')
      .from('employees')
      .where('name', name.toUpperCase());
    const department_info = await psql
      .select('*')
      .from('departments')
      .where('department_name', department.toUpperCase());
    const position_info = await psql
      .select('*')
      .from('jobs')
      .where('job_title', position.toUpperCase());
    if (checkExist[0]) {
      return res.json({ error: true, message: 'Employee already exist !' });
    }
    if (!department_info[0]) {
      return res.json({ error: true, message: 'Department name not find !' });
    }
    if (!position_info[0]) {
      return res.json({ error: true, message: 'Position not find !' });
    }
    let manager_id;
    if (manager !== null) {
      const manager_info = await psql
        .select('*')
        .from('employees')
        .where('name', manager.toUpperCase());
      if (!manager_info[0]) {
        return res.json({ error: true, message: 'Manager info not find!' });
      } else {
        manager_id = manager_info[0].em_id;
      }
    }
    const position_id = position_info[0].job_id;
    const department_id = department_info[0].department_id;
    try {
      const resoult = await psql
        .insert({
          name: name.toUpperCase(),
          address: address,
          email: email,
          phone: phoneNumber,
          fav_color: favColor,
          start_date: startingDate,
          department_id: department_id,
          job_id: position_id,
          manager_id: manager_id ? manager_id : null,
        })
        .into('employees')
        .returning('*');
      const notifycation = await psql
        .insert({
          not_message: `${
            resoult[0].name
          } added to ${department.toUpperCase()} department`,
        })
        .into('notification')
        .returning('not_message');
      res.json({ error: false, message: notifycation[0], info: resoult });
    } catch (error) {
      res.json({ error: true, message: 'Server E !rror' });
    }
  },
  updateEmployeeInfo: async (req, res) => {
    const { id } = req.params;
    const {
      name,
      address,
      email,
      phoneNumber,
      position,
      department,
      manager,
      favColor,
    } = req.body;
    const em_info = await psql.select('*').from('employees').where('em_id', id);
    const position_info = await psql
      .select('*')
      .from('jobs')
      .where('job_title', position.toUpperCase());
    const department_info = await psql
      .select('*')
      .from('departments')
      .where('department_name', department.toUpperCase());
    if (!em_info[0]) {
      return res.json({ error: true, message: 'Employee Not Find !' });
    }
    if (!position_info[0]) {
      return res.json({ error: true, message: 'Position Not Find !' });
    }
    if (!department_info[0]) {
      return res.json({ error: true, message: 'Department Not Find !' });
    }
    let manager_id;
    if (manager !== null) {
      const manager_info = await psql
        .select('*')
        .from('employees')
        .where('name', manager.toUpperCase());
      if (!manager_info[0]) {
        return res.json({ error: true, message: 'Manager Info Not Find !' });
      } else {
        manager_id = manager_info[0].em_id;
      }
    }
    const position_id = position_info[0].job_id;
    const department_id = department_info[0].department_id;

    const emUpdate = await psql('employees')
      .update({
        name: name.toUpperCase(),
        address: address,
        email: email,
        phone: phoneNumber,
        fav_color: favColor,
        department_id: department_id,
        job_id: position_id,
        manager_id: manager_id ? manager_id : null,
      })
      .where('em_id', id)
      .returning('*');
    const changed = findChange(em_info[0], emUpdate[0]);
    if (changed.length > 0) {
      try {
        const notification = await psql
          .insert({
            not_message: `${em_info[0].name}'s ${changed.join(',')} changed`,
          })
          .into('notification')
          .returning('*');
        res.send({ error: false, message: notification, info: emUpdate });
      } catch (error) {
        res.json({ error: true, message: error.message });
      }
    } else {
      res.send({ error: false, message: 'No Update' });
    }
  },
  delete: async (req, res) => {
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
      res.json({ error: false, message: notification, info: resoult });
    } catch (error) {
      res.json({ error: true, message: error.message });
    }
  },
  updateTerminate: async (req, res) => {
    const { id } = req.params;
    const { terminate } = req.body;
    try {
      const em_info = await psql
        .select('*')
        .from('employees')
        .where('em_id', id);
      if (em_info[0].terminated == terminate) {
        return res.json({ error: false, message: 'no change' });
      }
      const resoult = await psql('employees')
        .update({ terminated: terminate })
        .where('em_id', id);
      const notification = await psql
        .insert({
          not_message: `${em_info[0].name} terminated`,
        })
        .into('notification');
      console.log(notification);
      res.json({ error: false, message: notification[0], info: resoult });
    } catch (error) {
      res.json({ error: true, message: error.message });
    }
  },
  getManager: async (req, res) => {
    const { id } = req.params;
    const manager_info = await psql
      .select('manager_id')
      .from('employees')
      .where('em_id', id);
    if (manager_info[0]) {
      const resoult = await psql
        .select('name')
        .from('employees')
        .where('em_id', manager_info[0].manager_id);
      res.json({ info: resoult[0].name });
    } else {
      res.send('Not find!');
    }
  },
};
