const level = require('level');
const dbName = './.verification_data';
const db = level(dbName);

const add = async (key, value) => {
  await db.put(key, JSON.stringify(value));
};

const get = async (key) => {
  let value = await db.get(key)
    .then(result => {
      return JSON.parse(result);
    })
    .catch(error => {
      console.log('unhandledRejection', error);
      return {};
    });

  return value;
};

const del = async (key) => {
  await db.del(key);
};

module.exports = {
  add,
  get,
  del,
}
