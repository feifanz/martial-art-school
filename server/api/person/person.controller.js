'use strict';

module.exports = {
  create: create,
  update: update,
  findUnlinked: findUnlinked,
  findAllStudents: findAllStudents,
  findAllInstructors: findAllInstructors,
  findAttendees:findAttendees,
  findById: findById,
  findByName: findByName,
  removeById: removeById,
  removeAll: removeAll
};

var Person = require('./person.model');

function create(req, res, next) {
  Person.create(req.body)
    .then(function(person) {
    	res.sendStatus(201);
    }, next);
}

function update(req, res, next){
	var id = req.params.id;
	console.log(req.body);

	Person.findByIdAndUpdate(id, {$set: req.body}, function(err, result){
		if(err){
			console.log("update failed! " + person._id);
			console.log(err);
			return res.sendStatus(400);
		}else{
			console.log("success");
			return res.sendStatus(202);
		}
	});
}

function findUnlinked(req, res, next) {
	Person.find({ user: null })
	.then(function(persons){
		return res.json(persons.map(function (person) {
			return person.toObject();
		}));
	}, next);
}

function findAllStudents(req, res, next){
	Person.find({'personType':'student'})
	.then(function(person){
	return res.json(person);
	},next);
}

function findAllInstructors(req, res, next){
	Person.find({'personType':'instructor'})
	.then(function(person){
	return res.json(person);
	},next);
}

//method findAttendees requires request body format:
//{"attendees":["57c8e74de58ea5a005a10415", "57c8ede3e58ea5a005a10416"]}
function findAttendees(req, res, next){
	var attendeesIds = req.body.attendees;
	
	Person.find({_id: { $in: attendeesIds}})
	.then(function(person){
		return res.json(person);
	},next);
}

function findById(req, res, next){
	var id = req.params.id;

	Person.findById(id, function(err){
		if(err){
			console.log(err);
			return res.sendStatus(400);
		}
	}).then(function(person){
	return res.json(person);
	},next);
}

function findByName(req, res, next){
	var firstName = req.params.firstName;
	var lastName = req.params.lastName

	Person.find({'firstName':firstName, 'lastName':lastName})
	.then(function(person){
	return res.json(person);
	},next);
}

function removeById(req, res, next){
	var id = req.params.id;

	Person.findByIdAndRemove(id, function(err){
		if(err){
			console.log(err);
			return res.sendStatus(404);
		}
		console.log("Person deleted : ", id);
		return res.sendStatus(200);
	})
}

function removeAll(req, res, next){
	Person.remove({})
	.then(function(){
	return res.sendStatus(200);
	})
}

