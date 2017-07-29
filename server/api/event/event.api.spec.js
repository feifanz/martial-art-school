var app = require('../../app');
var request = require('supertest');
var q = require('q');
var should = require('should');
var testutils = require('../../utils/testutils');
var Event = require('./event.model').Event;
var Venue = require('../venue/venue.model');
var Person = require('../person/person.model');

describe('event api', function() {
  describe('create', function() {
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

    it('should reject if venue is missing', function(done) {
      request(app)
        .post('/api/events')
        .send({
          startTime: new Date()
        })
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.length.should.equal(1);
          Object.keys(res.body[0])
            .length.should.equal(1);
          res.body[0].message.should.equal('venue is required.');
          done();
        })
    });

    it('should reject if startTime is missing', function(done) {
      Venue.create({
        name: 'Test venue'
      })
      .then(function (venue) {
        request(app)
          .post('/api/events')
          .send({
            venue: venue._id
          })
          .set('Authorization', 'Bearer ' + token)
          .expect(400)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err);
            res.body.length.should.equal(1);
            Object.keys(res.body[0])
              .length.should.equal(1);
            res.body[0].message.should.equal('startTime is required.');
            done();
          });
      });
    });

    it('should succeed otherwise', function(done) {
      Venue.create({
        name: 'Test venue'
      })
      .then(function (venue) {
        var startTime = new Date();
        request(app)
          .post('/api/events')
          .send({
            venue: venue._id,
            startTime: startTime
          })
          .set('Authorization', 'Bearer ' + token)
          .expect(201)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err);
            Object.keys(res.body).length.should.equal(8);
            res.body.venue.should.equal(String(venue._id));
            var date = new Date(res.body.startTime);
            date.should.eql(startTime);
            res.body.attendanceRecords.should.eql([]);
            res.body.attendees.should.eql([]);
            res.body.instructors.should.eql([]);
            res.body.durationMins.should.eql(60);
            res.body.name.should.eql('Event');
            Event.find({})
            .then(function (events) {
              events.length.should.eql(1);
              String(events[0]._id).should.eql(res.body._id);
              done();
            });
          });
      });
    });
  });

  describe('index', function() {
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

    it('should return an empty list if there are no events', function(done) {
      request(app)
        .get('/api/events')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.eql([]);
          done();
        });
    });

    it('should return the list of all events', function(done) {
      Venue.create({
        name: 'Test venue'
      })
      .then(function (venue) {
        return Event.create([{
          name: 'Event 1',
          venue: venue._id,
          startTime: new Date()
        }, {
          name: 'Event 2',
          venue: venue._id,
          startTime: new Date()
        }])
      })
      .then(function (events) {
        request(app)
          .get('/api/events')
          .set('Authorization', 'Bearer ' + token)
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err);
            res.body.length.should.eql(2);
            res.body[0].name.should.eql('Event 1');
            res.body[1].name.should.eql('Event 2');
            done();
          });
      });
    });
  });

  describe('get', function() {
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

    it('should return an error for an invalid id', function(done) {
      var id = '1234';
      request(app)
        .get('/api/events/' + id)
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          Object.keys(res.body).length.should.eql(1);
          res.body.errors.length.should.eql(1);
          Object.keys(res.body.errors[0]).length.should.eql(2);
          res.body.errors[0].message.should.eql('Event id invalid.');
          Object.keys(res.body.errors[0].data).length.should.eql(1);
          res.body.errors[0].data.id.should.eql(id);
          done();
        });
    });

    it('should return an error if event not found', function(done) {
      var id = 'aaaaaaaaaaaaaaaaaaaaaaaa';
      request(app)
        .get('/api/events/' + id)
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          Object.keys(res.body).length.should.eql(1);
          res.body.errors.length.should.eql(1);
          Object.keys(res.body.errors[0]).length.should.eql(2);
          res.body.errors[0].message.should.eql('Event not found.');
          Object.keys(res.body.errors[0].data).length.should.eql(1);
          res.body.errors[0].data.id.should.eql(id);
          done();
        });
    });

    it('should return the event otherwise', function(done) {
      Venue.create({
        name: 'Test venue'
      })
      .then(function (venue) {
        return Event.create({
          name: 'Event 1',
          venue: venue._id,
          startTime: new Date()
        })
      })
      .then(function (event) {
        var expected = event.toObject();

        request(app)
          .get('/api/events/' + event._id)
          .set('Authorization', 'Bearer ' + token)
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err);
            Object.keys(res.body).length.should.equal(8);
            res.body.venue.should.equal(String(expected.venue));
            var date = new Date(res.body.startTime);
            date.should.eql(new Date(expected.startTime));
            res.body.attendanceRecords.should.eql(expected.attendanceRecords);
            res.body.attendees.should.eql(expected.attendees);
            res.body.instructors.should.eql(expected.instructors);
            res.body.durationMins.should.eql(expected.durationMins);
            res.body.name.should.eql(expected.name);
            done();
          });
      });
    });
  });

  describe('remove', function() {
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

    it('should return an error for an invalid id', function(done) {
      var id = '1234';
      request(app)
        .delete('/api/events/' + id)
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          Object.keys(res.body).length.should.eql(1);
          res.body.errors.length.should.eql(1);
          Object.keys(res.body.errors[0]).length.should.eql(2);
          res.body.errors[0].message.should.eql('Event id invalid.');
          Object.keys(res.body.errors[0].data).length.should.eql(1);
          res.body.errors[0].data.id.should.eql(id);
          done();
        });
    });

    it('should return an error if event not found', function(done) {
      var id = 'aaaaaaaaaaaaaaaaaaaaaaaa';
      request(app)
        .delete('/api/events/' + id)
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          Object.keys(res.body).length.should.eql(1);
          res.body.errors.length.should.eql(1);
          Object.keys(res.body.errors[0]).length.should.eql(2);
          res.body.errors[0].message.should.eql('Event not found.');
          Object.keys(res.body.errors[0].data).length.should.eql(1);
          res.body.errors[0].data.id.should.eql(id);
          done();
        });
    });

    it('should return 200 if successfully deleted', function(done) {
      Venue.create({
        name: 'Test venue'
      })
      .then(function (venue) {
        return Event.create({
          name: 'Event 1',
          venue: venue._id,
          startTime: new Date()
        })
      })
      .then(function (event) {
        request(app)
          .delete('/api/events/' + event._id)
          .set('Authorization', 'Bearer ' + token)
          .expect(200)
          .expect('Content-Type', /text/)
          .end(function(err, res) {
            if (err) return done(err);
            res.body.should.eql({});
            Event.find({}).then(function (events) {
              events.length.should.eql(0);
              done();
            });
          });
      });
    });

    it('should only delete the specified event', function(done) {
      Venue.create({
        name: 'Test venue'
      })
      .then(function (venue) {
        return Event.create([{
          name: 'Event 1',
          venue: venue._id,
          startTime: new Date()
        }, {
          name: 'Event 2',
          venue: venue._id,
          startTime: new Date()
        }])
      })
      .then(function (events) {
        request(app)
          .delete('/api/events/' + events[0]._id)
          .set('Authorization', 'Bearer ' + token)
          .expect(200)
          .expect('Content-Type', /text/)
          .end(function(err, res) {
            if (err) return done(err);
            res.body.should.eql({});
            Event.find({}).then(function (remainingEvents) {
              remainingEvents.length.should.eql(1);
              remainingEvents[0]._id.should.eql(events[1]._id);
              done();
            });
          });
      });
    });
  });

  describe('POST /update/:id (updateEvent)', function(){
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

    it('should update a existing event if id is valid,  venue and startTime are not missing',function(done){
      Venue.create({
        name: 'Test venue'
      })
      .then(function (venue) {
        return Event.create({
          name: 'Event 1',
          venue: venue._id,
          startTime: new Date()
        })
      })
      .then(function (event) {
        var startTime = new Date();
        var venue = event.venue;

        request(app)
          .post('/api/events/update/' + event._id)
          .send({
            name: 'Event 2',
            venue: venue,
            startTime: startTime
          })
          .set('Authorization', 'Bearer ' + token)
          .expect(202)
          .end(function(err, res) {
            if (err) return done(err);
            Event.find({}).then(function(events){
              events.length.should.eql(1);
              Object.keys(events[0]).length.should.equal(8);
              events[0].name.should.eql('Event 2');
              events[0].venue.should.equal(String(venue._id));
              var date = new Date(events[0].startTime);
              date.should.eql(startTime);
           });
            done();
          });
      });
    });

    it('should return an error for an invalid id', function(done) {
      var id = '1234';
      request(app)
        .post('/api/events/update/' + id)
        .send({
            name: 'Event 2'
        })
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          Object.keys(res.body).length.should.eql(1);
          res.body.errors.length.should.eql(1);
          Object.keys(res.body.errors[0]).length.should.eql(2);
          res.body.errors[0].message.should.eql('Event id invalid.');
          Object.keys(res.body.errors[0].data).length.should.eql(1);
          res.body.errors[0].data.id.should.eql(id);
          done();
        });
    });

    it('should return an error if event not found', function(done) {
      var id = 'aaaaaaaaaaaaaaaaaaaaaaaa';
      request(app)
        .post('/api/events/update/' + id)
        .send({
            name: 'Event 2'
        })
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          Object.keys(res.body).length.should.eql(1);
          res.body.errors.length.should.eql(1);
          Object.keys(res.body.errors[0]).length.should.eql(2);
          res.body.errors[0].message.should.eql('Event not found.');
          Object.keys(res.body.errors[0].data).length.should.eql(1);
          res.body.errors[0].data.id.should.eql(id);
          done();
        });
    });
  });

  describe('GET/getAttendees', function() {
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

    it('should return the attendees otherwise', function(done) {
      Venue.create({
        name: 'Test venue'
      })     
      .then(function (venue) {
        var person = Person.create({
           personType: 'student',
            firstName: 'Test 1',
            lastName: 'Person',
            Tag:'test'
          });
          return Event.create({
          name: 'Event 1',
          venue: venue._id,
          startTime: new Date(),
          attendees:[person._id]
        })
      })
      .then(function (event) {
        var expected = event.toObject().attendees;
        request(app)
          .get('/api/events/getAttendees/' + event._id)
          .set('Authorization', 'Bearer ' + token)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
          //  Object.keys(res.body).length.should.equal(8);
          //  res.body.should.eql(expected);   
            done();
          });
      });
    });

    it('should return an error for an invalid id', function(done) {
      var id = '1234';
      request(app)
        .get('/api/events/getAttendees/' + id)
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          Object.keys(res.body).length.should.eql(1);
          res.body.errors.length.should.eql(1);
          Object.keys(res.body.errors[0]).length.should.eql(2);
          res.body.errors[0].message.should.eql('Event id invalid.');
          Object.keys(res.body.errors[0].data).length.should.eql(1);
          res.body.errors[0].data.id.should.eql(id);
          done();
        });
    });

    it('should return an error if event not found', function(done) {
      var id = 'aaaaaaaaaaaaaaaaaaaaaaaa';
      request(app)
        .get('/api/events/getAttendees/' + id)
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          Object.keys(res.body).length.should.eql(1);
          res.body.errors.length.should.eql(1);
          Object.keys(res.body.errors[0]).length.should.eql(2);
          res.body.errors[0].message.should.eql('Event not found.');
          Object.keys(res.body.errors[0].data).length.should.eql(1);
          res.body.errors[0].data.id.should.eql(id);
          done();
        });
    });

  });

  describe('POST /appendAttendees/', function(){
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

    it('should append Attendees',function(done){
      Venue.create({
        name: 'Test venue'
      })
      .then(function (venue) {
        return Event.create({
          name: 'Event 1',
          venue: venue._id,
          startTime: new Date()
        })
      })
      .then(function (event) {
        var person = Person.create({
           personType: 'student',
            firstName: 'Test 1',
            lastName: 'Person',
            Tag:'test'
          });

        request(app)
          .post('/api/events/appendAttendees/')
          .send({
            eventId: event._id,
            attendees:[person._id]
          })
          .set('Authorization', 'Bearer ' + token)
          .expect(202)
          .end(function(err, res) {
            if (err) return done(err);
            Event.find({}).then(function(events){
              events.length.should.eql(1);
              Object.keys(events[0]).length.should.equal(8);
              events[0].name.should.eql('Event 1');
              events[0].venue.should.equal(String(venue._id));
              var date = new Date(events[0].startTime);
              date.should.eql(startTime);
           });
            done();
          });
      });
    });

    it('should return an error for an invalid id', function(done) {
      var id = '1234';
        var person = Person.create({
            personType: 'student',
            firstName: 'Test 1',
            lastName: 'Person',
            Tag:'test'
          });
      request(app)
        .post('/api/events/appendAttendees/')
        .send({
            eventId: id,
            attendees:[person._id]
        })
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should return an error if event not found', function(done) {
      var id = 'aaaaaaaaaaaaaaaaaaaaaaaa';
        var person = Person.create({
            personType: 'student',
            firstName: 'Test 1',
            lastName: 'Person',
            Tag:'test'
          });
      request(app)
        .post('/api/events/appendAttendees/')
        .send({
            eventId: id,
            attendees:[person._id]
        })
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          Object.keys(res.body).length.should.eql(1);
          res.body.errors.length.should.eql(1);
          Object.keys(res.body.errors[0]).length.should.eql(2);
          res.body.errors[0].message.should.eql('Event not found.');
          Object.keys(res.body.errors[0].data).length.should.eql(1);
          res.body.errors[0].data.id.should.eql(id);
          done();
        });
    });
  });

  describe('POST /checkInOut/', function(){
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

    it('should check in and out',function(done){
      Venue.create({
        name: 'Test venue'
      })
      .then(function (venue) {
        var person = Person.create({
           personType: 'student',
            firstName: 'Test 1',
            lastName: 'Person',
            Tag:'test'
          });
        return Event.create({
          name: 'Event 1',
          venue: venue._id,
          startTime: new Date(),
          attendees:[person._id]
        })
      })
      .then(function (event) {        

        request(app)
          .post('/api/events/checkInOut/')
          .send({
            eventId: event._id,
            attendanceRecord:{
              attendee:event.attendees[0],
              inTime: new Date(),
              outTime: new Date()
            }
          })
          .set('Authorization', 'Bearer ' + token)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            Event.find({}).then(function(events){
              events.length.should.eql(1);
              Object.keys(events[0]).length.should.equal(8);
              events[0].name.should.eql('Event 1');
           });
            done();
          });
      });
    });

    it('should return an error for an invalid id', function(done) {
      var id = '1234';
      request(app)
        .post('/api/events/checkInOut/')
        .send({
            eventId: id,
            attendanceRecord:{
              attendee:'aaaaaaaaaaaaaaaaaaaaaaaa',
              inTime: new Date(),
              outTime: new Date()
            }
        })
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should return an error if event not found', function(done) {
      var id = 'aaaaaaaaaaaaaaaaaaaaaaaa';
        var person = Person.create({
            personType: 'student',
            firstName: 'Test 1',
            lastName: 'Person',
            Tag:'test'
          });
      request(app)
        .post('/api/events/checkInOut/')
        .send({
            eventId: id,
            attendanceRecord:{
              attendee:person._id,
              inTime: new Date(),
              outTime: new Date()
            }
        })
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          Object.keys(res.body).length.should.eql(1);
          res.body.errors.length.should.eql(1);
          Object.keys(res.body.errors[0]).length.should.eql(2);
          res.body.errors[0].message.should.eql('Event not found.');
          Object.keys(res.body.errors[0].data).length.should.eql(1);
          res.body.errors[0].data.id.should.eql(id);
          done();
        });
    });
  });


  describe('GET/getAttendanceRecord', function() {
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

    it('should return the attendees otherwise', function(done) {
      Venue.create({
        name: 'Test venue'
      })     
      .then(function (venue) {
        var person = Person.create({
           personType: 'student',
            firstName: 'Test 1',
            lastName: 'Person',
            Tag:'test'
          });
          return Event.create({
          name: 'Event 1',
          venue: venue._id,
          startTime: new Date(),
          attendees:[person._id],
          attendanceRecord:{
              attendee:person._id,
              inTime: new Date(),
              outTime: new Date()
          }
        })
      })
      .then(function (event) {
        var expected = event.toObject().attendees;
        request(app)
          .get('/api/events/getAttendanceRecord/' + event._id)
          .set('Authorization', 'Bearer ' + token)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
          //  Object.keys(res.body).length.should.equal(8);
          //  res.body.should.eql(expected);   
            done();
          });
      });
    });

    it('should return an error for an invalid id', function(done) {
      var id = '1234';
      request(app)
        .get('/api/events/getAttendanceRecord/' + id)
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should return an error if event not found', function(done) {
      var id = 'aaaaaaaaaaaaaaaaaaaaaaaa';
      request(app)
        .get('/api/events/getAttendanceRecord/' + id)
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

  });

});
