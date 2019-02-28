const articlesRouter = require('express').Router();
const { sendArticles, postArticle, sendArticle } = require('../controllers/articles');
const { handle405 } = require('../errors/index');

articlesRouter.route('/')
  .get(sendArticles)
  .post(postArticle)
  .all(handle405);

articlesRouter.route('/:article_id')
  .get(sendArticle);

module.exports = articlesRouter;
