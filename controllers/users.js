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
