const connection = require('../db/connection');

exports.getTopics = (topic) => {
  const conditions = {};
  if (topic) conditions.slug = topic;
  return connection('topics').select('*').where(conditions);
};

exports.addTopic = topic => connection('topics').insert(topic).returning('*');
