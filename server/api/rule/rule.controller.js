'use strict';

module.exports = {
  create: create,
  findAll: findAll,
  findByEventTag: findByEventTag,
  removeById: removeById,
  removeAll: removeAll
};

var Rule = require('./rule.model');

function create(req, res, next) {
  Rule.create(req.body)
    .then(function(rule) {
      res.sendStatus(201);
    }, next);
}

function findAll(req, res, next){
	Rule.find({})
	.then(function(rule){
	return res.json(rule);
	},next);
}

function findByEventTag(req, res, next){
	var eventTag = req.params.eventTag;
	Rule.find({'eventTag':eventTag})
	.then(function(rule){
		return res.json(rule);
	}, next);
}

function removeById(req, res, next){
	var id = req.params.id;

	Rule.findByIdAndRemove(id, function(err){
		if(err){
			console.log(err);
			return res.sendStatus(404);
		}
		console.log("rule deleted : ", id);
		return res.sendStatus(200);
	})
}

function removeAll(req, res, next){
	Rule.remove({})
	.then(function(){
	return res.sendStatus(200);
	})
}

