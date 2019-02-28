const articlesRouter = require('express').Router();
const { sendArticles, postArticle } = require('../controllers/articles');
const { handle405 } = require('../errors/index');

articlesRouter.route('/')
  .get(sendArticles)
  .post(postArticle)
  .all(handle405);

module.exports = articlesRouter;
