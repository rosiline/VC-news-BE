const connection = require('../db/connection');
const { renameKey } = require('../db/utils/index');

exports.getCommentsByArticle = (article_id, {
  sort_by = 'created_at',
  order = 'desc',
  limit = 10,
  p = 1,
}) => connection
  .select('*')
  .from('comments')
  .where({ article_id })
  .orderBy(sort_by, order)
  .limit(limit)
  .offset((p - 1) * limit);

exports.insertCommentByArticle = (article_id, newComment) => {
  const [formattedComment] = renameKey([newComment], 'username', 'author');
  formattedComment.article_id = article_id;
  return connection.insert(formattedComment).into('comments').where({ article_id }).returning('*');
};

exports.getUpdatedComment = (comment_id, inc_votes) => connection('comments').where({ comment_id }).increment('votes', inc_votes).returning('*');

exports.delComment = comment_id => connection('comments').where({ comment_id }).del();
