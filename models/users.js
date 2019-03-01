const connection = require('../db/connection');

exports.getUsers = (username) => {
  const conditions = {};
  if (username) conditions.username = username;
  return connection.select('*').from('users').where(conditions);
};

exports.insertUser = newUser => connection.insert(newUser).into('users').returning('*');
