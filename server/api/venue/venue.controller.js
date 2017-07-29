'use strict';

module.exports = {
  create: create,
  findAll: findAll,
  findById: findById,
  findByName: findByName,
  findByCapacity: findByCapacity,
  removeById: removeById,
};

var Venue = require('./venue.model');

function create(req, res, next) {
  Venue.create(req.body)
    .then(function(venue) {
    	res.sendStatus(201);
    }, next);
}

function findAll(req, res, next){
	Venue.find({})
	.then(function(venue){
	return res.json(venue);
	},next);
}

function findById(req, res, next){
	var id = req.params.id;

	Venue.findById(id, function(err){
		if(err){
			console.log(err);
			return res.sendStatus(400);
		}
	}).then(function(venue){
	return res.json(venue);
	},next);
}

function findByName(req, res, next){
	var name = req.params.name;

	Venue.find({'name':name})
	.then(function(venue){
	return res.json(venue);
	},next);
}

function findByCapacity(req, res, next){
	var capacity = req.params.capacity;

	Venue.where('capacity').gte(capacity)
	.then(function(venue){
	return res.json(venue);
	},next);
}

function removeById(req, res, next){
	var id = req.params.id;

	Venue.findByIdAndRemove(id, function(err){
		if(err){
			console.log(err);
			return res.sendStatus(404);
		}
		console.log("Venue deleted : ", id);
		return res.sendStatus(200);
	})
}