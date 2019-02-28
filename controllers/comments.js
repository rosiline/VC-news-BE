const { getCommentsByArticle, insertCommentByArticle, getUpdatedComment } = require('../models/comments');

exports.sendCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  getCommentsByArticle(article_id, { sort_by, order })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
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
