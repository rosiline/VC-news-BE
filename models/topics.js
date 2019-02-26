const connection = require('../db/connection');

exports.getTopics = () => connection('topics').select('*');

exports.addTopic = topic => connection('topics').insert(topic).returning('*');
