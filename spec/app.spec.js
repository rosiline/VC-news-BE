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
    it('GET 200 responds with an array of topic objects with properties slug and description', () => request.get('/api/topics').expect(200)
      .then((res) => {
        expect(res.body.topics).to.be.an('array');
        expect(res.body.topics[0]).to.be.an('object');
        expect(res.body.topics[0]).to.contain.keys('slug', 'description');
      }));
    it('responds with 404 when route is not found', () => request.get('/api/topic').expect(404));
    it('POST 201 responds with the posted topic object', () => {
      const newTopic = { slug: 'Travel', description: 'Exploring the world' };
      return request.post('/api/topics').send(newTopic).expect(201).then((res) => {
        expect(res.body.topic).to.be.an('object');
        expect(res.body).to.have.all.keys('topic');
        expect(res.body.topic).to.contain.keys('slug', 'description');
      });
    });
    xit('responds with 400 when a bad POST request is made (slug must be unique)', () => {
      const newTopic = { slug: 'coding', description: 'Code is love, code is life' };
      return request.post('/api/topics').send(newTopic).expect(400);
    });
    it('responds with 400 for a bad POST request (invalid body)', () => {
      const newTopic = { topic: 'Travel' };
      return request.post('/api/topics').send(newTopic).expect(400);
    });
  });
});
