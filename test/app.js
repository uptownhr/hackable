const request = require('supertest'),
  chai = require('chai'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  User = require('../models/User'),
  Post = require('../models/Post'),
  Product = require('../models/Product')

const expect = chai.expect
const app = require('../index.js').server

const user = request.agent(app)
const USER_INFO = {
  email: 'admin@admin.com',
  password: 'asdfasdf'
}

const TEST_USER = User({ email: 'asdf@asdf.com', password: 'asdf' })

describe('App', () => {
  before(done => {
    user
      .post('/auth/login')
      .send(USER_INFO)
      .expect(302, done)
  })

  before(done => {
    TEST_USER.save(done)
  })

  describe('GET /', () => {
    it('should return 200 OK', done => {
      request(app)
        .get('/')
        .expect(200, done);
    });
  });

  describe('GET /auth/login', () => {
    it('should return 200 OK', done => {
      request(app)
        .get('/auth/login')
        .expect(200, done);
    });
  });

  describe('GET /auth/logout', () => {
    it('should return 302 redirect', done => {
      request(app)
        .get('/auth/logout')
        .expect(302, done)
    })
  });

  describe('GET /auth/register', () => {
    it('should return 200 OK', done => {
      request(app)
        .get('/auth/register')
        .expect(200, done);
    });
  });

  describe('GET /auth/o/twitter', () => {
    it('should return 302 redirect', done => {
      request(app)
        .get('/auth/o/twitter')
        .expect(302, done)
    })
  });

  describe('GET /auth/o/twitter/callback', () => {
    it('should return 302 redirect', done => {
      request(app)
        .get('/auth/o/twitter/callback')
        .expect(302, done)
    })
  });

  describe('GET /auth/o/testing/', () => {
    it('should return 302 redirect', done => {
      request(app)
        .get('/auth/o/testing')
        .expect(302, done)
    })
  });

  describe('GET /auth/o/testing/callback', () => {
    it('should return 302 redirect', done => {
      request(app)
        .get('/auth/o/testing/callback')
        .expect(302, done)
    })
  });

  describe('GET /random-url', () => {
    it('should return 404', done => {
      request(app)
        .get('/reset')
        .expect(404, done);
    });
  });

  describe('GET /blog', () => {
    it('should return 200', done => {
      request(app)
        .get('/blog')
        .expect(200, done)
    })
  })

  describe('GET /blog/post/:id', () => {
    it('should return 200', async (done) => {
      const post = await Post.findOne({ title: 'First Blog Post' })

      var url = '/blog/post/' + post._id;
      request(app)
        .get(url)
        .expect(200, done)
    });
  });

  describe('GET /user/account', () => {
    it('should return 300 unauthorized', done => {
      request(app)
        .get('/user/account')
        .expect(302, done)
    })

    it('should return 200 when authorized', done => {
      user
        .get('/user/account')
        .expect(200, done)
    })
  })

  describe('GET /user/account/unlink/testing', () => {
    it('should return 302', done => {
      request(app)
        .get('/user/account/unlink/testing')
        .expect(302, done)
    })

  });

  describe('GET /user/account/unlink/mock_provider', () => {
    it('should return 302', done => {
      user
        .get('/user/account/unlink/mock_provider')
        .expect(302, done)
    })

    it('should not find the mock_provider', async done => {
      try {
        const user = await User.findOne({ email: USER_INFO.email })
        var providers = _.map(user.providers, 'name');
        expect('mock_provider').to.not.be.oneOf(providers);
      } catch (err) {
        return done(err);
      }

      done();
    });

  });

  describe('POST /user/account', () => {
    it('should 302 redirect when invalid email is given', done => {
      user.post('/user/account')
        .send({ email: 'asdf' })
        .expect(302, done)
    })

    it('should 302 redirect to /user/accounts when valid email address given', done => {
      const email = 'zzzz@aol.com'

      user.post('/user/account')
        .send({ email })
        .expect(302, (e, res) => {
          if (e) return done(e)
          res.header.location.should.equal('/user/account')
          User.findOne({ email }, (err, found) => {
            found.should.not.be.null
            done()
          })
        })
    })

    it('should 302 redirect and not update if email is taken', done => {
      const email = 'asdf@asdf.com'
      user.post('/user/account')
        .send({ email })
        .expect(302, e => {
          User.findOne({ email }, (err, user) => {
            user._id.should.eql(TEST_USER._id)
            done()
          })
        })
    })
  })

  describe('POST /charge', () => {
    it('should return 200 OK', done => {
      Product.findOne((err, product) => {
        const req = { stripeToken: 'gordo', id: product._id }
        request(app)
          .post('/charge')
          .send(req)
          .expect(302, done)
      })
    })
  })

  describe('POST /auth/login', () => {
    it('should not log user in if email not found', done => {
      user.get('/auth/logout')
        .then(() => (
            user
              .post('/auth/login')
              .send({ email: 'zzzzzz' })
              .expect(302)
          )
        )
        .then(() => (
            user
              .get('/user/account')
              .expect(302, done)
          )
        )
    })

    it('should not log user in if bad password', done => {
      user.get('/auth/logout')
        .expect(302, () => (
          user
            .post('/auth/login').send({ email: 'admin@admin.com' })
            .expect(302, () => {
              user
                .get('/admin/')
                .expect(302, done)
            })

        ))
    })
  })
})
