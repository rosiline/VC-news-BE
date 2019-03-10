const connection = require('../db/connection');
const { renameKey } = require('../db/utils/index');

exports.getArticles = ({
  author, topic, sort_by = 'created_at', order = 'desc', limit = 10, p = 1,
}) => {
  const articles = connection
    .select('articles.*')
    .count({ comment_count: 'comment_id' })
    .from('articles')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .orderBy(sort_by, order)
    .limit(limit)
    .offset((p - 1) * limit);
  const queries = {};
  if (author) queries['articles.author'] = author;
  if (topic) queries.topic = topic;
  return articles.where(queries);
};

exports.insertArticle = (newArticle) => {
  const [formattedArticle] = renameKey([newArticle], 'username', 'author');
  return connection('articles')
    .insert(formattedArticle)
    .returning('*');
};

exports.getArticle = article_id => connection
  .select('articles.*')
  .count({ comment_count: 'comment_id' })
  .from('articles')
  .leftJoin('comments', 'articles.article_id', 'comments.article_id')
  .groupBy('articles.article_id')
  .where({ 'articles.article_id': article_id });

exports.getArticleColumns = () => connection('articles').columnInfo().returning('*');

exports.updateVote = (article_id, inc_votes) => connection('articles').where({ article_id }).increment('votes', inc_votes).returning('*');

exports.delArticle = article_id => connection('articles').where({ article_id }).del();
