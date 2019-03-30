# VC-Knews API

This project was built while studying at Northcoders to practice and test my skills in Node.js, PostgreSQL and building RESTful APIs.

Hosted on Heroku: https://nc-knews-vik.herokuapp.com/api

For readability recommended to view with a JSON Viewer extension.

## Prerequisites

You will require Node.js for this project.

## Installing

1. Fork your own copy of this repository
2. Navigate to the folder where you want to store it though the terminal and paste the following command in the terminal:
```
git clone <GitHub repo link>
```
3. cd into the repository
4. Run the following command in your terminal to install all the node modules required
```
npm install
```
This will install the following dependencies:
```
body-parser: ^1.18.3,
cors: ^2.8.5,
express: ^4.16.4,
knex: ^0.15.2,
pg: ^7.6.1
```
And the following developer dependencies:
```
chai: ^4.2.0,
eslint: ^5.14.1,
eslint-config-airbnb: ^17.1.0,
eslint-plugin-import: ^2.14.0,
husky: ^1.1.4,
mocha: ^6.0.2,
nodemon: ^1.18.10,
supertest: ^3.4.2
```
## Database setup

1. You will need to create a config file called knexfile.js and may want to git ignore it if you include any log in details. The config file should look like this:
```
const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || 'development';

const baseConfig = {
  client: 'pg',
  seeds: {
    directory: './db/seed',
  },
  migrations: {
    directory: './db/migrations',
  },
};

const dbConfig = {
  development: {
    connection: {
      database: 'nc_knews',
      username: 'username',
      password: 'password',
    },
  },
  test: {
    connection: {
      database: 'nc_knews_test',
      username: 'username',
      password: 'password',
    },
  },
  production: {
    connection: `${DB_URL}?ssl=true`,
  },
};

module.exports = { ...baseConfig, ...dbConfig[ENV] };

```
Note: PostgreSQL username and password is only required for linux users

2. To set up and seed the database you can use these pre written scripts:
```
npm run setup-dbs
npm run migrate-latest
npm run migrate-rollback
npm run seed
```

## Testing

There are two test files in this project:
1. app.spec.js located in the spec folder, tests all the api endpoints to make sure they are working as desired, including error handling. Tests can be run by using
```
npm run test
```
2. utils.spec.js located in the db/utils folder which tests the utility functions that were used to manipulate data when seeding the database. These can be tested by running
```
npm run test-utils
```
## Routes
For all available endpoints view the endpoints.json file or access it on /api route as linked at the top of this page

## Deployment

If you wish to have your own live version of the API you can deploy it on Heroku, instructions how to do so can be found here https://devcenter.heroku.com/articles/git

## Useful docs

* Node.js - https://nodejs.org/en/docs/
* Express - https://expressjs.com/
* Knex - https://knexjs.org/
* PostgreSQL - https://node-postgres.com/
* Heroku - https://devcenter.heroku.com/articles/getting-started-with-nodejs

## Author

Viktorija Cumacenko

## Acknowledgements

Northcoders