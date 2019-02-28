process.env.NODE_ENV = 'test';
const supertest = require('supertest');
const { expect } = require('chai');
const connection = require('../db/connection');
const app = require('../app');

const request = supertest(app);

describe('/api', () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  it('responds with 404 when route is not found /bad-url', () => request.get('/bad-url').expect(404).then(res => expect(res.body.msg).to.equal('Page not found')));
  describe('/topics', () => {
    it('GET 200 responds with an array of topic objects with properties slug and description', () => request.get('/api/topics').expect(200)
      .then((res) => {
        expect(res.body.topics).to.be.an('array');
        expect(res.body.topics[0]).to.be.an('object');
        expect(res.body.topics[0]).to.contain.keys('slug', 'description');
      }));
    it('POST 201 responds with the posted topic object', () => {
      const newTopic = { slug: 'Travel', description: 'Exploring the world' };
      return request.post('/api/topics').send(newTopic).expect(201).then((res) => {
        expect(res.body.topic).to.be.an('object');
        expect(res.body).to.have.all.keys('topic');
        expect(res.body.topic).to.contain.keys('slug', 'description');
      });
    });
    it('POST responds with status 422 when unable to process request (slug must be unique)', () => {
      const newTopic = { slug: 'cats', description: 'Not dogs' };
      return request.post('/api/topics').send(newTopic).expect(422).then(res => expect(res.body.msg).to.equal('Duplicate value, already exists'));
    });
    it('POST responds with status 400 for a bad request (invalid body)', () => {
      const newTopic = { topic: 'Travel' };
      return request.post('/api/topics').send(newTopic).expect(400).then(res => expect(res.body.msg).to.equal('Missing column / column does not exist'));
    });
    it('responds with status 405 for an invalid method on topics', () => request.delete('/api/topics').expect(405).then(res => expect(res.body.msg).to.equal('Unable to use method DELETE for this path')));
  });
  describe('/articles', () => {
    it('GET 200 responds with an array of article objects with keys author, title, article_id, topic, created_at and votes', () => request.get('/api/articles').expect(200).then((res) => {
      expect(res.body.articles).to.be.an('array');
      expect(res.body.articles[0]).to.be.an('object');
      expect(res.body.articles[0]).to.contain.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes');
    }));
    it('GET 200 should have a comment count parameter which is the total count of all the comments with this article_id', () => request.get('/api/articles').expect(200).then((res) => {
      expect(res.body.articles[0]).to.contain.keys('comment_count');
      expect(res.body.articles[0].comment_count).to.be.a('string');
    }));
    it('responds with status 405 for an invalid method on articles', () => request.delete('/api/articles').expect(405).then(res => expect(res.body.msg).to.equal('Unable to use method DELETE for this path')));
    it('GET takes an author query which filters the articles by the username value specified in the query', () => request.get('/api/articles?author=butter_bridge').expect(200).then((res) => {
      expect(res.body.articles[0].author).to.equal('butter_bridge');
      expect(res.body.articles[1].author).to.equal('butter_bridge');
    }));
    // fix when get users is added
    // it('GET responds with status 400 if author is not in the database', () => request.get('/api/articles?author=vik').expect(400).then(res => expect(res.body.msg).to.equal('Bad Request')));
    // come back to test when post users is done as currently there are no usernames without articles
    // it.only('responds with status 404 if the author exists but doesnt have any articles associated with it', () => {
    //   return request.get('/api/articles?author=rogersop').expect(404).then(res => expect(res.body.msg).to.equal('Page not found'));
    // });
    it('GET takes a topic query which filters the articles by the topic value specified in the query', () => request.get('/api/articles?topic=cats').expect(200).then((res) => {
      expect(res.body.articles[0].topic).to.equal('cats');
    }));
    it('GET responds with status 404 if topic is not in the database', () => request.get('/api/articles?topic=travel').expect(404).then(res => expect(res.body.msg).to.equal('Page not found')));
    it('GET responds with status 200 and empty array if topic exists but does not have any articles associated with it', () => {
      const newTopic = { slug: 'Travel', description: 'Exploring the world' };
      return request
        .post('/api/topics')
        .send(newTopic)
        .then(() => request
          .get('/api/articles?topic=Travel')
          .then((res) => {
            expect(res.body.articles).to.eql([]);
          }));
    });
    it('GET takes a sort_by query which sorts the articles by any valid column', () => request.get('/api/articles?sort_by=title').expect(200).then((res) => {
      expect(res.body.articles[0].title).to.equal('Z');
    }));
    it('GET sort query defaults to sort by date(created_at) when not specified', () => request.get('/api/articles').expect(200).then((res) => {
      expect(res.body.articles[0].created_at).to.equal('2018-11-15T00:00:00.000Z');
      expect(res.body.articles[1].created_at).to.equal('2014-11-16T00:00:00.000Z');
      expect(res.body.articles[2].created_at).to.equal('2010-11-17T00:00:00.000Z');
    }));
    it('GET responds with status 400 if trying to sort by column that doesn\'t exist', () => request.get('/api/articles?sort_by=username').expect(400).then(res => expect(res.body.msg).to.equal('Missing column / column does not exist')));
    it('GET takes an order query which can be set to asc or desc for ascending or descending', () => request.get('/api/articles?order=asc').expect(200).then((res) => {
      expect(res.body.articles[0].created_at).to.equal('1974-11-26T00:00:00.000Z');
      expect(res.body.articles[1].created_at).to.equal('1978-11-25T00:00:00.000Z');
      expect(res.body.articles[2].created_at).to.equal('1982-11-24T00:00:00.000Z');
    }));
    it('GET order query defaults to descending when not specified', () => request.get('/api/articles').expect(200).then((res) => {
      expect(res.body.articles[0].created_at).to.equal('2018-11-15T00:00:00.000Z');
      expect(res.body.articles[1].created_at).to.equal('2014-11-16T00:00:00.000Z');
      expect(res.body.articles[2].created_at).to.equal('2010-11-17T00:00:00.000Z');
    }));
    it('GET responds with status 400 if order query specified in url is not asc or desc', () => request.get('/api/articles?order=invalid_order').expect(400).then(res => expect(res.body.msg).to.equal('Bad Request')));
    it('POST 201 responds with posted article object', () => {
      const newArticle = {
        title: 'Cats or dogs?',
        body: 'Can\'t decide...',
        topic: 'cats',
        username: 'butter_bridge',
      };
      return request.post('/api/articles').send(newArticle).expect(201).then((res) => {
        expect(res.body.article).to.be.an('object');
        expect(res.body).to.have.all.keys('article');
        expect(res.body.article).to.contain.keys('title', 'body', 'topic', 'author', 'article_id', 'created_at', 'votes');
      });
    });
    it('POST responds with status 400 if there is no title, body, topic or username', () => {
      const newArticle = {
        title: 'Cats or dogs?',
        body: 'Can\'t decide...',
        topic: 'cats',
      };
      return request.post('/api/articles').send(newArticle).expect(400).then(res => expect(res.body.msg).to.equal('Failed to add to database, missing data'));
    });
    it('POST responds with status 422 for a topic or username that does not exist', () => {
      const newArticle = {
        title: 'Cats or dogs?',
        body: 'Can\'t decide...',
        topic: 'dogs',
        username: 'butter_bridge',
      };
      return request.post('/api/articles').send(newArticle).expect(422);
    });
    it('GET /api/articles/:article_id 200 responds with an article object with properties author, title, article_id, body, topic, created_at, votes, comment_count', () => request.get('/api/articles/1').expect(200).then((res) => {
      expect(res.body.article).to.be.an('object');
      expect(res.body.article).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count');
    }));
    it('GET /api/articles/:article_id responds with status 400 for invalid input for article_id', () => request.get('/api/articles/cat').expect(400).then(res => expect(res.body.msg).to.equal('Invalid input syntax in url')));
    it('GET /api/articles/:article_id responds with status 404 for a valid input for article_id where article does not exist in the database', () => request.get('/api/articles/100').expect(404).then(res => expect(res.body.msg).to.equal('Page not found')));
  });
});
