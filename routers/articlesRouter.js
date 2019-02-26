const articlesRouter = require('express').Router();
const { sendArticles } = require('../controllers/articles');

articlesRouter.get('/', sendArticles);

module.exports = articlesRouter;
