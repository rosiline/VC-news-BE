const connection = require('../db/connection');

exports.getArticles = ({
  author, topic, sort_by = 'created_at', order = 'desc',
}) => {
  const articles = connection
    .select('articles.*')
    .count({ comment_count: 'comment_id' })
    .from('articles')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .orderBy(sort_by, order);
  const queries = {};
  if (author) queries['articles.author'] = author;
  if (topic) queries.topic = topic;
  return articles.where(queries);
};
