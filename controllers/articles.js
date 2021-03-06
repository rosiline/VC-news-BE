const { getUsers } = require('../models/users');
const {
  getArticles,
  getArticleCount,
  getArticleColumns,
  insertArticle,
  getArticle,
  updateVote,
  delArticle,
} = require('../models/articles');

exports.sendArticles = (req, res, next) => {
  const {
    author,
    topic,
    order,
    limit,
    p,
  } = req.query;
  let { sort_by } = req.query;
  getArticleColumns()
    .then((columns) => {
      if (!Object.keys(columns).includes(sort_by) && sort_by !== 'comment_count') sort_by = 'created_at';
      return sort_by;
    })
    .then(() => Promise.all([getUsers(author), getArticleCount({ author, topic }), getArticles({
      author, topic, sort_by, order, limit, p,
    })]))
    .then(([users, [{ total_count }], articles]) => {
      if (author && users.length === 0) next({ status: 404 });
      else if (order && !(order === 'asc' || order === 'desc')) next({ status: 400 });
      else res.status(200).send({ total_count: +total_count, articles });
    })
    .catch(next);
};


exports.postArticle = (req, res, next) => {
  const newArticle = req.body;
  insertArticle(newArticle)
    .then(([article]) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.sendArticle = (req, res, next) => {
  const { article_id } = req.params;
  getArticle(article_id)
    .then(([article]) => {
      if (!article) next({ status: 404 });
      else res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateArticle = (req, res, next) => {
  const { article_id } = req.params;
  let { inc_votes } = req.body;
  if (!inc_votes) inc_votes = 0;
  if (typeof inc_votes !== 'number') next({ status: 400 });
  updateVote(article_id, inc_votes)
    .then(() => getArticle(article_id))
    .then(([article]) => {
      if (!article) next({ status: 404 });
      else res.status(200).send({ article });
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  delArticle(article_id)
    .then((output) => {
      if (output === 1) res.sendStatus(204);
      else next({ status: 404 });
    })
    .catch(next);
};
