const { articleData, topicData, userData, commentData } = require('../data/index');

exports.seed = (knex, Promise) => {
  return knex.rollback().then(() => knex.migrate.latest())
    .then(() => {

    })
};
