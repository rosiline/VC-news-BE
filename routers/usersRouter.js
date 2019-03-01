const usersRouter = require('express').Router();
const { sendUsers, postUser } = require('../controllers/users');

usersRouter.route('/')
  .get(sendUsers)
  .post(postUser);

module.exports = usersRouter;
