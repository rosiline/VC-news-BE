const usersRouter = require('express').Router();
const { sendUsers } = require('../controllers/users');

usersRouter.route('/')
  .get(sendUsers);

module.exports = usersRouter;
