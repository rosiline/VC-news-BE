const usersRouter = require('express').Router();
const { sendUsers, postUser, sendUser } = require('../controllers/users');

usersRouter.route('/')
  .get(sendUsers)
  .post(postUser);

usersRouter.route('/:username')
  .get(sendUser);

module.exports = usersRouter;
