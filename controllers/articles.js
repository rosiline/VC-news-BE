const { getTopics } = require('../models/topics');
const { getUsers } = require('../models/users');
const {
  getArticles,
  insertArticle,
  getArticle,
  updateVote,
  delArticle,
} = require('../models/articles');

exports.sendArticles = (req, res, next) => {
  const {
    author, topic, sort_by, order,
  } = req.query;
  Promise.all([getTopics(topic), getUsers(author), getArticles({
    author, topic, sort_by, order,
  })])
    .then(([topics, users, articles]) => {
      // if (topic && topics.length === 0) next({ status: 404 });
      if (author && users.length === 0) next({ status: 404 });
      else if (order && !(order === 'asc' || order === 'desc')) next({ status: 400 });
      else res.status(200).send({ articles });
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
  const { inc_votes } = req.body;
  if (!inc_votes || typeof inc_votes !== 'number') next({ status: 400 });
  updateVote(article_id, inc_votes)
    .then(() => getArticle(article_id))
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  delArticle(article_id)
    .then((output) => {
      if (output === 1) res.sendStatus(204);
      else next({ status: 422 });
    })
    .catch(next);
};
