var app = require('../../app');
var q = require('q');
var request = require('supertest');
var should = require('should');
var testutils = require('../../utils/testutils');
var Message = require('./message.model');

//test number
var testNum = 10;

//generate random integer between min and max
var randomInt = function(min, max){
	return parseInt(Math.random()*(max-min+1)+min);
};

//generate random msg type
var randomMsgType = function(){
	var types = ['urgentFillIn', 'fillIn', 'generic', 'accessRequest'];
	return types[randomInt(0,3)];
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
}

//generate random msgs
var generateRandomMsgs = function(msgNumber){
	var messages = [];

	for (var i = 0; i < msgNumber; i++) {
		messages[i] = {
			title: randomString(20),
			content: randomString(100),
			messageType: randomMsgType(),
			sendTime: new Date(),
			reporter: randomString(10),
			viewers: [randomString(10), randomString(10), randomString(10)]
		};
	}

	return messages;
};

//find the number of specific type of msg in all msgs
var targetMsgNumber = function(messages, type){
  var number = 0;
  for (var i = messages.length - 1; i >= 0; i--) {
  	if(messages[i].messageType == type){
   		number++;
   	}
  }
  return number;
}

var emptyCollection2emptyCollection = function(){
	describe('transition: empty collection to empty collection', function(){
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

		it('findAll()', function(done){
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

    it('findAllExceptAccess()', function(done){
    	var messages = [];

    	Message.create(messages)
    	.then(function(){
    		request(app)
    		.get('/api/messages/findAllExceptAccess/')
    		.set('Authorization', 'Bearer ' + token)
    		.expect(200)
    		.end(function(err, res){
    			if (err) return done(err);
    			res.body.length.should.eql(0);
    			done();
    		});
    	});
    });

    it('findAllUrgentFillIn()', function(done){
    	var messages = [];

    	Message.create(messages)
    	.then(function(){
    		request(app)
    		.get('/api/messages/findAllUrgentFillIn/')
    		.set('Authorization', 'Bearer ' + token)
    		.expect(200)
    		.end(function(err, res){
    			if (err) return done(err);
    			res.body.length.should.eql(0);
    			done();
    		});
    	});
    });

    it('findAllGeneralFillIn()', function(done){
    	var messages = [];

    	Message.create(messages)
    	.then(function(){
    		request(app)
    		.get('/api/messages/findAllGeneralFillIn/')
    		.set('Authorization', 'Bearer ' + token)
    		.expect(200)
    		.end(function(err, res){
    			if (err) return done(err);
    			res.body.length.should.eql(0);
    			done();
    		});
    	});
    });

    it('findAllGeneric()', function(done){
    	var messages = [];

    	Message.create(messages)
    	.then(function(){
    		request(app)
    		.get('/api/messages/findAllGeneric/')
    		.set('Authorization', 'Bearer ' + token)
    		.expect(200)
    		.end(function(err, res){
    			if (err) return done(err);
    			res.body.length.should.eql(0);
    			done();
    		});
    	});
    });

    it('findAllAccessRequest()', function(done){
    	var messages = [];

    	Message.create(messages)
    	.then(function(){
    		request(app)
    		.get('/api/messages/findAllAccessRequest/')
    		.set('Authorization', 'Bearer ' + token)
    		.expect(200)
    		.end(function(err, res){
    			if (err) return done(err);
    			res.body.length.should.eql(0);
    			done();
    		});
    	});
    });

    it('removeAll()', function(done){
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
}

var emptyCollection2hasDocument = function(){
	describe('transition: empty collection to has document', function(){
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

		it('create(valid message)', function(done){
			var messages = generateRandomMsgs(1);

			request(app)
			.post('/api/messages/')
			.send({
				title: messages[0].title,
				content: messages[0].content,
				messageType: messages[0].messageType,
				sendTime: messages[0].sendTime,
				reporter: messages[0].reporter,
				viewers: messages[0].viewers
			})
			.set('Authorization', 'Bearer ' + token)
			.expect(201)
			.end(function(err, res){
				if (err) return done(err);
				Message.find({}).then(function(_message){
					_message.length.should.eql(1);
					_message[0].title.should.eql(messages[0].title);
					_message[0].content.should.eql(messages[0].content);
					_message[0].messageType.should.eql(messages[0].messageType);
					Date(_message[0].sendTime).should.eql(Date(messages[0].sendTime));
					_message[0].reporter.should.eql(messages[0].reporter);
					done();
				}).catch(done);
			});
		});
	});
}

var emptyCollection2errorMissingTitle = function(){
	describe('transition: empty collection to error(missing title)', function(){
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

		it('create(missing titile)', function(done){
			var messages = generateRandomMsgs(1);

			request(app)
			.post('/api/messages/')
			.send({
				title: null,
				content: messages[0].content,
				messageType: messages[0].messageType,
				sendTime: messages[0].sendTime,
				reporter: messages[0].reporter,
				viewers: messages[0].viewers
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
	});
}

var emptyCollection2errorInvalidMessageType = function(){
	describe('transition: empty collection to error(invalid message type)', function(){
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

		it('create(invalid message type)', function(done){
			var messages = generateRandomMsgs(1);

			request(app)
			.post('/api/messages/')
			.send({
				title: messages[0].title,
				content: messages[0].content,
				messageType: 'testType',
				sendTime: messages[0].sendTime,
				reporter: messages[0].reporter,
				viewers: messages[0].viewers
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

		it('create(null message type)', function(done){
			var messages = generateRandomMsgs(1);

			request(app)
			.post('/api/messages/')
			.send({
				title: messages[0].title,
				content: messages[0].content,
				messageType: null,
				sendTime: messages[0].sendTime,
				reporter: messages[0].reporter,
				viewers: messages[0].viewers
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
	});
}

var emptyCollection2errorMissingReporter = function(){
	describe('transition: empty collection to error(missing reporter)', function(){
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

		it('create(missing reporter)', function(done){
			var messages = generateRandomMsgs(1);

			request(app)
			.post('/api/messages/')
			.send({
				title: messages[0].title,
				content: messages[0].content,
				messageType: 'testType',
				sendTime: messages[0].sendTime,
				reporter: messages[0].reporter,
				viewers: messages[0].viewers
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

		it('create(null message type)', function(done){
			var messages = generateRandomMsgs(1);

			request(app)
			.post('/api/messages/')
			.send({
				title: messages[0].title,
				content: messages[0].content,
				messageType: messages[0].messageType,
				sendTime: messages[0].sendTime,
				reporter: null,
				viewers: messages[0].viewers
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
}

var emptyCollection2errorInvalidId = function(){
	describe('transition: empty collection to error(invalid id)', function(){
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

		it('findById(invalid id)', function(done){
    	var messages = [];

    	var id = undefined;

    	Message.create(messages)
    	.then(function(){
    		Message.find({}).then(function(_messages){
    			id = 'invalidId';
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
    		})
    	});
    });

    it('removeById(invalid id)', function(done){
    	var messages = [];

    	var id = undefined;

    	Message.create(messages)
    	.then(function(){
    		Message.find({}).then(function(_messages){
    			id = 'invalid';
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

    it('updateVolunteers(invalid id)', function(done){
    	var messages = [];

    	var id = undefined;

    	Message.create(messages)
    	.then(function(){
    		Message.find({}).then(function(_messages){
    			id = 'invalid';
    		})
    		.then(function(){
    			request(app)
    			.post('/api/messages/updateVolunteers/' + id)
    			.send(['tester1', 'tester2', 'tester3'])
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

    it('updateViewers(invalid id)', function(done){
    	var messages = [];

    	var id = undefined;

    	Message.create(messages)
    	.then(function(){
    		Message.find({}).then(function(_messages){
    			id = 'invalid';
    		})
    		.then(function(){
    			request(app)
    			.post('/api/messages/updateViewers/' + id)
    			.send(['tester1', 'tester2', 'tester3'])
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

    it('getViewers(invalid id)', function(done){
    	var messages = [];

    	Message.create(messages)
    	.then(function(){
    		Message.find({}).then(function(_messages){
    			id = 'invalid';
    		})
    		.then(function(){
    			request(app)
    			.get('/api/messages/getViewers/' + id)
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
}

var hasDocument2hasDocument = function(){
	describe('transition: has document to has document', function(){
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

		it('create(valid message)', function(done){
			var msgNum = randomInt(1, 10);
    	var messages = generateRandomMsgs(msgNum);
    	Message.create(messages);

			messages = generateRandomMsgs(1);

			request(app)
			.post('/api/messages/')
			.send({
				title: messages[0].title,
				content: messages[0].content,
				messageType: messages[0].messageType,
				sendTime: messages[0].sendTime,
				reporter: messages[0].reporter,
				viewers: messages[0].viewers
			})
			.set('Authorization', 'Bearer ' + token)
			.expect(201)
			.end(function(err, res){
				if (err) return done(err);
				Message.find({}).then(function(_message){
					_message.length.should.eql(msgNum + 1);
					done();
				}).catch(done);
			});
		});

		it('findAll()', function(done){
    	var msgNum = randomInt(1, 10);
    	var messages = generateRandomMsgs(msgNum);

    	Message.create(messages)
    	.then(function(){
    		request(app)
    		.get('/api/messages/')
    		.set('Authorization', 'Bearer ' + token)
    		.expect(200)
    		.end(function(err, res){
    			if (err) return done(err);
    			res.body.length.should.eql(msgNum);
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

    it('findAllExceptAccess()', function(done){
    	var msgNum = randomInt(1, 10);
    	var messages = generateRandomMsgs(msgNum);

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

    it('findAllUrgentFillIn()', function(done){
    	var msgNum = randomInt(1, 10);
    	var messages = generateRandomMsgs(msgNum);

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

    it('findAllGeneralFillIn()', function(done){
    	var msgNum = randomInt(1, 10);
    	var messages = generateRandomMsgs(msgNum);

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

    it('findAllGeneric()', function(done){
    	var msgNum = randomInt(1, 10);
    	var messages = generateRandomMsgs(msgNum);

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

    it('findAllAccessRequest()', function(done){
    	var msgNum = randomInt(1, 10);
    	var messages = generateRandomMsgs(msgNum);

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
}

var hasDocument2emptyCollection = function(){
	describe('transition: has document to empty collection', function(){
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

		it('removeAll()', function(done){
    	var msgNum = randomInt(1, 10);
    	var messages = generateRandomMsgs(msgNum);

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

  	it('removeById(valid id)', function(done){
    	var msgNum = 1;
    	var messages = generateRandomMsgs(msgNum);

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
    	})
    });
	});
}

var hasDocument2errorMissingTitle = function(){
	describe('transition: has document to error(missing title)', function(){
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

		it('create(missing titile)', function(done){
			var msgNum = randomInt(1, 10);
    	var messages = generateRandomMsgs(msgNum);
    	Message.create(messages);

			messages = generateRandomMsgs(1);

			request(app)
			.post('/api/messages/')
			.send({
				title: null,
				content: messages[0].content,
				messageType: messages[0].messageType,
				sendTime: messages[0].sendTime,
				reporter: messages[0].reporter,
				viewers: messages[0].viewers
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
	});
}

var hasDocument2errorInvalidMessageType = function(){
	describe('transition: has document to error(invalid message type)', function(){
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

		it('create(invalid message type)', function(done){
			var msgNum = randomInt(1, 10);
    	var messages = generateRandomMsgs(msgNum);
    	Message.create(messages);

			var messages = generateRandomMsgs(1);

			request(app)
			.post('/api/messages/')
			.send({
				title: messages[0].title,
				content: messages[0].content,
				messageType: 'testType',
				sendTime: messages[0].sendTime,
				reporter: messages[0].reporter,
				viewers: messages[0].viewers
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

		it('create(null message type)', function(done){
			var msgNum = randomInt(1, 10);
    	var messages = generateRandomMsgs(msgNum);
    	Message.create(messages);

			var messages = generateRandomMsgs(1);

			request(app)
			.post('/api/messages/')
			.send({
				title: messages[0].title,
				content: messages[0].content,
				messageType: null,
				sendTime: messages[0].sendTime,
				reporter: messages[0].reporter,
				viewers: messages[0].viewers
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
	});
}

var hasDocument2errorMissingReport = function(){
	describe('transition: has document to error(missing reporter)', function(){
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

		it('create(missing reporter)', function(done){
			var msgNum = randomInt(1, 10);
    	var messages = generateRandomMsgs(msgNum);
    	Message.create(messages);

			messages = generateRandomMsgs(1);

			request(app)
			.post('/api/messages/')
			.send({
				title: messages[0].title,
				content: messages[0].content,
				messageType: 'testType',
				sendTime: messages[0].sendTime,
				reporter: messages[0].reporter,
				viewers: messages[0].viewers
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

		it('create(null message type)', function(done){
			var msgNum = randomInt(1, 10);
    	var messages = generateRandomMsgs(msgNum);
    	Message.create(messages);

			messages = generateRandomMsgs(1);

			request(app)
			.post('/api/messages/')
			.send({
				title: messages[0].title,
				content: messages[0].content,
				messageType: messages[0].messageType,
				sendTime: messages[0].sendTime,
				reporter: null,
				viewers: messages[0].viewers
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
}

var hasDocument2errorInvalidId = function(){
	describe('transition: has document to error(invalid id)', function(){
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

		it('findById(invalid id)', function(done){
    	var msgNum = randomInt(1, 10);
    	var messages = generateRandomMsgs(msgNum);

    	var id = undefined;

    	Message.create(messages)
    	.then(function(){
    		Message.find({}).then(function(_messages){
    			id = 'invalidId';
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
    		})
    	});
    });

    it('removeById(invalid id)', function(done){
    	var msgNum = randomInt(1, 10);
    	var messages = generateRandomMsgs(msgNum);
    	Message.create(messages);

    	var id = undefined;

    	Message.create(messages)
    	.then(function(){
    		Message.find({}).then(function(_messages){
    			id = 'invalid';
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

    it('updateVolunteers(invalid id)', function(done){
    	var msgNum = randomInt(1, 10);
    	var messages = generateRandomMsgs(msgNum);
    	Message.create(messages);

    	var id = undefined;

    	Message.create(messages)
    	.then(function(){
    		Message.find({}).then(function(_messages){
    			id = 'invalid';
    		})
    		.then(function(){
    			request(app)
    			.post('/api/messages/updateVolunteers/' + id)
    			.send(['tester1', 'tester2', 'tester3'])
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

    it('updateViewers(invalid id)', function(done){
    	var msgNum = randomInt(1, 10);
    	var messages = generateRandomMsgs(msgNum);
    	Message.create(messages);

    	var id = undefined;

    	Message.create(messages)
    	.then(function(){
    		Message.find({}).then(function(_messages){
    			id = 'invalid';
    		})
    		.then(function(){
    			request(app)
    			.post('/api/messages/updateViewers/' + id)
    			.send(['tester1', 'tester2', 'tester3'])
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

    it('getViewers(invalid id)', function(done){
    	var msgNum = randomInt(1, 10);
    	var messages = generateRandomMsgs(msgNum);
    	Message.create(messages);

    	Message.create(messages)
    	.then(function(){
    		Message.find({}).then(function(_messages){
    			id = 'invalid';
    		})
    		.then(function(){
    			request(app)
    			.get('/api/messages/getViewers/' + id)
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
}

for (var i = 0; i < testNum; i++) {
	emptyCollection2emptyCollection();
	emptyCollection2hasDocument();
	emptyCollection2errorMissingTitle();
	emptyCollection2errorInvalidMessageType();
	emptyCollection2errorMissingReporter();
	emptyCollection2errorInvalidId();
	hasDocument2hasDocument();
	hasDocument2emptyCollection();
	hasDocument2errorMissingTitle();
	hasDocument2errorInvalidMessageType();
	hasDocument2errorMissingReport();
	hasDocument2errorInvalidId();
}