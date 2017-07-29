'use strict';

module.exports = {
  create: create,
  findAllPersonTags: findAllPersonTags,
  findAllEventTags: findAllEventTags,
  findAllPaymentTags: findAllPaymentTags,
  findAll:findAll,
  removeById: removeById,
  removeAll: removeAll
};

var Tag = require('./tag.model');

function create(req, res, next) {
	console.log(req.body);
  	Tag.create(req.body)
    .then(function(tag) {
    	res.sendStatus(201);
    }, next);
}

function findAllPersonTags(req, res, next){
	Tag.find({'tagType':'person'})
	.then(function(tag){
	return res.json(tag);
	},next);
}

function findAllEventTags(req, res, next){
	Tag.find({'tagType':'event'})
	.then(function(tag){
	return res.json(tag);
	},next);
}

function findAllPaymentTags(req, res, next){
	Tag.find({'tagType':'payment'})
	.then(function(tag){
	return res.json(tag);
	},next);
}

function findAll(req, res, next){
	Tag.find({})
	.then(function(tag){
	return res.json(tag);
	},next);
}

function removeById(req, res, next){
	var id = req.params.id;

	Tag.findByIdAndRemove(id, function(err){
    if (err) throw err;
		res.sendStatus(200);
	})
  .catch(next);
}

function removeAll(req, res, next){
	Tag.remove({})
	.then(function(){
  	return res.sendStatus(200);
	});
}

