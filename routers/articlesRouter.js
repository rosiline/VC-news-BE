const articlesRouter = require('express').Router();
const {
  sendArticles,
  postArticle,
  sendArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/articles');
const { sendCommentsByArticle, postCommentByArticle } = require('../controllers/comments');
const { handle405 } = require('../errors/index');

articlesRouter.route('/')
  .get(sendArticles)
  .post(postArticle)
  .all(handle405);

articlesRouter.route('/:article_id')
  .get(sendArticle)
  .patch(updateArticle)
  .delete(deleteArticle)
  .all(handle405);

articlesRouter.route('/:article_id/comments')
  .get(sendCommentsByArticle)
  .post(postCommentByArticle)
  .all(handle405);

module.exports = articlesRouter;
