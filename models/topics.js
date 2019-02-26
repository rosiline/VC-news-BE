const connection = require('../db/connection');

exports.getTopics = () => connection('topics').select('*');
