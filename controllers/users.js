const { getUsers, insertUser } = require('../models/users');

exports.sendUsers = (req, res, next) => {
  getUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  const newUser = req.body;
  insertUser(newUser)
    .then(([user]) => {
      res.status(201).send({ user });
    })
    .catch(next);
};

exports.sendUser = (req, res, next) => {
  const { username } = req.params;
  getUsers(username)
    .then(([user]) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
