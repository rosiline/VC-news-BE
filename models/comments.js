const connection = require('../db/connection');
const { renameKey } = require('../db/utils/index');

exports.getCommentsByArticle = (article_id, { sort_by = 'created_at', order = 'desc' }) => connection
  .select('*')
  .from('comments')
  .where({ article_id })
  .orderBy(sort_by, order);

exports.insertCommentByArticle = (article_id, newComment) => {
  const [formattedComment] = renameKey([newComment], 'username', 'author');
  formattedComment.article_id = article_id;
  return connection.insert(formattedComment).into('comments').where({ article_id }).returning('*');
};
