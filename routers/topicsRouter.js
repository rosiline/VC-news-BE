const topicsRouter = require('express').Router();
const { sendTopics } = require('../controllers/topics');

topicsRouter.get('/', sendTopics);

module.exports = topicsRouter;
