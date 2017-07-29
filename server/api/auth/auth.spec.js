var app = require('../../app');
var auth = require('../../components/auth/auth.service');
var request = require('supertest');
var should = require('should');
var testutils = require('../../utils/testutils');
var Person = require('../person/person.model');
var User = require('../user/user.model');

describe('auth api', function() {
  describe('/login', function() {
    beforeEach(function(done) {
      testutils.clearDb()
        .then(function() { done(); });
    });

    afterEach(function(done) {
      testutils.clearDb()
        .then(function() { done(); });
    });

    it('should reject if username not supplied', function(done) {
      request(app)
        .post('/api/auth/login')
        .send({})
        .expect(401)
        .end(function(err, res) {
          if (err) return done(err);
          Object.keys(res.body).length.should.eql(1);
          res.body.message.should.eql('username is required.');
          done();
        });
    });

    it('should reject if password not supplied', function(done) {
      request(app)
        .post('/api/auth/login')
        .send({ username: 'foo' })
        .expect(401)
        .end(function(err, res) {
          if (err) return done(err);
          Object.keys(res.body).length.should.eql(1);
          res.body.message.should.eql('password is required.');
          done();
        });
    });

    it('should reject if role not supplied', function(done) {
      request(app)
        .post('/api/auth/login')
        .send({ username: 'foo', password: 'foo' })
        .expect(401)
        .end(function(err, res) {
          if (err) return done(err);
          Object.keys(res.body).length.should.eql(1);
          res.body.message.should.eql('role is required.');
          done();
        });
    });

    it('should reject if role is invalid', function(done) {
      request(app)
        .post('/api/auth/login')
        .send({ username: 'foo', password: 'foo', role: 'quux' })
        .expect(401)
        .end(function(err, res) {
          if (err) return done(err);
          Object.keys(res.body).length.should.eql(1);
          res.body.message.should.eql('role is invalid.');
          done();
        });
    });

    it('should reject if user not found', function(done) {
      request(app)
        .post('/api/auth/login')
        .send({ username: 'foo', password: 'bar', role: 'admin' })
        .expect(401)
        .end(function(err, res) {
          if (err) return done(err);
          Object.keys(res.body).length.should.eql(1);
          res.body.message.should.eql('This username is not registered.');
          done();
        });
    });

    it('should reject if password incorrect', function(done) {
      User.create({
        username: 'foo',
        email: 'test@test.com',
        password: 'bar',
        activated: true
      })
        .then(function(user) {
          request(app)
            .post('/api/auth/login')
            .send({ username: 'foo', password: 'quux', role: 'admin' })
            .expect(401)
            .end(function(err, res) {
              if (err) return done(err);
              Object.keys(res.body).length.should.eql(1);
              res.body.message.should.eql('This password is not correct.');
              done();
            });
        });
    });

    it('should reject if activated is false', function(done) {
      User.create({
        username: 'foo',
        email: 'test@test.com',
        password: 'bar',
        activated: false
      })
        .then(function(user) {
          request(app)
            .post('/api/auth/login')
            .send({ username: 'foo', password: 'bar', role: 'admin' })
            .expect(401)
            .end(function(err, res) {
              if (err) return done(err);
              Object.keys(res.body).length.should.eql(1);
              res.body.message.should.eql('This account is not activated.');
              done();
            });
        });
    });

    it('should reject if there is no person link', function(done) {
      User.create({
        username: 'foo',
        email: 'test@test.com',
        password: 'bar',
        activated: true
      })
        .then(function(user) {
          request(app)
            .post('/api/auth/login')
            .send({ username: 'foo', password: 'bar', role: 'admin' })
            .expect(401)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
              if (err) return done(err);
              Object.keys(res.body).length.should.eql(1);
              res.body.message.should.eql('This account is not linked to a person.');
              done();
            });
        });
    });

    it('should reject if the linked person does not have sufficient role privileges', function(done) {
      var person;

      Person.create({
        personType: 'instructor',
        firstName: 'Foo',
        lastName: 'Bar',
        tag: 'test'
      })
      .then(function (_person) {
        person = _person;
        return User.create({
          username: 'foo',
          email: 'test@test.com',
          password: 'bar',
          activated: true,
          person: person._id
        });
      })
      .then(function(user) {
        request(app)
          .post('/api/auth/login')
          .send({ username: 'foo', password: 'bar', role: 'admin' })
          .expect(401)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err);
            Object.keys(res.body).length.should.eql(1);
            res.body.message.should.eql('This account does not have sufficient role privileges.');
            done();
          });
      });
    });

    it('should return the token if the password is correct and the role is sufficient', function(done) {
      var person;

      Person.create({
        personType: 'instructor',
        firstName: 'Foo',
        lastName: 'Bar',
        tag: 'test'
      })
      .then(function (_person) {
        person = _person;
        return User.create({
          username: 'foo',
          email: 'test@test.com',
          password: 'bar',
          activated: true,
          person: person._id
        });
      })
      .then(function(user) {
        request(app)
          .post('/api/auth/login')
          .send({ username: 'foo', password: 'bar', role: 'instructor' })
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err);
            var expectedToken = auth.signToken(user._id);
            var actualToken = res.body.token;
            actualToken.should.eql(expectedToken);
            res.body.maxRole.should.eql('instructor');
            done();
          });
      });
    });
  });
});
