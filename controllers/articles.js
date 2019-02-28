const { getTopics } = require('../models/topics');
const { getArticles } = require('../models/articles');

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
      else {
        res.status(200).send({ articles });
      }
    })
    .catch(next);
};
