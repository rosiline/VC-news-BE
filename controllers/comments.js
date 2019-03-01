const {
  getCommentsByArticle, insertCommentByArticle, getUpdatedComment, delComment,
} = require('../models/comments');
const { getArticle } = require('../models/articles');

exports.sendCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  Promise.all([getArticle(article_id), getCommentsByArticle(article_id, { sort_by, order })])
    .then(([article, comments]) => {
      if (article.length === 0) next({ status: 404 });
      else res.status(200).send({ comments });
    });
};

exports.postCommentByArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  insertCommentByArticle(article_id, { username, body })
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.updateCommentVote = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  getUpdatedComment(comment_id, inc_votes)
    .then(([comment]) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  delComment(comment_id)
    .then((output) => {
      if (output === 1) res.sendStatus(204);
      else next({ next: 422 });
    })
    .catch(next);
};
