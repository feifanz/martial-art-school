var app = require('../../app');
var q = require('q');
var request = require('supertest');
var should = require('should');
var testutils = require('../../utils/testutils');
var Message = require('./message.model');

describe('/api/messages', function(){

  describe('POST / (create)', function(){
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

		it('valid urgentFillIn', function(done){
			var date = new Date();
			request(app)
			.post('/api/messages/')
			.send({
				title: 'testTitle',
				content: 'testContent',
				messageType: 'urgentFillIn',
				sendTime: date,
				reporter: 'testReporter',
			})
			.set('Authorization', 'Bearer ' + token)
			.expect(201)
			.end(function(err, res){
				if (err) return done(err);
				Message.find({}).then(function(messages){
					messages.length.should.eql(1);
					messages[0].title.should.eql('testTitle');
					messages[0].content.should.eql('testContent');
					messages[0].messageType.should.eql('urgentFillIn');
					messages[0].sendTime.should.eql(date);
					messages[0].reporter.should.eql('testReporter');
					done();
				}).catch(done);
			});
		});

		it('valid fillIn', function(done){
			var date = new Date();
			request(app)
			.post('/api/messages/')
			.send({
				title: 'testTitle',
				content: 'testContent',
				messageType: 'fillIn',
				sendTime: date,
				reporter: 'testReporter',
			})
			.set('Authorization', 'Bearer ' + token)
			.expect(201)
			.end(function(err, res){
				if (err) return done(err);
				Message.find({}).then(function(messages){
					messages.length.should.eql(1);
					messages[0].title.should.eql('testTitle');
					messages[0].content.should.eql('testContent');
					messages[0].messageType.should.eql('fillIn');
					messages[0].sendTime.should.eql(date);
					messages[0].reporter.should.eql('testReporter');
					done();
				}).catch(done);
			});
		});

		it('valid generic', function(done){
			var date = new Date();
			request(app)
			.post('/api/messages/')
			.send({
				title: 'testTitle',
				content: 'testContent',
				messageType: 'generic',
				sendTime: date,
				reporter: 'testReporter',
			})
			.set('Authorization', 'Bearer ' + token)
			.expect(201)
			.end(function(err, res){
				if (err) return done(err);
				Message.find({}).then(function(messages){
					messages.length.should.eql(1);
					messages[0].title.should.eql('testTitle');
					messages[0].content.should.eql('testContent');
					messages[0].messageType.should.eql('generic');
					messages[0].sendTime.should.eql(date);
					messages[0].reporter.should.eql('testReporter');
					done();
				}).catch(done);
			});
		});

		it('valid accessRequest', function(done){
			var date = new Date();
			request(app)
			.post('/api/messages/')
			.send({
				title: 'testTitle',
				content: 'testContent',
				messageType: 'accessRequest',
				sendTime: date,
				reporter: 'testReporter',
			})
			.set('Authorization', 'Bearer ' + token)
			.expect(201)
			.end(function(err, res){
				if (err) return done(err);
				Message.find({}).then(function(messages){
					messages.length.should.eql(1);
					messages[0].title.should.eql('testTitle');
					messages[0].content.should.eql('testContent');
					messages[0].messageType.should.eql('accessRequest');
					messages[0].sendTime.should.eql(date);
					messages[0].reporter.should.eql('testReporter');
					done();
				}).catch(done);
			});
		});

		it('invalid msg empty title', function(done){
			var date = new Date();
			request(app)
			.post('/api/messages/')
			.send({
				title: null,
				content: 'testContent',
				messageType: 'generic',
				sendTime: date,
				reporter: 'testReporter',
			})
			.set('Authorization', 'Bearer ' + token)
			.expect(400)
			.end(function(err, res){
				if (err) return done(err);
				Object.keys(res.body).length.should.eql(1);
                res.body[0].message.should.eql('valid title is required.');
                done();
			});
		});

		it('invalid msg invalid type empty', function(done){
			var date = new Date();
			request(app)
			.post('/api/messages/')
			.send({
				title: 'testTitle',
				content: 'testContent',
				messageType: null,
				sendTime: date,
				reporter: 'testReporter',
			})
			.set('Authorization', 'Bearer ' + token)
			.expect(400)
			.end(function(err, res){
				if (err) return done(err);
				Object.keys(res.body).length.should.eql(1);
                res.body[0].message.should.eql('valid messageType is required.');
                done();
			});
		});

		it('invalid msg invalid type wrong', function(done){
			var date = new Date();
			request(app)
			.post('/api/messages/')
			.send({
				title: 'testTitle',
				content: 'testContent',
				messageType: 'testType',
				sendTime: date,
				reporter: 'testReporter',
			})
			.set('Authorization', 'Bearer ' + token)
			.expect(400)
			.end(function(err, res){
				if (err) return done(err);
				Object.keys(res.body).length.should.eql(1);
        res.body[0].message.should.eql('`testType` is not a valid enum value for path `messageType`.');
        done();
			});
		});

		it('invalid msg empty reporter', function(done){
			var date = new Date();
			request(app)
			.post('/api/messages/')
			.send({
				title: 'testTitle',
				content: 'testContent',
				messageType: 'generic',
				sendTime: date,
				reporter: null,
			})
			.set('Authorization', 'Bearer ' + token)
			.expect(400)
			.end(function(err, res){
				if (err) return done(err);
				Object.keys(res.body).length.should.eql(1);
                res.body[0].message.should.eql('username is required.');
                done();
			});
		});
  });

  describe('GET / (findAll)', function(){
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

    it('empty collection', function(done){
    	var messages = [];

    	Message.create(messages)
    	.then(function(){
    		request(app)
    		.get('/api/messages/')
    		.set('Authorization', 'Bearer ' + token)
    		.expect(200)
    		.end(function(err, res){
    			if (err) return done(err);
    			res.body.length.should.eql(0);
    			done();
    		});
    	});
    });

    it('non-empty collection', function(done){
    	var messages = [{
    		title: 'testGeneric',
				content: 'testContent',
				messageType: 'generic',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testUrgentFillIn',
				content: 'testContent',
				messageType: 'urgentFillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testFillIn',
				content: 'testContent',
				messageType: 'fillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testAccessRequest',
				content: 'testContent',
				messageType: 'accessRequest',
				sendTime: new Date(),
				reporter: 'testReporter',
    	}];

    	Message.create(messages)
    	.then(function(){
    		request(app)
    		.get('/api/messages/')
    		.set('Authorization', 'Bearer ' + token)
    		.expect(200)
    		.end(function(err, res){
    			if (err) return done(err);
    			res.body.length.should.eql(4);
    			res.body.forEach(function (req, i) {
                    String(res.body[i].title).should.eql(String(messages[i].title));
                    String(res.body[i].content).should.eql(String(messages[i].content));
                    String(res.body[i].messageType).should.eql(String(messages[i].messageType));
                    Date(res.body[i].sendTime).should.eql(Date(messages[i].sendTime));
                    String(res.body[i].reporter).should.eql(String(messages[i].reporter));
                });
    			done();
    		});
    	});
    });
  });

 	describe('GET /findAllExceptAccess/ (findAllExceptAccess)', function(){
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

    it('has msg except accessRequest', function(done){
    	var messages = [{
    		title: 'testGeneric',
				content: 'testContent',
				messageType: 'generic',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testUrgentFillIn',
				content: 'testContent',
				messageType: 'urgentFillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testFillIn',
				content: 'testContent',
				messageType: 'fillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testAccessRequest',
				content: 'testContent',
				messageType: 'accessRequest',
				sendTime: new Date(),
				reporter: 'testReporter',
    	}];

    	Message.create(messages)
    	.then(function(){
    		request(app)
    		.get('/api/messages/findAllExceptAccess/')
    		.set('Authorization', 'Bearer ' + token)
    		.expect(200)
    		.end(function(err, res){
    			if (err) return done(err);
    			res.body.length.should.eql(messages.length - targetMsgNumber(messages, 'accessRequest'));
    			res.body.forEach(function (req, i) {
            res.body[i].messageType.should.not.eql('accessRequest');
          });
    			done();
    		});
    	});
    });

    it('does not have msg except accessRequest', function(done){
    	var messages = [
    	{
    		title: 'testAccessRequest',
				content: 'testContent',
				messageType: 'accessRequest',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testAccessRequest2',
				content: 'testContent',
				messageType: 'accessRequest',
				sendTime: new Date(),
				reporter: 'testReporter2',
    	}];

    	Message.create(messages)
    	.then(function(){
    		request(app)
    		.get('/api/messages/findAllExceptAccess/')
    		.set('Authorization', 'Bearer ' + token)
    		.expect(200)
    		.end(function(err, res){
    			if (err) return done(err);
    			res.body.length.should.eql(messages.length - targetMsgNumber(messages, 'accessRequest'));
    			res.body.forEach(function (req, i) {
            res.body[i].messageType.should.not.eql('accessRequest');
          });
    			done();
    		});
    	});
    });
  });

  describe('GET /findAllUrgentFillIn/ (findAllUrgentFillIn)', function(){
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

    it('has urgentFillIn msg', function(done){
    	var messages = [{
    		title: 'testGeneric',
				content: 'testContent',
				messageType: 'generic',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testUrgentFillIn',
				content: 'testContent',
				messageType: 'urgentFillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testFillIn',
				content: 'testContent',
				messageType: 'fillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testAccessRequest',
				content: 'testContent',
				messageType: 'accessRequest',
				sendTime: new Date(),
				reporter: 'testReporter',
    	}];

    	Message.create(messages)
    	.then(function(){
    		request(app)
    		.get('/api/messages/findAllUrgentFillIn/')
    		.set('Authorization', 'Bearer ' + token)
    		.expect(200)
    		.end(function(err, res){
    			if (err) return done(err);
    			res.body.length.should.eql(targetMsgNumber(messages, 'urgentFillIn'));
    			res.body.forEach(function (req, i) {
            res.body[i].messageType.should.eql('urgentFillIn');
          });
    			done();
    		});
    	});
    });

    it('does not have urgentFillIn msg', function(done){
    	var messages = [{
    		title: 'testGeneric',
				content: 'testContent',
				messageType: 'generic',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testFillIn',
				content: 'testContent',
				messageType: 'fillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testAccessRequest',
				content: 'testContent',
				messageType: 'accessRequest',
				sendTime: new Date(),
				reporter: 'testReporter',
    	}];

    	Message.create(messages)
    	.then(function(){
    		request(app)
    		.get('/api/messages/findAllUrgentFillIn/')
    		.set('Authorization', 'Bearer ' + token)
    		.expect(200)
    		.end(function(err, res){
    			if (err) return done(err);
    			res.body.length.should.eql(targetMsgNumber(messages, 'urgentFillIn'));
    			res.body.forEach(function (req, i) {
            res.body[i].messageType.should.eql('urgentFillIn');
          });
    			done();
    		});
    	});
    });
  });

  describe('GET /findAllGeneralFillIn/ (findAllGeneralFillIn)', function(){
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

    it('has fillIn msg', function(done){
    	var messages = [{
    		title: 'testGeneric',
				content: 'testContent',
				messageType: 'generic',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testUrgentFillIn',
				content: 'testContent',
				messageType: 'urgentFillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testFillIn',
				content: 'testContent',
				messageType: 'fillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testAccessRequest',
				content: 'testContent',
				messageType: 'accessRequest',
				sendTime: new Date(),
				reporter: 'testReporter',
    	}];

    	Message.create(messages)
    	.then(function(){
    		request(app)
    		.get('/api/messages/findAllGeneralFillIn/')
    		.set('Authorization', 'Bearer ' + token)
    		.expect(200)
    		.end(function(err, res){
    			if (err) return done(err);
    			res.body.length.should.eql(targetMsgNumber(messages, 'fillIn'));
    			res.body.forEach(function (req, i) {
            res.body[i].messageType.should.eql('fillIn');
          });
    			done();
    		});
    	});
    });

    it('does not have fillIn msg', function(done){
    	var messages = [{
    		title: 'testGeneric',
				content: 'testContent',
				messageType: 'generic',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testUrgentFillIn',
				content: 'testContent',
				messageType: 'urgentFillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testAccessRequest',
				content: 'testContent',
				messageType: 'accessRequest',
				sendTime: new Date(),
				reporter: 'testReporter',
    	}];

    	Message.create(messages)
    	.then(function(){
    		request(app)
    		.get('/api/messages/findAllGeneralFillIn/')
    		.set('Authorization', 'Bearer ' + token)
    		.expect(200)
    		.end(function(err, res){
    			if (err) return done(err);
    			res.body.length.should.eql(targetMsgNumber(messages, 'fillIn'));
    			res.body.forEach(function (req, i) {
            res.body[i].messageType.should.eql('fillIn');
          });
    			done();
    		});
    	});
    });
  });

  describe('GET /findAllGeneric/ (findAllGeneric)', function(){
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

    it('has generic msg', function(done){
    	var messages = [{
    		title: 'testGeneric',
				content: 'testContent',
				messageType: 'generic',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testUrgentFillIn',
				content: 'testContent',
				messageType: 'urgentFillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testFillIn',
				content: 'testContent',
				messageType: 'fillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testAccessRequest',
				content: 'testContent',
				messageType: 'accessRequest',
				sendTime: new Date(),
				reporter: 'testReporter',
    	}];

    	Message.create(messages)
    	.then(function(){
    		request(app)
    		.get('/api/messages/findAllGeneric/')
    		.set('Authorization', 'Bearer ' + token)
    		.expect(200)
    		.end(function(err, res){
    			if (err) return done(err);
    			res.body.length.should.eql(targetMsgNumber(messages, 'generic'));
    			res.body.forEach(function (req, i) {
            res.body[i].messageType.should.eql('generic');
          });
    			done();
    		});
    	});
    });

    it('does not have generic msg', function(done){
    	var messages = [{
    		title: 'testGeneric',
				content: 'testContent',
				messageType: 'generic',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testUrgentFillIn',
				content: 'testContent',
				messageType: 'urgentFillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testFillIn',
				content: 'testContent',
				messageType: 'fillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testAccessRequest',
				content: 'testContent',
				messageType: 'accessRequest',
				sendTime: new Date(),
				reporter: 'testReporter',
    	}];

    	Message.create(messages)
    	.then(function(){
    		request(app)
    		.get('/api/messages/findAllGeneric/')
    		.set('Authorization', 'Bearer ' + token)
    		.expect(200)
    		.end(function(err, res){
    			if (err) return done(err);
    			res.body.length.should.eql(targetMsgNumber(messages, 'generic'));
    			res.body.forEach(function (req, i) {
            res.body[i].messageType.should.eql('generic');
          });
    			done();
    		});
    	});
    });
  });

  describe('GET /findAllAccessRequest/ (findAllAccessRequest)', function(){
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

    it('has accessRequest msg', function(done){
    	var messages = [{
    		title: 'testGeneric',
				content: 'testContent',
				messageType: 'generic',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testUrgentFillIn',
				content: 'testContent',
				messageType: 'urgentFillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testFillIn',
				content: 'testContent',
				messageType: 'fillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testAccessRequest',
				content: 'testContent',
				messageType: 'accessRequest',
				sendTime: new Date(),
				reporter: 'testReporter',
    	}];

    	Message.create(messages)
    	.then(function(){
    		request(app)
    		.get('/api/messages/findAllAccessRequest/')
    		.set('Authorization', 'Bearer ' + token)
    		.expect(200)
    		.end(function(err, res){
    			if (err) return done(err);
    			res.body.length.should.eql(targetMsgNumber(messages, 'accessRequest'));
    			res.body.forEach(function (req, i) {
            res.body[i].messageType.should.eql('accessRequest');
          });
    			done();
    		});
    	});
    });

    it('does not have accessRequest msg', function(done){
    	var messages = [{
    		title: 'testGeneric',
				content: 'testContent',
				messageType: 'generic',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testUrgentFillIn',
				content: 'testContent',
				messageType: 'urgentFillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testFillIn',
				content: 'testContent',
				messageType: 'fillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	}];

    	Message.create(messages)
    	.then(function(){
    		request(app)
    		.get('/api/messages/findAllAccessRequest/')
    		.set('Authorization', 'Bearer ' + token)
    		.expect(200)
    		.end(function(err, res){
    			if (err) return done(err);
    			res.body.length.should.eql(targetMsgNumber(messages, 'accessRequest'));
    			res.body.forEach(function (req, i) {
            res.body[i].messageType.should.eql('accessRequest');
          });
    			done();
    		});
    	});
    });
  });

  describe('GET /findById/:id (findById)', function(){
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

    it('valid Id', function(done){
    	var messages = [{
    		title: 'testGeneric',
				content: 'testContent',
				messageType: 'generic',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testUrgentFillIn',
				content: 'testContent',
				messageType: 'urgentFillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testFillIn',
				content: 'testContent',
				messageType: 'fillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testAccessRequest',
				content: 'testContent',
				messageType: 'accessRequest',
				sendTime: new Date(),
				reporter: 'testReporter',
    	}];

    	var id = undefined;

    	Message.create(messages)
    	.then(function(){
    		Message.find({}).then(function(_messages){
    			id = _messages[0]._id;
    		})
    		.then(function(){
    			request(app)
    			.get('/api/messages/findById/' + id)
    			.set('Authorization', 'Bearer ' + token)
    			.expect(200)
    			.end(function(err, res){
    				if (err) return done(err);
    				res.body.should.not.be.empty();
    				res.body._id.should.eql(String(id));
    				done();
    			});
    		});
    	});
    });

    it('invalid Id', function(done){
    	var messages = [{
    		title: 'testGeneric',
				content: 'testContent',
				messageType: 'generic',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testUrgentFillIn',
				content: 'testContent',
				messageType: 'urgentFillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testFillIn',
				content: 'testContent',
				messageType: 'fillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testAccessRequest',
				content: 'testContent',
				messageType: 'accessRequest',
				sendTime: new Date(),
				reporter: 'testReporter',
    	}];

    	var id = undefined;

    	Message.create(messages)
    	.then(function(){
    		Message.find({}).then(function(_messages){
    			id = _messages[0]._id + 'invalid';
    		})
    		.then(function(){
    			request(app)
    			.get('/api/messages/findById/' + id)
    			.set('Authorization', 'Bearer ' + token)
    			.expect(400)
    			.end(function(err, res){
    				if (err) return done(err);
    				res.body.errors[0].message.should.eql('Message id invalid.');
    				done();
    			});
    		});
    	});
    });
  });

  describe('DELETE /:id (removeById)', function(){
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

    it('valid Id', function(done){
    	var messages = [{
    		title: 'testGeneric',
				content: 'testContent',
				messageType: 'generic',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testUrgentFillIn',
				content: 'testContent',
				messageType: 'urgentFillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testFillIn',
				content: 'testContent',
				messageType: 'fillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testAccessRequest',
				content: 'testContent',
				messageType: 'accessRequest',
				sendTime: new Date(),
				reporter: 'testReporter',
    	}];

    	var id = undefined;

    	Message.create(messages)
    	.then(function(){
    		Message.find({}).then(function(_messages){
    			id = _messages[0]._id;
    		})
    		.then(function(){
    			request(app)
    			.delete('/api/messages/' + id)
    			.set('Authorization', 'Bearer ' + token)
    			.expect(200)
    			.end(function(err, res){
    				if (err) return done(err);
    				Message.find({'_id':id}).then(function(dmessage){
    					dmessage.should.be.empty();
    					done();
    				}).catch(done);
    			});
    		});
    	});
    });

    it('invalid Id', function(done){
    	var messages = [{
    		title: 'testGeneric',
				content: 'testContent',
				messageType: 'generic',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testUrgentFillIn',
				content: 'testContent',
				messageType: 'urgentFillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testFillIn',
				content: 'testContent',
				messageType: 'fillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testAccessRequest',
				content: 'testContent',
				messageType: 'accessRequest',
				sendTime: new Date(),
				reporter: 'testReporter',
    	}];

    	var id = undefined;

    	Message.create(messages)
    	.then(function(){
    		Message.find({}).then(function(_messages){
    			id = _messages[0]._id + 'invalid';
    		})
    		.then(function(){
    			request(app)
    			.delete('/api/messages/' + id)
    			.set('Authorization', 'Bearer ' + token)
    			.expect(400)
    			.end(function(err, res){
    				if (err) return done(err);
    				res.body.errors[0].message.should.eql('Message id invalid.');
    				done();
    			});
    		});
    	});
    });
  });

  describe('DELETE / (removeAll)', function(){
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

    it('non-empty collection', function(done){
    	var messages = [{
    		title: 'testGeneric',
				content: 'testContent',
				messageType: 'generic',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testUrgentFillIn',
				content: 'testContent',
				messageType: 'urgentFillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testFillIn',
				content: 'testContent',
				messageType: 'fillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testAccessRequest',
				content: 'testContent',
				messageType: 'accessRequest',
				sendTime: new Date(),
				reporter: 'testReporter',
    	}];

    	Message.create(messages)
    	.then(function(){
    		request(app)
    		.delete('/api/messages/')
    		.set('Authorization', 'Bearer ' + token)
    		.expect(200)
    		.end(function(err, res){
    			if (err) return done(err);
    			Message.find({}).then(function(dmessages){
    				dmessages.should.be.empty();
    				done();
    			}).catch(done);
    		});
    	});
  	});

  	it('empty collection', function(done){
    	var messages = [];

    	Message.create(messages)
    	.then(function(){
    		request(app)
    		.delete('/api/messages/')
    		.set('Authorization', 'Bearer ' + token)
    		.expect(200)
    		.end(function(err, res){
    			if (err) return done(err);
    			Message.find({}).then(function(dmessages){
    				dmessages.should.be.empty();
    				done();
    			}).catch(done);
    		});
    	});
  	});
  });

  describe('POST /updateVolunteers/:id (updateVolunteers)', function(){
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

    it('valid Id', function(done){
    	var messages = [{
    		title: 'testGeneric',
				content: 'testContent',
				messageType: 'generic',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testUrgentFillIn',
				content: 'testContent',
				messageType: 'urgentFillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testFillIn',
				content: 'testContent',
				messageType: 'fillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testAccessRequest',
				content: 'testContent',
				messageType: 'accessRequest',
				sendTime: new Date(),
				reporter: 'testReporter',
    	}];

    	var id = undefined;

    	Message.create(messages)
    	.then(function(){
    		Message.find({}).then(function(_messages){
    			id = _messages[2]._id;
    		})
    		.then(function(){
    			request(app)
    			.post('/api/messages/updateVolunteers/' + id)
    			.send(['tester1', 'tester2', 'tester3'])
    			.set('Authorization', 'Bearer ' + token)
    			.expect(202)
    			.end(function(err, res){
    				if (err) return done(err);
    				Message.findById(id).then(function(umessage){
    					umessage.should.not.be.empty();
    					String(umessage.fillInVolunteers).should.eql(String(['tester1', 'tester2', 'tester3']));
    					done();
    				}).catch(done);
    			});
    		});
    	})
    });

    it('invalid Id', function(done){
    	var messages = [{
    		title: 'testGeneric',
				content: 'testContent',
				messageType: 'generic',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testUrgentFillIn',
				content: 'testContent',
				messageType: 'urgentFillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testFillIn',
				content: 'testContent',
				messageType: 'fillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testAccessRequest',
				content: 'testContent',
				messageType: 'accessRequest',
				sendTime: new Date(),
				reporter: 'testReporter',
    	}];

    	var id = undefined;

    	Message.create(messages)
    	.then(function(){
    		Message.find({}).then(function(_messages){
    			id = _messages[2]._id + 'invalid';
    		})
    		.then(function(){
    			request(app)
    			.post('/api/messages/updateVolunteers/' + id)
    			.send(['tester1', 'tester2', 'tester3'])
    			.set('Authorization', 'Bearer ' + token)
    			.expect(400)
    			.end(function(err, res){
    				if (err) return done(err);
    				done();
    			});
    		});
    	});
    });
  });

  describe('POST /updateViewers/:id (updateViewers)', function(){
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

    it('valid Id', function(done){
    	var messages = [{
    		title: 'testGeneric',
				content: 'testContent',
				messageType: 'generic',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testUrgentFillIn',
				content: 'testContent',
				messageType: 'urgentFillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testFillIn',
				content: 'testContent',
				messageType: 'fillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testAccessRequest',
				content: 'testContent',
				messageType: 'accessRequest',
				sendTime: new Date(),
				reporter: 'testReporter',
    	}];

    	var id = undefined;

    	Message.create(messages)
    	.then(function(){
    		Message.find({}).then(function(_messages){
    			id = _messages[0]._id;
    		})
    		.then(function(){
    			request(app)
    			.post('/api/messages/updateViewers/' + id)
    			.send(['tester1', 'tester2', 'tester3'])
    			.set('Authorization', 'Bearer ' + token)
    			.expect(202)
    			.end(function(err, res){
    				if (err) return done(err);
    				Message.findById(id).then(function(umessage){
    					umessage.should.not.be.empty();
    					String(umessage.viewers).should.eql(String(['tester1', 'tester2', 'tester3']));
    					done();
    				}).catch(done);
    			});
    		});
    	});
    });

    it('invalid Id', function(done){
    	var messages = [{
    		title: 'testGeneric',
				content: 'testContent',
				messageType: 'generic',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testUrgentFillIn',
				content: 'testContent',
				messageType: 'urgentFillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testFillIn',
				content: 'testContent',
				messageType: 'fillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testAccessRequest',
				content: 'testContent',
				messageType: 'accessRequest',
				sendTime: new Date(),
				reporter: 'testReporter',
    	}];

    	var id = undefined;

    	Message.create(messages)
    	.then(function(){
    		Message.find({}).then(function(_messages){
    			id = _messages[0]._id + 'invalid';
    		})
    		.then(function(){
    			request(app)
    			.post('/api/messages/updateViewers/' + id)
    			.send(['tester1', 'tester2', 'tester3'])
    			.set('Authorization', 'Bearer ' + token)
    			.expect(400)
    			.end(function(err, res){
    				if (err) return done(err);
    				done();
    			});
    		});
    	});
    });
  });

  describe('GET /getViewers/:id (getViewers)', function(){
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

    it('valid Id', function(done){
    	var messages = [{
    		title: 'testGeneric',
				content: 'testContent',
				messageType: 'generic',
				sendTime: new Date(),
				reporter: 'testReporter',
				viewers: ['tester1', 'tester2', 'tester3']
    	},
    	{
    		title: 'testUrgentFillIn',
				content: 'testContent',
				messageType: 'urgentFillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testFillIn',
				content: 'testContent',
				messageType: 'fillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testAccessRequest',
				content: 'testContent',
				messageType: 'accessRequest',
				sendTime: new Date(),
				reporter: 'testReporter',
    	}];

    	Message.create(messages)
    	.then(function(){
    		Message.find({}).then(function(_messages){
    			id = _messages[0]._id;
    		})
    		.then(function(){
    			request(app)
    			.get('/api/messages/getViewers/' + id)
    			.set('Authorization', 'Bearer ' + token)
    			.expect(200)
    			.end(function(err, res){
    				if (err) return done(err);
    				res.body.should.eql(['tester1', 'tester2', 'tester3']);
    				done();
    			});
    		});
    	})
    });

    it('invalid Id', function(done){
    	var messages = [{
    		title: 'testGeneric',
				content: 'testContent',
				messageType: 'generic',
				sendTime: new Date(),
				reporter: 'testReporter',
				viewers: ['tester1', 'tester2', 'tester3']
    	},
    	{
    		title: 'testUrgentFillIn',
				content: 'testContent',
				messageType: 'urgentFillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testFillIn',
				content: 'testContent',
				messageType: 'fillIn',
				sendTime: new Date(),
				reporter: 'testReporter',
    	},
    	{
    		title: 'testAccessRequest',
				content: 'testContent',
				messageType: 'accessRequest',
				sendTime: new Date(),
				reporter: 'testReporter',
    	}];

    	Message.create(messages)
    	.then(function(){
    		Message.find({}).then(function(_messages){
    			id = _messages[0]._id + 'invalid';
    		})
    		.then(function(){
    			request(app)
    			.get('/api/messages/getViewers/' + id)
    			.set('Authorization', 'Bearer ' + token)
    			.expect(400)
    			.end(function(err, res){
    				if (err) return done(err);
    				done();
    			});
    		});
    	});
    });
  });

  var targetMsgNumber = function(messages, type){
  	var number = 0;
  	for (var i = messages.length - 1; i >= 0; i--) {
  		if(messages[i].messageType == type){
    		number++;
    	}
    }
    return number;
  };
});