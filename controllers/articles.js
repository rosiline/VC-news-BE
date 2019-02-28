const { getTopics } = require('../models/topics');
const { getArticles, insertArticle, getArticle } = require('../models/articles');

// add get users to promise
exports.sendArticles = (req, res, next) => {
  const {
    author, topic, sort_by, order,
  } = req.query;
  Promise.all([getTopics(), getArticles({
    author, topic, sort_by, order,
  })])
    .then(([topics, articles]) => {
      if (topic && !topics.find(el => el.slug === topic)) next({ status: 404 });
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
      if (article === undefined) next({ status: 404 });
      else res.status(200).send({ article });
    })
    .catch(next);
};
