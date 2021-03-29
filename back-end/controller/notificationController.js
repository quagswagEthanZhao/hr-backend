const psql = require('../model/DbConfig');

const getLastNine = (arr) => {
  const resoult = [];
  for (let i = arr.length - 9; i < arr.length; i++) {
    resoult.push(arr[i]);
  }
  return resoult;
};

module.exports = {
  getAllNotification: async (req, res) => {
    try {
      const allNotification = await psql
        .select('not_message')
        .from('notification');
      res.json({ error: false, info: getLastNine(allNotification) });
    } catch (error) {
      res.json({ error: true, message: error.message });
    }
  },
};
