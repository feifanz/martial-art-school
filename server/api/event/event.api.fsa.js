var app = require('../../app');
var request = require('supertest');
var q = require('q');
var should = require('should');
var testutils = require('../../utils/testutils');
var Event = require('./event.model').Event;
var Venue = require('../venue/venue.model');
var Person = require('../person/person.model');

//test number
var testNum = 1;

//generate random integer between min and max
var randomInt = function(min, max){
	return parseInt(Math.random()*(max-min+1)+min);
};

//generate random string of len
var randomString = function(len){
	var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890~!@#$%^&*()_+{}|:\"?><[]\\;'./,";
	var dicLen = chars.length;
	var string = '';
	for (var i = 0; i <len; i++){
		string += chars.charAt(randomInt(0, dicLen-1));
	}
	return string;
};

//generate random person type
var randomPersonType = function(){
	var types = ['student', 'instructor', 'admin'];
	return types[randomInt(0,2)];
};

//generate random Persons
var generateRandomPersons = function(personNumber){
	var persons = [];

	for (var i = 0; i < personNumber; i++) {
		persons[i] = {
			personType: 'student',
			firstName: randomString(10),
			lastName: randomString(10),
			birthday: new Date(),
			tag: randomString(10),
			phone: randomString(10),
			emailAddress: randomString(10),
			addresss: randomString(10),
			payment: randomString(10),
			paymentExpireDate: new Date(),
			medicalInfo: randomString(10)
		};
	}

  return persons;
};


//generate random Venues
var generateRandomVenues = function(venueNumber){
	var venues = [];

	for (var i = 0; i < venueNumber; i++) {
		venues[i] = {
			name: randomString(10),
			tags: [randomString(10),randomString(10),randomString(10)],
			addresss:randomString(10),
			capacity:randomInt(0,100)
		};
	}

	return venues;
};


//generate random Events
var generateRandomEvents = function(eventNumber){
	var events = [];
	var venues = [];
	var persons =[];

	Venue.create(generateRandomVenues(eventNumber)).then(function(){
    Venue.find({}).then(function(_venues){
      venues = _venues;
      //console.log(venues);
      Person.create(generateRandomPersons(eventNumber*5)).then(function(){
        Person.find({}).then(function(_persons){
          persons = _persons;
          //console.log(persons);
          for (var i = 0; i < eventNumber; i++) {
            events[i] = {
              name: randomString(10),
              tag: randomString(10),
              venue: venues[i]._id,
              startTime: new Date(),
              durationMins:randomInt(0,120),
              attendees: [persons[i*5]._id, persons[i*5+1]._id, persons[i*5+2]._id, persons[i*5+3]._id, persons[i*5+4]._id],
              attendanceRecords:[{
                attendee: persons[i*5]._id,
                inTime: new Date(),
                outTime: new Date(),
                comment: randomString(10)
              },{
                attendee: persons[i*5+1]._id,
                inTime: new Date(),
                outTime: new Date(),
                comment: randomString(10)
              },{
                attendee: persons[i*5+2]._id,
                inTime: new Date(),
                outTime: new Date(),
                comment: randomString(10)
              },{
                attendee: persons[i*5+3]._id,
                inTime: new Date(),
                outTime: new Date(),
                comment: randomString(10)
              },{
                attendee: persons[i*5+4]._id,
                inTime: new Date(),
                outTime: new Date(),
                comment: randomString(10)
              }]
            };
          }
          //console.log(events);
          return events;
        });
      });
    });
  });
};

var Empty2Empty = function(){

	describe('Empty2Empty', function() {
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

    it('index:/should return an empty list if there are no events', function(done) {
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
  });

};

var Empty2HasCollection = function(){
	describe('Empty2HasCollection', function() {
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

    it('create:/should succeed otherwise', function(done) {
    	//var events = generateRandomEvents(1);
    	//console.log(events);
		var events =[];
    	Event.find({}).then(function(){    	
    		events = generateRandomEvents(1);
    		console.log(events);
    	})
    	.then(function(){
    	   request(app)
          .post('/api/events')
          .send({
          	name: events[0].name,
			tag: events[0].tag,
			venue: events[0].venue,
			startTime: events[0].startTime,
			durationMins:events[0].durationMins,
			attendees: events[0].attendees,
			attendanceRecords: events[0].attendanceRecords
          })
          .set('Authorization', 'Bearer ' + token)
          .expect(201)
          .end(function(err, res) {
            if (err) return done(err);
         //   Event.find({}).then(function(_event){
          // 		_event.length.should.equal();
            //	_event[0].venue.should.equal(String(events[0].venue._id));
            //	var date = new Date(_event[0].startTime);
            //	date.should.eql(events[0].startTime);
            //	_event[0].attendanceRecords.should.eql(events[0].attendanceRecords);
            //	_event[0].attendees.should.eql(events[0].attendees);
            //	_event[0].instructors.should.eql([]);
            //	_event[0].durationMins.should.eql(events[0].durationMins);
            //	_event[0].name.should.eql(events[0].name);
            	done();
			//	}).catch(done);
            });

    	});


        });
    });
};

var Empty2errVenueMissing = function(){
	describe('Empty2errVenueMissing', function() {
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

    it('create:/should reject if venue is missing', function(done) {
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
  });

};

var Empty2errStartTimeMissing = function(){
	describe('Empty2errStartTimeMissing', function() {
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

    it('create:/should reject if startTime is missing', function(done) {
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
  });

};

var Empty2errIdInvalid = function(){
	describe('Empty2errIdInvalid', function() {
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

    it('GET:/should return an error for an invalid id', function(done) {
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

    it('REMOVE:/should return an error for an invalid id', function(done) {
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

    it('UPDATE:/should return an error for an invalid id', function(done) {
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

    it('GETATTENDEES:/should return an error for an invalid id', function(done) {
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

    it('APPENDEES:/should return an error for an invalid id', function(done) {
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

    it('CHECKINOUT:/should return an error for an invalid id', function(done) {
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

    it('GETATTENDANCERECORD:/should return an error for an invalid id', function(done) {
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

  });

};

var Empty2errIdNotExist = function(){
	describe('Empty2errIdNotExist', function() {
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

    it('GET:/should return an error if event not found', function(done) {
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

    it('REMOVE:/should return an error if event not found', function(done) {
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

    it('UPDATE:/should return an error if event not found', function(done) {
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

    it('GETATTENDEES:/should return an error if event not found', function(done) {
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

    it('APPENDATTENDEES:/should return an error if event not found', function(done) {
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

    it('CHECKINOUT:/should return an error if event not found', function(done) {
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

    it('GETATTENDANCERECORD:/should return an error if event not found', function(done) {
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


};


var HasCollection2Empty = function(){
	describe('HasCollection2Empty ', function() {
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

    it('REMOVE:/should return 200 if successfully deleted', function(done) {
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
  });
};

var HasCollection2HasCollection = function(){
	describe('HasCollection2HasCollection ', function() {
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

    it('CREATE:/should succeed otherwise', function(done) {
    Event.create(generateRandomEvents(10));
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

    it('index:/should return the list of all events', function(done) {
    Event.create(generateRandomEvents(10));
      request(app)
        .get('/api/events')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
     		res.body.length.should.eql(10);
     		done();
        });
    });

    it('GET:/should return the event otherwise', function(done) {
    Event.create(generateRandomEvents(10));
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

    it('REMOVE:/should only delete the specified event', function(done) {
    Event.create(generateRandomEvents(10));
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

    it('UPDATE:/should update a existing event if id is valid,  venue and startTime are not missing',function(done){
    	Event.create(generateRandomEvents(10));
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

    it('GETATTENDEES:/should return the attendees otherwise', function(done) {
    	Event.create(generateRandomEvents(10));
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

    it('APPENDATTENDEES:/should append Attendees',function(done){
    	Event.create(generateRandomEvents(10));
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

    it('CHECKINOUT:/should check in and out',function(done){
    	Event.create(generateRandomEvents(10));
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

    it('GETATTENDANCERECORD:/should return the attendees otherwise', function(done) {
    	Event.create(generateRandomEvents(10));
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

  });

};

var HasCollection2errVenueMissing = function(){
	describe('Empty2errVenueMissing', function() {
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

    it('create:/should reject if venue is missing', function(done) {
    	Event.create(generateRandomEvents(10));
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
  });

};

var HasCollection2errStartTimeMissing = function(){
	describe('HasCollection2errStartTimeMissing', function() {
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

    it('create:/should reject if startTime is missing', function(done) {
    Event.create(generateRandomEvents(10));
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
  });

};

var HasCollection2errIdInvalid = function(){
	describe('HasCollection2errIdInvalid ', function() {
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

    it('GET:/should return an error for an invalid id', function(done) {
    	Event.create(generateRandomEvents(10));
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

    it('REMOVE:/should return an error for an invalid id', function(done) {
    	Event.create(generateRandomEvents(10));
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

    it('UPDATE:/should return an error for an invalid id', function(done) {
    	Event.create(generateRandomEvents(10));
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

    it('GETATTENDEES:/should return an error for an invalid id', function(done) {
    	Event.create(generateRandomEvents(10));
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

    it('APPENDEES:/should return an error for an invalid id', function(done) {
    	Event.create(generateRandomEvents(10));
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

    it('CHECKINOUT:/should return an error for an invalid id', function(done) {
    	Event.create(generateRandomEvents(10));
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

    it('GETATTENDANCERECORD:/should return an error for an invalid id', function(done) {
    	Event.create(generateRandomEvents(10));
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

  });

};

var HasCollection2errIdNotExist = function(){
	describe('HasCollection2errIdNotExist', function() {
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

    it('GET:/should return an error if event not found', function(done) {
    	Event.create(generateRandomEvents(10));
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

    it('REMOVE:/should return an error if event not found', function(done) {
    	Event.create(generateRandomEvents(10));
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

    it('UPDATE:/should return an error if event not found', function(done) {
    	Event.create(generateRandomEvents(10));
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

    it('GETATTENDEES:/should return an error if event not found', function(done) {
    	Event.create(generateRandomEvents(10));
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

    it('APPENDATTENDEES:/should return an error if event not found', function(done) {
    	Event.create(generateRandomEvents(10));
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

    it('CHECKINOUT:/should return an error if event not found', function(done) {
    	Event.create(generateRandomEvents(10));
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

    it('GETATTENDANCERECORD:/should return an error if event not found', function(done) {
    	Event.create(generateRandomEvents(10));
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

};


 for (var i = 0; i < testNum; i++) {
 	 Empty2Empty();
 	 Empty2HasCollection();
 	 Empty2errVenueMissing();
 	 Empty2errStartTimeMissing();
 	 Empty2errIdInvalid ();
 	 Empty2errIdNotExist();
 	 HasCollection2Empty();
 	 HasCollection2HasCollection();
 	 HasCollection2errVenueMissing();
 	 HasCollection2errStartTimeMissing();
 	 HasCollection2errIdInvalid();
 	 HasCollection2errIdNotExist();
 }
