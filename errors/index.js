exports.handleInvalidPath = (req, res) => {
  res.status(404).send({ msg: 'Page not found' });
};

exports.handle400 = (err, req, res, next) => {
  const sqlErrors = {
    42703: 'Missing column / column does not exist',
    23502: 'Failed to add to database, missing data',
    '22P02': 'Invalid input syntax in url',
  };
  if (sqlErrors[err.code] || err.status === 400) res.status(400).send({ msg: sqlErrors[err.code] || 'Bad Request' });
  else next(err);
};

exports.handle404 = (err, req, res, next) => {
  if (err.status === 404) res.status(404).send({ msg: 'Page not found' });
  else next(err);
};

exports.handle405 = (req, res) => {
  res.status(405).send({ msg: `Unable to use method ${req.method} for this path` });
};

exports.handle422 = (err, req, res, next) => {
  const sqlErrors = {
    23505: 'Duplicate value, already exists',
    23503: 'Failed to add to database, topic/username/article does not exist',
  };
  if (sqlErrors[err.code] || err.status === 422) res.status(422).send({ msg: sqlErrors[err.code] || 'Unable to process request' });
  else next(err);
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal server error' });
};
