const { formatDate, createRef, formatData } = require('../utils/index');
const { articleData, topicData, userData, commentData } = require('../data/index');

exports.seed = (knex, Promise) => {
  return knex.migrate.rollback().then(() => knex.migrate.latest())
    .then(() => {
      return knex.insert(topicData).into('topics').returning('*');
    })
    .then(() => {
      return knex.insert(userData).into('users').returning('*');
    })
    .then(() => {
      const formattedArticleData = formatDate(articleData);
      return knex.insert(formattedArticleData).into('articles').returning('*');
    })
    .then(() => {
      console.log(commentData);
    });
};
