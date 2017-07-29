'use strict';

module.exports = {
  create: create,
  findAll: findAll,
  findAllExceptAccess: findAllExceptAccess,
  findAllUrgentFillIn: findAllUrgentFillIn,
  findAllGeneralFillIn: findAllGeneralFillIn,
  findAllGeneric: findAllGeneric,
  findAllAccessRequest: findAllAccessRequest,
  findById:findById,
  removeById: removeById,
  removeAll: removeAll,
  updateVolunteers: updateVolunteers,
  updateViewers: updateViewers,
  getViewers: getViewers
};

var Message = require('./message.model');

function create(req, res, next) {
	console.log(req.body);
  	Message.create(req.body)
    .then(function(message){
    res.sendStatus(201);
    }, next);
}

function findAll(req, res, next){
	Message.find({})
	.then(function(message){
	return res.json(message);
	},next);
}

function findAllExceptAccess(req, res, next){
	Message.find({'messageType':{$ne:'accessRequest'}})
	.then(function(message){
	return res.json(message);
	},next);
}

function findAllUrgentFillIn(req, res, next){
	Message.find({'messageType':'urgentFillIn'})
	.then(function(message){
	return res.json(message);
	},next);
}

function findAllGeneralFillIn(req, res, next){
	Message.find({'messageType':'fillIn'})
	.then(function(message){
	return res.json(message);
	},next);
}

function findAllGeneric(req, res, next){
	Message.find({'messageType':'generic'})
	.then(function(message){
	return res.json(message);
	},next);
}

function findAllAccessRequest(req, res, next){
	Message.find({'messageType':'accessRequest'})
	.then(function(message){
	return res.json(message);
	},next);
}

function findById(req, res, next){
	var id = req.params.id;

	Message.findById(id, function(err){
    if(err){
		  console.log(err);
			return res.sendStatus(400);
    }
  })
  .then(function(message){
    return res.json(message);
	}, next);
}

function removeById(req, res, next){
	var id = req.params.id;

	Message.findByIdAndRemove(id, function(err){
		if(err){
			console.log(err);
			return res.sendStatus(400);
		}
		console.log("message deleted : ", id);
		return res.sendStatus(200);
	})
}

function removeAll(req, res, next){
	Message.remove({})
	.then(function(){
	return res.sendStatus(200);
	})
}


function updateVolunteers(req,res,next){
  var id = req.params.id;

  Message.findByIdAndUpdate(
    id,
    {
      $set: {
        fillInVolunteers:req.body
      }
    },
    function(err, result){
    if(err){
      console.log("update failed! " + id);
      console.log(err);
      return res.sendStatus(400);
    }else{
      console.log("success"+ id);
      return res.sendStatus(202);
    }
  });
}

function updateViewers(req,res,next){
  var id = req.params.id;

  Message.findByIdAndUpdate(
    id,
    {
      $set: {
        viewers:req.body
      }
    },
    function(err, result){
    if(err){
      console.log("update failed! " + id);
      console.log(err);
      return res.sendStatus(400);
    }else{
      console.log("success"+ id);
      return res.sendStatus(202);
    }
  });
}

function getViewers(req, res, next){
  var id = req.params.id;

  Message.findById(id, function(err){
    if(err){
      console.log(err);
      return res.sendStatus(400);
    }
  }).then(function(message){
  return res.status(200)
        .json(message.viewers);
  },next);

}


