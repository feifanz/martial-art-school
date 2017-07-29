var app = require('../../app');
var q = require('q');
var request = require('supertest');
var should = require('should');
var testutils = require('../../utils/testutils');
var Message = require('./message.model');

//test number
var testNum = 10;

//create fuzzer
var fuzzer_create = function(){
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

		it('should create a message if msg is valid', function(done){
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
};

//findAll fuzzer
var fuzzer_findAll = function(){
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

    it('should return all messages in the database if there has messages otherwise empty', function(done){
    	var msgNum = randomInt(0, 10);
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
  });
};

//findAllExceptAccess fuzzer
var fuzzer_findAllExceptAccess = function(){
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

    it('should return all types of messages except accessRequest from database', function(done){
    	var msgNum = randomInt(0, 10);
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
  });
};

//findAllUrgentFillIn fuzzer
var fuzzer_findAllUrgentFillIn = function(){
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

    it('should return all urgentFillIn messages from database', function(done){
    	var msgNum = randomInt(0, 10);
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
  });
};

//findAllGeneralFillIn fuzzer
var fuzzer_findAllGeneralFillIn = function(){
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

    it('should return all fillIn messages from database', function(done){
    	var msgNum = randomInt(0, 10);
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
  });
};

//findAllGeneric fuzzer
var fuzzer_findAllGeneric = function(){
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

    it('should return all generic messages from database', function(done){
    	var msgNum = randomInt(0, 10);
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
  });
};

//findAllAccessRequest fuzzer
var fuzzer_findAllAccessRequest = function(){
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

    it('should return all accessRequest messages from database', function(done){
    	var msgNum = randomInt(0, 10);
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
};

//findById fuzzer
var fuzzer_findById = function(){
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

    it('should return one message with the specific id from database', function(done){
    	var msgNum = 10;
    	var messages = generateRandomMsgs(msgNum);

    	var id = undefined;

    	Message.create(messages)
    	.then(function(){
    		Message.find({}).then(function(_messages){
    			id = _messages[randomInt(0, msgNum-1)]._id;
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
    		})
    	});
    });
  });
};

//removeById fuzzer
var fuzzer_removeById = function(){
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

    it('should delete the message with specific id in database', function(done){
    	var msgNum = 10;
    	var messages = generateRandomMsgs(msgNum);

    	var id = undefined;

    	Message.create(messages)
    	.then(function(){
    		Message.find({}).then(function(_messages){
    			id = _messages[randomInt(0, msgNum-1)]._id;
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
};

//removeAll fuzzer
var fuzzer_removeAll = function(){
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

    it('should delete all messages in database', function(done){
    	var msgNum = randomInt(0, 10);
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
  });
};

//updateVolunteers fuzzer
var fuzzer_updateVolunteers = function(){
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

    it('should update volunteers in a specific message in database', function(done){
    	var msgNum = 10;
    	var messages = generateRandomMsgs(msgNum);

    	var id = undefined;

    	Message.create(messages)
    	.then(function(){
    		Message.find({}).then(function(_messages){
    			id = _messages[randomInt(0, msgNum-1)]._id;
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
  });
};

//updateViewers fuzzer
var fuzzer_updateViewers = function(){
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

    it('should update viewers in a specific message in database', function(done){
    	var msgNum = 10;
    	var messages = generateRandomMsgs(msgNum);

    	var id = undefined;

    	Message.create(messages)
    	.then(function(){
    		Message.find({}).then(function(_messages){
    			id = _messages[randomInt(0, msgNum-1)]._id;
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
  });
};

//getViewers fuzzer
var fuzzer_getViewers = function(){
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

    it('should return all views of a specific message from database', function(done){
    	var msgNum = 10;
    	var messages = generateRandomMsgs(msgNum);
    	var msgIndex = randomInt(0, msgNum-1);

    	Message.create(messages)
    	.then(function(){
    		Message.find({}).then(function(_messages){
    			id = _messages[msgIndex]._id;
    		})
    		.then(function(){
    			request(app)
    			.get('/api/messages/getViewers/' + id)
    			.set('Authorization', 'Bearer ' + token)
    			.expect(200)
    			.end(function(err, res){
    				if (err) return done(err);
    				res.body.should.eql(messages[msgIndex].viewers);
    				done();
    			});
    		});
    	})
    });
  });
};

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
};

//run fuzzer test
for(var i = 0; i < testNum; i++){
	fuzzer_create();
	fuzzer_getViewers();
	fuzzer_updateViewers();
	fuzzer_removeAll();
	fuzzer_updateVolunteers();
	fuzzer_getViewers();
	fuzzer_findAll();
	fuzzer_removeById()
	fuzzer_findById();
	fuzzer_findAllGeneric();
	fuzzer_findAllExceptAccess();
	fuzzer_findAllGeneralFillIn();
	fuzzer_findAllUrgentFillIn();
}

