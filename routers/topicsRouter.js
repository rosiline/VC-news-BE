const topicsRouter = require('express').Router();
const { sendTopics, postTopic } = require('../controllers/topics');
const { handle405 } = require('../errors/index');

topicsRouter.route('/')
  .get(sendTopics)
  .post(postTopic)
  .all(handle405);

module.exports = topicsRouter;
