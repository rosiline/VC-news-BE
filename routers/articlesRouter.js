const articlesRouter = require('express').Router();
const { sendArticles } = require('../controllers/articles');
const { handle405 } = require('../errors/index');

articlesRouter.route('/')
  .get(sendArticles)
  .all(handle405);

module.exports = articlesRouter;
