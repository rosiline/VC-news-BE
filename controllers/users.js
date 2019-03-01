const { getUsers } = require('../models/users');

exports.sendUsers = (req, res, next) => {
  getUsers()
    .then((users) => {
      console.log(users);
      res.status(200).send({ users });
    })
    .catch(next);
};
