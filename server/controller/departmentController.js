const psql = require('../model/DbConfig');

const getEachDepartmentMemberNum = (dep_info) => {
  let outcome = [];
  let resoult = [1];
  for (var i = 0; i < dep_info.length; i++) {
    if (dep_info[i + 1] == undefined) {
      if (resoult[0] > 1) {
        resoult.push(dep_info[i].department_name);
        outcome.push(resoult);
        return outcome;
      } else {
        resoult.push();
        resoult.push(dep_info[i].department_name);
        outcome.push(resoult);
        return outcome;
      }
    }
    if (dep_info[i].department_name === dep_info[i + 1].department_name) {
      resoult[0]++;
    } else {
      resoult[1] = dep_info[i].department_name;
      outcome.push(resoult);
      resoult = [1];
    }
  }
  return outcome;
};

module.exports = {
  insertDpartment: async (req, res) => {
    const { department_name } = req.body;
    try {
      const checkDepartment = await psql
        .select('*')
        .from('departments')
        .where('department_name', department_name.toUpperCase());
      if (checkDepartment[0]) {
        return res.json({ error: true, message: 'Department Already exist' });
      }
      const resoult = await psql
        .insert({
          department_name: department_name.toUpperCase(),
        })
        .into('departments')
        .returning('department_name');
      const notification = await psql
        .insert({
          not_message: `New department : ${resoult[0]} added into the database!`,
        })
        .into('notification')
        .returning('not_message');
      res.json({
        error: false,
        message: notification[0],
        info: resoult[0],
      });
    } catch (error) {
      res.json({ error: true, message: error.message });
    }
  },
  getAllDepartmentMemberNum: async (req, res) => {
    try {
      const allDepartmentInfo = await psql
        .select('em.name', 'dep.department_name')
        .from('employees as em')
        .leftJoin(
          'departments as dep',
          'em.department_id',
          'dep.department_id'
        );
      const TotalNum = allDepartmentInfo.length;
      const resoult = getEachDepartmentMemberNum(allDepartmentInfo);
      res.json({ error: false, info: resoult, totalNum: TotalNum });
    } catch (error) {
      res.json({ error: true, message: error.message });
    }
  },
};
