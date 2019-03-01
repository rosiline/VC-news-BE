const connection = require('../db/connection');

exports.getUsers = () => connection.select('*').from('users');
