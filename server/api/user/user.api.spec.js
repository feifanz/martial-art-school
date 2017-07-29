var ActivationRequest = require('../user/activation_request.model');
var app = require('../../app');
var Person = require('../person/person.model');
var q = require('q');
var request = require('supertest');
var should = require('should');
var testutils = require('../../utils/testutils');
var User = require('../user/user.model');

describe('/api/users', function() {
  describe('POST /requests (createRequest)', function() {
    var token;

    beforeEach(function(done) {
      testutils.clearDb()
      .then(function () { return testutils.auth(); })
      .then(function (result) { token = result.token; })
      .then(function() { done(); });
    });

    afterEach(function(done) {
      testutils.clearDb()
      .then(function() { done(); });
    });

    it('should reject if the user is invalid', function(done) {
      request(app)
      .post('/api/users/requests')
      .send({
        username: 'foo',
        email: 'foo', // invalid
        password: 'foo',
        role: 'admin'
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        Object.keys(res.body).length.should.eql(1);
        res.body[0].message.should.eql('email is invalid.');
        done();
      });
    });

    it('should reject if the requested role is invalid', function(done) {
      request(app)
      .post('/api/users/requests')
      .send({
        username: 'foo',
        email: 'foo@foo.com',
        password: 'foo',
        role: 'foo'
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        Object.keys(res.body).length.should.eql(1);
        res.body[0].message.should.eql('`foo` is not a valid enum value for path `role`.');
        done();
      });
    });

    it('should create the user and the request otherwise', function(done) {
      request(app)
      .post('/api/users/requests')
      .send({
        username: 'foo',
        email: 'foo@foo.com',
        password: 'foo',
        role: 'admin'
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        Object.keys(res.body).length.should.eql(4);
        res.body.role.should.eql('admin');
        res.body.status.should.eql('PENDING');
        User.find({}).then(function (users) {
          users.length.should.eql(2); // the auth util user and the created user
          users[1].username.should.eql('foo');
          users[1].email.should.eql('foo@foo.com');
          users[1].activated.should.eql(false);
          res.body.user._id.should.eql(String(users[1]._id));
          ActivationRequest.find({})
          .then(function (reqs) {
            reqs.length.should.eql(1);
            String(reqs[0].user).should.eql(String(users[1]._id));
            reqs[0].role.should.eql('admin');
            reqs[0].status.should.eql('PENDING');
            done();
          });
        });
      });
    });
  });

  describe('GET /requests (getRequests)', function() {
    var token;

    beforeEach(function(done) {
      testutils.clearDb()
      .then(function () { return testutils.auth(); })
      .then(function (result) { token = result.token; })
      .then(function() { done(); });
    });

    afterEach(function(done) {
      testutils.clearDb()
      .then(function() { done(); });
    });

    it('should return all the requests', function(done) {
      var users;

      User.create([0, 1].map(function (i) {
        return {
          username: String(i),
          email: i + '@test.com',
          password: String(i)
        };
      }))
      .then(function (_users) {
        users = _users;
        return ActivationRequest.create(users.map(function (user) {
          return {
            user: user._id,
            role: 'admin'
          };
        }));
      })
      .then(function (reqs) {
        request(app)
        .get('/api/users/requests')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.length.should.eql(2);
          res.body.forEach(function (req, i) {
            Object.keys(res.body[i]).length.should.eql(4);
            String(res.body[i].user.username).should.eql(String(users[i].username));
            String(res.body[i].user.email).should.eql(String(users[i].email));
            res.body[i].user.activated.should.eql(false);
            res.body[i].role.should.eql('admin');
            res.body[i].status.should.eql('PENDING');
          });
          done();
        });
      });
    });

    it('should populate the persons', function(done) {
      var user, req;

      User.create({
        username: 'foo',
        email: 'foo@foo.com',
        password: 'foo'
      })
      .then(function (_user) {
        user = _user;
        return ActivationRequest.create({
          user: user._id,
          role: 'admin'
        });
      })
      .then(function (_req) {
        req = _req;
        return Person.create({
          personType: 'instructor',
          firstName: 'Foo',
          lastName: 'Bar',
          tag: 'test'
        });
      })
      .then(function (person) {
        var dfd = q.defer();

        request(app)
        .post('/api/users/requests/' + req._id + '/approve/' + person._id)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end(function(err) {
          if (err) return done(err);
          dfd.resolve();
        });

        return dfd.promise;
      })
      .then(function () {
        request(app)
        .get('/api/users/requests')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.length.should.eql(1);
          Object.keys(res.body[0]).length.should.eql(4);
          res.body[0]._id.should.exist;
          res.body[0].role.should.eql('admin');
          res.body[0].status.should.eql('APPROVED');
          Object.keys(res.body[0].user).length.should.eql(5);
          res.body[0].user.username.should.eql('foo');
          res.body[0].user.email.should.eql('foo@foo.com');
          res.body[0].user.activated.should.eql(true);
          res.body[0].user.person.firstName.should.eql('Foo');
          res.body[0].user._id.should.eql(String(user._id));
          done();
        });
      })
    });
  });

  describe('POST /requests/:requestId/approve/:personId (approveRequest)', function() {
    var token;

    beforeEach(function(done) {
      testutils.clearDb()
      .then(function () { return testutils.auth(); })
      .then(function (result) { token = result.token; })
      .then(function() { done(); });
    });

    afterEach(function(done) {
      testutils.clearDb()
      .then(function() { done(); });
    });

    it('should fail if requestId does not match a request in the db', function(done) {
      var id = 'aaaaaaaaaaaaaaaaaaaaaaaa';
      request(app)
      .post('/api/users/requests/' + id + '/approve/' + id)
      .set('Authorization', 'Bearer ' + token)
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        Object.keys(res.body).length.should.eql(1);
        res.body.errors.length.should.eql(1);
        Object.keys(res.body.errors[0]).length.should.eql(1);
        res.body.errors[0].message.should.eql('Request not found.');
        done();
      });
    });

    it('should fail if the request is not currently pending', function(done) {
      var user, req;

      User.create({
        username: 'foo',
        email: 'foo@foo.com',
        password: 'foo'
      })
      .then(function (_user) {
        user = _user;
        return ActivationRequest.create({
          user: user._id,
          role: 'admin'
        });
      })
      .then(function (_req) {
        req = _req;
        return Person.create({
          personType: 'instructor',
          firstName: 'Foo',
          lastName: 'Bar',
          tag: 'test'
        });
      })
      .then(function (person) {
        var dfd = q.defer();

        request(app)
        .post('/api/users/requests/' + req._id + '/approve/' + person._id)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end(function(err, res) {
          dfd.resolve(person);
        });

        return dfd.promise;
      })
      .then(function (person) {
        request(app)
        .post('/api/users/requests/' + req._id + '/approve/' + person._id)
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          Object.keys(res.body).length.should.eql(1);
          res.body.errors.length.should.eql(1);
          Object.keys(res.body.errors[0]).length.should.eql(1);
          res.body.errors[0].message.should.eql('Request is not currently pending.');
          done();
        });
      });
    });

    it('should fail if personId does not match a person in the db', function(done) {
      User.create({
        username: 'foo',
        email: 'foo@foo.com',
        password: 'foo'
      })
      .then(function (user) {
        return ActivationRequest.create({
          user: user._id,
          role: 'admin'
        });
      })
      .then(function (req) {
        var id = 'aaaaaaaaaaaaaaaaaaaaaaaa';
        request(app)
        .post('/api/users/requests/' + req._id + '/approve/' + id)
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          Object.keys(res.body).length.should.eql(1);
          res.body.errors.length.should.eql(1);
          Object.keys(res.body.errors[0]).length.should.eql(1);
          res.body.errors[0].message.should.eql('Person not found.');
          done();
        });
      });
    });

    it('should fail if person is already linked', function(done) {
      var user, req;

      User.create({
        username: 'foo',
        email: 'foo@foo.com',
        password: 'foo'
      })
      .then(function (_user) {
        user = _user;
        return ActivationRequest.create({
          user: user._id,
          role: 'admin'
        });
      })
      .then(function (_req) {
        req = _req;
        return Person.create({
          personType: 'instructor',
          firstName: 'Foo',
          lastName: 'Bar',
          tag: 'test',
          user: user._id
        });
      })
      .then(function (person) {
        request(app)
        .post('/api/users/requests/' + req._id + '/approve/' + person._id)
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          Object.keys(res.body).length.should.eql(1);
          res.body.errors.length.should.eql(1);
          Object.keys(res.body.errors[0]).length.should.eql(1);
          res.body.errors[0].message.should.eql('Person already linked to a user.');
          done();
        });
      });
    });

    it('should succeed otherwise', function(done) {
      var user, req;

      User.create({
        username: 'foo',
        email: 'foo@foo.com',
        password: 'foo'
      })
      .then(function (_user) {
        user = _user;
        return ActivationRequest.create({
          user: user._id,
          role: 'admin'
        });
      })
      .then(function (_req) {
        req = _req;
        return Person.create({
          personType: 'instructor',
          firstName: 'Foo',
          lastName: 'Bar',
          tag: 'test'
        });
      })
      .then(function (person) {
        request(app)
        .post('/api/users/requests/' + req._id + '/approve/' + person._id)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);

          Object.keys(res.body).length.should.eql(4);
          res.body.role.should.eql('admin');
          res.body.status.should.eql('APPROVED');

          User.find({}).then(function (users) {
            users.length.should.eql(2); // the auth user and the created user
            users[1].activated.should.eql(true);
            res.body.user._id.should.eql(String(users[1]._id));
            return Person.find({});
          })
          .then(function (persons) {
            persons.length.should.eql(2); // the auth person and the created person
            String(persons[1].user).should.eql(String(user._id));
            persons[1].personType.should.eql('admin');
            return ActivationRequest.find({});
          })
          .then(function (reqs) {
            reqs.length.should.eql(1);
            reqs[0].status.should.eql('APPROVED');
            done();
          });
        });
      });
    });
  });

  describe('POST /requests/:requestId/reject (rejectRequest)', function() {
    var token;

    beforeEach(function(done) {
      testutils.clearDb()
      .then(function () { return testutils.auth(); })
      .then(function (result) { token = result.token; })
      .then(function() { done(); });
    });

    afterEach(function(done) {
      testutils.clearDb()
      .then(function() { done(); });
    });

    it('should fail if requestId does not match a request in the db', function(done) {
      var id = 'aaaaaaaaaaaaaaaaaaaaaaaa';
      request(app)
      .post('/api/users/requests/' + id + '/reject')
      .set('Authorization', 'Bearer ' + token)
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        Object.keys(res.body).length.should.eql(1);
        res.body.errors.length.should.eql(1);
        Object.keys(res.body.errors[0]).length.should.eql(1);
        res.body.errors[0].message.should.eql('Request not found.');
        done();
      });
    });

    it('should fail if the request is not currently pending', function(done) {
      var user, req;

      User.create({
        username: 'foo',
        email: 'foo@foo.com',
        password: 'foo'
      })
      .then(function (_user) {
        user = _user;
        return ActivationRequest.create({
          user: user._id,
          role: 'admin'
        });
      })
      .then(function (_req) {
        req = _req;
        return Person.create({
          personType: 'instructor',
          firstName: 'Foo',
          lastName: 'Bar',
          tag: 'test'
        });
      })
      .then(function (person) {
        var dfd = q.defer();

        request(app)
        .post('/api/users/requests/' + req._id + '/approve/' + person._id)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end(function(err, res) {
          dfd.resolve();
        });

        return dfd.promise;
      })
      .then(function () {
        request(app)
        .post('/api/users/requests/' + req._id + '/reject')
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          Object.keys(res.body).length.should.eql(1);
          res.body.errors.length.should.eql(1);
          Object.keys(res.body.errors[0]).length.should.eql(1);
          res.body.errors[0].message.should.eql('Request is not currently pending.');
          done();
        });
      });
    });

    it('should succeed otherwise', function(done) {
      var user;

      User.create({
        username: 'foo',
        email: 'foo@foo.com',
        password: 'foo'
      })
      .then(function (_user) {
        user = _user;
        return ActivationRequest.create({
          user: user._id,
          role: 'admin'
        });
      })
      .then(function (req) {
        request(app)
        .post('/api/users/requests/' + req._id + '/reject')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          Object.keys(res.body).length.should.eql(4);
          res.body.role.should.eql('admin');
          res.body.status.should.eql('REJECTED');
          done();
        });
      });
    });
  });

  describe('POST /requests/:requestId/reopen (reopenRequest)', function() {
    var token;

    beforeEach(function(done) {
      testutils.clearDb()
      .then(function () { return testutils.auth(); })
      .then(function (result) { token = result.token; })
      .then(function() { done(); });
    });

    afterEach(function(done) {
      testutils.clearDb()
      .then(function() { done(); });
    });

    it('should fail if requestId does not match a request in the db', function(done) {
      var id = 'aaaaaaaaaaaaaaaaaaaaaaaa';
      request(app)
      .post('/api/users/requests/' + id + '/reopen')
      .set('Authorization', 'Bearer ' + token)
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        Object.keys(res.body).length.should.eql(1);
        res.body.errors.length.should.eql(1);
        Object.keys(res.body.errors[0]).length.should.eql(1);
        res.body.errors[0].message.should.eql('Request not found.');
        done();
      });
    });

    it('should fail if the request is not currently rejected', function(done) {
      var user, req;

      User.create({
        username: 'foo',
        email: 'foo@foo.com',
        password: 'foo'
      })
      .then(function (_user) {
        user = _user;
        return ActivationRequest.create({
          user: user._id,
          role: 'admin'
        });
      })
      .then(function (_req) {
        req = _req;
        return Person.create({
          personType: 'instructor',
          firstName: 'Foo',
          lastName: 'Bar',
          tag: 'test'
        });
      })
      .then(function (person) {
        var dfd = q.defer();

        request(app)
        .post('/api/users/requests/' + req._id + '/approve/' + person._id)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end(function(err, res) {
          dfd.resolve();
        });

        return dfd.promise;
      })
      .then(function () {
        request(app)
        .post('/api/users/requests/' + req._id + '/reopen')
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          Object.keys(res.body).length.should.eql(1);
          res.body.errors.length.should.eql(1);
          Object.keys(res.body.errors[0]).length.should.eql(1);
          res.body.errors[0].message.should.eql('Request is not currently rejected.');
          done();
        });
      });
    });

    it('should succeed otherwise', function(done) {
      var user;

      User.create({
        username: 'foo',
        email: 'foo@foo.com',
        password: 'foo'
      })
      .then(function (_user) {
        user = _user;
        return ActivationRequest.create({
          user: user._id,
          role: 'admin'
        });
      })
      .then(function (req) {
        var dfd = q.defer();

        request(app)
        .post('/api/users/requests/' + req._id + '/reject')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end(function(err, res) {
          dfd.resolve(req);
        });

        return dfd.promise;
      })
      .then(function (req) {
        request(app)
        .post('/api/users/requests/' + req._id + '/reopen')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          Object.keys(res.body).length.should.eql(4);
          res.body.role.should.eql('admin');
          res.body.status.should.eql('PENDING');
          done();
        });
      });
    });
  });

  describe('POST /requests/:requestId/revoke (revokeRequest)', function() {
    var token;

    beforeEach(function(done) {
      testutils.clearDb()
      .then(function () { return testutils.auth(); })
      .then(function (result) { token = result.token; })
      .then(function() { done(); });
    });

    afterEach(function(done) {
      testutils.clearDb()
      .then(function() { done(); });
    });

    it('should fail if requestId does not match a request in the db', function(done) {
      var id = 'aaaaaaaaaaaaaaaaaaaaaaaa';
      request(app)
      .post('/api/users/requests/' + id + '/revoke')
      .set('Authorization', 'Bearer ' + token)
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        Object.keys(res.body).length.should.eql(1);
        res.body.errors.length.should.eql(1);
        Object.keys(res.body.errors[0]).length.should.eql(1);
        res.body.errors[0].message.should.eql('Request not found.');
        done();
      });
    });

    it('should fail if the request is not currently approved', function(done) {
      var user, req;

      User.create({
        username: 'foo',
        email: 'foo@foo.com',
        password: 'foo'
      })
      .then(function (_user) {
        user = _user;
        return ActivationRequest.create({
          user: user._id,
          role: 'admin'
        });
      })
      .then(function (_req) {
        var dfd = q.defer();

        req = _req;

        request(app)
        .post('/api/users/requests/' + req._id + '/reject')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end(function(err, res) {
          dfd.resolve();
        });

        return dfd.promise;
      })
      .then(function () {
        request(app)
        .post('/api/users/requests/' + req._id + '/revoke')
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          Object.keys(res.body).length.should.eql(1);
          res.body.errors.length.should.eql(1);
          Object.keys(res.body.errors[0]).length.should.eql(1);
          res.body.errors[0].message.should.eql('Request is not currently approved.');
          done();
        });
      });
    });

    it('should succeed otherwise', function(done) {
      var user, req;

      User.create({
        username: 'foo',
        email: 'foo@foo.com',
        password: 'foo'
      })
      .then(function (_user) {
        user = _user;
        return ActivationRequest.create({
          user: user._id,
          role: 'admin'
        });
      })
      .then(function (_req) {
        req = _req;
        return Person.create({
          personType: 'instructor',
          firstName: 'Foo',
          lastName: 'Bar',
          tag: 'test'
        });
      })
      .then(function (person) {
        var dfd = q.defer();

        request(app)
        .post('/api/users/requests/' + req._id + '/approve/' + person._id)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end(function(err, res) {
          dfd.resolve();
        });

        return dfd.promise;
      })
      .then(function () {
        request(app)
        .post('/api/users/requests/' + req._id + '/revoke')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.status.should.eql('PENDING');
          User.find({}).then(function (users) {
            (users[1].person === null).should.eql(true);
            users[1].activated.should.eql(false);
            return Person.find({});
          })
          .then(function (persons) {
            (persons[1].user === null).should.eql(true);
            done();
          });
        });
      });
    });
  });
});
