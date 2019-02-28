const connection = require('../db/connection');

exports.getCommentsByArticle = (article_id, { sort_by = 'created_at', order = 'desc' }) => connection
  .select('*')
  .from('comments')
  .where({ article_id })
  .orderBy(sort_by, order);
