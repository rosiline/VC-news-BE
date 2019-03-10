const {
  getCommentsByArticle, insertCommentByArticle, getUpdatedComment, delComment,
} = require('../models/comments');
const { getArticle } = require('../models/articles');

exports.sendCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  const {
    sort_by,
    order,
    limit,
    p,
  } = req.query;
  Promise.all([getArticle(article_id), getCommentsByArticle(article_id, {
    sort_by,
    order,
    limit,
    p,
  })])
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
    .catch((err) => {
      if (err.code === '23503') next({ status: 404 });
      else next(err);
    });
};

exports.updateCommentVote = (req, res, next) => {
  const { comment_id } = req.params;
  let { inc_votes } = req.body;
  if (!inc_votes) inc_votes = 0;
  if (typeof inc_votes !== 'number') next({ status: 400 });
  getUpdatedComment(comment_id, inc_votes)
    .then(([comment]) => {
      if (!comment) next({ status: 404 });
      else res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  delComment(comment_id)
    .then((output) => {
      if (output === 1) res.sendStatus(204);
      else next({ status: 404 });
    })
    .catch(next);
};
