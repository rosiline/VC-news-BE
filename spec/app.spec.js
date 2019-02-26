process.env.NODE_ENV = 'test';
const supertest = require('supertest');
const { expect } = require('chai');
const connection = require('../db/connection');
const app = require('../app');

const request = supertest(app);

describe('/api', () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe('/topics', () => {
    it('GET 200 responds with an array of topic objects with properties slug and description', () => {
      request.get('/api/topics').expect(200)
        .then((res) => {
          expect(res.body.topics).to.be.an('array');
          expect(res.body.topics[0]).to.be.an('object');
          expect(res.body.topics[0]).to.contain.keys('slug', 'description');
        });
    });
  });
});
