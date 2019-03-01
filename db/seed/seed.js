const {
  formatDate,
  renameKey,
  createRef,
  formatData,
} = require('../utils/index');
const {
  articleData,
  topicData,
  userData,
  commentData,
} = require('../data/index');

exports.seed = (knex, Promise) => knex.migrate.rollback().then(() => knex.migrate.latest())
  .then(() => Promise.all([knex.insert(topicData).into('topics'), knex.insert(userData).into('users')]))
  .then(() => {
    const formattedArticleData = formatDate(articleData);
    return knex.insert(formattedArticleData).into('articles').returning('*');
  })
  .then((articles) => {
    const formattedDates = formatDate(commentData);
    const commentsWithAuthor = renameKey(formattedDates, 'created_by', 'author');
    const refObj = createRef(articles, 'title', 'article_id');
    const formattedCommentsData = formatData(commentsWithAuthor, 'belongs_to', 'article_id', refObj);
    return knex.insert(formattedCommentsData).into('comments');
  });
