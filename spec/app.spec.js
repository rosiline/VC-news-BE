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
  it('/api returns a json object of all available endpoints on this API', () => request.get('/api').expect(200).then((res) => {
    expect(res.body).to.be.an('object');
    expect(res.body).to.contain.keys('GET /api', 'GET /api/topics');
  }));
  describe('/api/topics', () => {
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
  describe('/api/articles', () => {
    it('GET 200 responds with an array of article objects with keys author, title, article_id, topic, created_at and votes', () => request.get('/api/articles').expect(200).then((res) => {
      expect(res.body.articles).to.be.an('array');
      expect(res.body.articles[0]).to.be.an('object');
      expect(res.body.articles[0]).to.contain.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes');
    }));
    it('GET 200 should have a comment count parameter which is the total count of all the comments with this article_id', () => request.get('/api/articles').expect(200).then((res) => {
      expect(res.body.articles[0]).to.contain.keys('comment_count');
      expect(res.body.articles[0].comment_count).to.be.a('string');
    }));
    it('GET 200 should have a total_count parameter which shows the total number of articles', () => request.get('/api/articles').expect(200).then((res) => {
      expect(res.body).to.contain.keys('total_count');
      expect(res.body.total_count).to.be.a('number');
    }));
    it('GET 200 total_count should take filters into account but ignore limits and paging', () => request.get('/api/articles?topic=mitch').expect(200).then((res) => {
      expect(res.body.total_count).to.equal(11);
      expect(res.body.articles).to.have.length(10);
    }));
    it('GET 200 takes an author query which filters the articles by the username value specified in the query', () => request.get('/api/articles?author=butter_bridge').expect(200).then((res) => {
      expect(res.body.articles[0].author).to.equal('butter_bridge');
      expect(res.body.articles[1].author).to.equal('butter_bridge');
    }));
    it('GET 200 responds with status 404 if author is not in the database', () => request.get('/api/articles?author=rosiline').expect(404).then(res => expect(res.body.msg).to.equal('Page not found')));
    it('GET responds with status 200 and empty array if the author exists but doesnt have any articles associated with it', () => {
      const newUser = {
        username: 'rosiline',
        avatar_url: 'https://pbs.twimg.com/profile_images/602487493859115008/KG5KJLh5_400x400.jpg',
        name: 'vik',
      };
      return request.post('/api/users').send(newUser).then(() => request.get('/api/articles?author=rosiline').expect(200).then((res) => {
        expect(res.body.articles).to.eql([]);
      }));
    });
    it('GET 200 takes a topic query which filters the articles by the topic value specified in the query', () => request.get('/api/articles?topic=cats').expect(200).then((res) => {
      expect(res.body.articles[0].topic).to.equal('cats');
    }));
    it('GET 200 responds with an empty array for articles queried with non-existent topic', () => request.get('/api/articles?topic=travel').expect(200).then(res => expect(res.body.articles).to.eql([])));
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
    it('GET 200 takes a sort_by query which sorts the articles by any valid column', () => request.get('/api/articles?sort_by=title').expect(200).then((res) => {
      expect(res.body.articles[0].title).to.equal('Z');
    }));
    it('GET 200 sort query defaults to sort by date(created_at) when not specified', () => request.get('/api/articles').expect(200).then((res) => {
      expect(res.body.articles[0].created_at).to.equal('2018-11-15T00:00:00.000Z');
      expect(res.body.articles[1].created_at).to.equal('2014-11-16T00:00:00.000Z');
      expect(res.body.articles[2].created_at).to.equal('2010-11-17T00:00:00.000Z');
    }));
    it('GET 200 will ignore query if trying to sort by column that doesn\'t exist', () => request.get('/api/articles?sort_by=username').expect(200).then((res) => {
      expect(res.body.articles[0].created_at).to.equal('2018-11-15T00:00:00.000Z');
      expect(res.body.articles[1].created_at).to.equal('2014-11-16T00:00:00.000Z');
      expect(res.body.articles[2].created_at).to.equal('2010-11-17T00:00:00.000Z');
    }));
    it('GET 200 takes an order query which can be set to asc or desc for ascending or descending', () => request.get('/api/articles?order=asc').expect(200).then((res) => {
      expect(res.body.articles[0].created_at).to.equal('1974-11-26T00:00:00.000Z');
      expect(res.body.articles[1].created_at).to.equal('1978-11-25T00:00:00.000Z');
      expect(res.body.articles[2].created_at).to.equal('1982-11-24T00:00:00.000Z');
    }));
    it('GET 200 order query defaults to descending when not specified', () => request.get('/api/articles').expect(200).then((res) => {
      expect(res.body.articles[0].created_at).to.equal('2018-11-15T00:00:00.000Z');
      expect(res.body.articles[1].created_at).to.equal('2014-11-16T00:00:00.000Z');
      expect(res.body.articles[2].created_at).to.equal('2010-11-17T00:00:00.000Z');
    }));
    it('GET responds with status 400 if order query specified in url is not asc or desc', () => request.get('/api/articles?order=invalid_order').expect(400).then(res => expect(res.body.msg).to.equal('Bad Request')));
    it('GET 200 takes a limit query which limits the number of responses returned', () => request.get('/api/articles?limit=5').expect(200).then(res => expect(res.body.articles).to.have.length(5)));
    it('GET 200 when limit query is not specified it defaults to 10 articles', () => request.get('/api/articles').expect(200).then(res => expect(res.body.articles).to.have.length(10)));
    it('GET 200 takes a p query which specifies the page at which to start', () => request.get('/api/articles?p=2').expect(200).then(res => expect(res.body.articles[0].article_id).to.equal(11)));
    it('GET 200 p query defaults to 1 and returns first page if not specified', () => request.get('/api/articles').then(res => expect(res.body.articles[0].article_id).to.equal(1)));
    it('GET 200 page query is affected by the limit', () => request.get('/api/articles?limit=5&p=2').then((res) => {
      expect(res.body.articles[0].article_id).to.equal(6);
      expect(res.body.articles).to.have.length(5);
    }));
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
    it('responds with status 405 for an invalid method on articles', () => request.delete('/api/articles').expect(405).then(res => expect(res.body.msg).to.equal('Unable to use method DELETE for this path')));
    describe('/api/articles/:article_id', () => {
      it('GET status 200 responds with an article object with properties author, title, article_id, body, topic, created_at, votes, comment_count', () => request.get('/api/articles/1').expect(200).then((res) => {
        expect(res.body.article).to.be.an('object');
        expect(res.body.article).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count');
      }));
      it('GET responds with status 400 for invalid input for article_id', () => request.get('/api/articles/cat').expect(400).then(res => expect(res.body.msg).to.equal('Invalid input syntax in url')));
      it('GET responds with status 404 for a valid input for article_id where article does not exist in the database', () => request.get('/api/articles/100').expect(404).then(res => expect(res.body.msg).to.equal('Page not found')));
      it('PATCH status 200 increases votes and returns the updated article', () => {
        const votes = { inc_votes: 1 };
        return request.patch('/api/articles/1').send(votes).expect(200).then((res) => {
          expect(res.body.article.votes).to.equal(101);
          expect(res.body.article).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count');
        });
      });
      it('PATCH status 200 decreases votes and returns the updated article', () => {
        const votes = { inc_votes: -1 };
        return request.patch('/api/articles/1').send(votes).expect(200).then((res) => {
          expect(res.body.article.votes).to.equal(99);
          expect(res.body.article).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count');
        });
      });
      it('PATCH returns status 400 when inc_votes is not a number', () => {
        const votes = { inc_votes: 'cat' };
        return request.patch('/api/articles/1').send(votes).expect(400).then(res => expect(res.body.msg).to.equal('Bad Request'));
      });
      it('PATCH responds with 404 when non existent article_id is used', () => {
        const votes = { inc_votes: 1 };
        return request.patch('/api/articles/42').send(votes).expect(404).then(res => expect(res.body.msg).to.equal('Page not found'));
      });
      it('PATCH with no body responds with an unmodified article', () => request.patch('/api/articles/1').send({}).expect(200).then((res) => {
        expect(res.body.article.votes).to.equal(100);
        expect(res.body.article).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count');
      }));
      it('DELETE status 204 deletes the given article by article_id', () => request.delete('/api/articles/1').expect(204));
      it('DELETE returns 404 when trying to delete an article that does not exist in the database', () => request.delete('/api/articles/100').expect(404).then(res => expect(res.body.msg).to.equal('Page not found')));
      it('DELETE returns 400 when article_id is not valid (not a number)', () => request.delete('/api/articles/article1').expect(400).then(res => expect(res.body.msg).to.equal('Invalid input syntax in url')));
      it('responds with status 405 for an invalid method on the path', () => request.post('/api/articles/20').expect(405).then(res => expect(res.body.msg).to.equal('Unable to use method POST for this path')));
      describe('/api/articles/:article_id/comments', () => {
        it('GET status 200 responds with an array of comments for the given article_id', () => request.get('/api/articles/1/comments').expect(200).then((res) => {
          expect(res.body.comments).to.be.an('array');
          expect(res.body.comments[0]).to.be.an('object');
          expect(res.body.comments[0]).to.contain.keys('comment_id', 'votes', 'created_at', 'author', 'body');
        }));
        it('GET returns status 400 for invalid input for article_id', () => request.get('/api/articles/cat').expect(400).then(res => expect(res.body.msg).to.equal('Invalid input syntax in url')));
        it('GET returns status 404 for a valid input for article_id when the article does not exist', () => request.get('/api/articles/42/comments').expect(404).then(res => expect(res.body.msg).to.equal('Page not found')));
        it('GET status 200 accepts a sort_by query which sorts articles by any valid column', () => request.get('/api/articles/1/comments?sort_by=votes').expect(200).then((res) => {
          expect(res.body.comments[0].votes).to.equal(100);
          expect(res.body.comments[1].votes).to.equal(16);
          expect(res.body.comments[2].votes).to.equal(14);
        }));
        it('GET status 200 sort_by query defaults to date(created_at) if not specified', () => request.get('/api/articles/1/comments').expect(200).then((res) => {
          expect(res.body.comments[0].created_at).to.equal('2016-11-22T00:00:00.000Z');
          expect(res.body.comments[1].created_at).to.equal('2015-11-23T00:00:00.000Z');
          expect(res.body.comments[2].created_at).to.equal('2014-11-23T00:00:00.000Z');
        }));
        it('GET status 200 accepts order query which can be set to asc or desc', () => request.get('/api/articles/1/comments?order=asc').expect(200).then((res) => {
          expect(res.body.comments[0].created_at).to.equal('2000-11-26T00:00:00.000Z');
          expect(res.body.comments[1].created_at).to.equal('2005-11-25T00:00:00.000Z');
          expect(res.body.comments[2].created_at).to.equal('2006-11-25T00:00:00.000Z');
        }));
        it('GET status 200 order query defaults to desc if not specified', () => request.get('/api/articles/1/comments').expect(200).then((res) => {
          expect(res.body.comments[0].created_at).to.equal('2016-11-22T00:00:00.000Z');
          expect(res.body.comments[1].created_at).to.equal('2015-11-23T00:00:00.000Z');
          expect(res.body.comments[2].created_at).to.equal('2014-11-23T00:00:00.000Z');
        }));
        it('GET status 200 takes a limit query which limits the number of responses returned', () => request.get('/api/articles/1/comments?limit=5').expect(200).then(res => expect(res.body.comments).to.have.length(5)));
        it('GET status 200 limit query defaults to 10 when not specified', () => request.get('/api/articles/1/comments').expect(200).then(res => expect(res.body.comments).to.have.length(10)));
        it('GET takes a p query which specifies the page at which to start', () => request.get('/api/articles/1/comments?p=2').expect(200).then(res => expect(res.body.comments[0].comment_id).to.equal(12)));
        it('GET p query defaults to first page if not specified', () => request.get('/api/articles/1/comments').expect(200).then(res => expect(res.body.comments[0].comment_id).to.equal(2)));
        it('GET page query is affected by the limit', () => request.get('/api/articles/1/comments?limit=5&p=2').expect(200).then((res) => {
          expect(res.body.comments[0].comment_id).to.equal(7);
          expect(res.body.comments).to.have.length(5);
        }));
        it('POST status 201 responds with the posted comment object', () => {
          const newComment = { body: 'First!...', username: 'icellusedkars' };
          return request.post('/api/articles/1/comments').send(newComment).expect(201).then((res) => {
            expect(res.body.comment).to.be.an('object');
            expect(res.body.comment).to.contain.keys('comment_id', 'author', 'article_id', 'votes', 'created_at', 'body');
          });
        });
        it('POST responds with 404 when given a non existent article_id', () => {
          const newComment = { body: 'First!...', username: 'icellusedkars' };
          return request.post('/api/articles/42/comments').send(newComment).expect(404).then(res => expect(res.body.msg).to.equal('Page not found'));
        });
        it('returns status 405 for an invalid method on this path', () => request.delete('/api/articles/1/comments').expect(405).then(res => expect(res.body.msg).to.equal('Unable to use method DELETE for this path')));
      });
    });
  });
  describe('/api/comments/:comment_id', () => {
    it('PATCH status 200 increases votes and returns the updated comment object', () => {
      const votes = { inc_votes: 1 };
      return request.patch('/api/comments/1').send(votes).expect(200).then((res) => {
        expect(res.body.comment).to.be.an('object');
        expect(res.body.comment.votes).to.equal(17);
      });
    });
    it('PATCH status 200 decreases votes and returns the updated comment object', () => {
      const votes = { inc_votes: -1 };
      return request.patch('/api/comments/1').send(votes).expect(200).then((res) => {
        expect(res.body.comment).to.be.an('object');
        expect(res.body.comment.votes).to.equal(15);
      });
    });
    it('PATCH status 200 with no body responds with an unmodified comment', () => request.patch('/api/comments/1').send({}).expect(200).then((res) => {
      expect(res.body.comment).to.be.an('object');
      expect(res.body.comment.votes).to.equal(16);
    }));
    it('PATCH responds with 400 if given an invalid inc_votes', () => {
      const votes = { inc_votes: 'cat' };
      return request.patch('/api/comments/1').send(votes).expect(400).then(res => expect(res.body.msg).to.equal('Bad Request'));
    });
    it('PATCH responds with 404 when non existent comment_id is used', () => {
      const votes = { inc_votes: 1 };
      return request.patch('/api/comments/42').send(votes).expect(404).then(res => expect(res.body.msg).to.equal('Page not found'));
    });
    it('DELETE returns 204 and removes comment from database', () => request.delete('/api/comments/1').expect(204));
    it('DELETE returns 404 for a non existent comment_id', () => request.delete('/api/comments/100').expect(404).then(res => expect(res.body.msg).to.equal('Page not found')));
    it('returns status 405 for an invalid method on the path', () => request.get('/api/comments/1').expect(405).then(res => expect(res.body.msg).to.equal('Unable to use method GET for this path')));
  });
  describe('/api/users', () => {
    it('GET status 200 returns an array of user objects with properties username, avatar_url and name', () => request.get('/api/users').expect(200).then((res) => {
      expect(res.body.users).to.be.an('array');
      expect(res.body.users[0]).to.be.an('object');
      expect(res.body.users[0]).to.contain.keys('username', 'avatar_url', 'name');
    }));
    it('POST status 201 responds with the posted user object', () => {
      const newUser = {
        username: 'rosiline',
        avatar_url: 'https://pbs.twimg.com/profile_images/602487493859115008/KG5KJLh5_400x400.jpg',
        name: 'vik',
      };
      return request.post('/api/users').send(newUser).expect(201).then((res) => {
        expect(res.body.user).to.be.an('object');
        expect(res.body.user).to.contain.keys('username', 'avatar_url', 'name');
      });
    });
    it('returns status 405 for an invalid method on this path', () => request.delete('/api/users').expect(405).then(res => expect(res.body.msg).to.equal('Unable to use method DELETE for this path')));
    describe('/api/users/:username', () => {
      it('GET status 200 responds with a user object with specified username', () => request.get('/api/users/butter_bridge').expect(200).then((res) => {
        expect(res.body.user).to.be.an('object');
        expect(res.body.user).to.contain.keys('username', 'avatar_url', 'name');
      }));
      it('returns status 405 for an invalid method on this path', () => request.delete('/api/users/butter_bridge').expect(405).then(res => expect(res.body.msg).to.equal('Unable to use method DELETE for this path')));
    });
  });
});
