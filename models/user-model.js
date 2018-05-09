var elastic = require('./elastic-client');
var utils = require('../utils/utils');

var userModel = (function(){
	
	var userBean = (response)=>{
		//viene de getProfileByEmail
		if(response.hits){
			response.hits.hits[0]._source.id = response.hits.hits[0]._id;
			return response.hits.hits[0]._source;

		}else{
			//viene de getProfileById
			response._source.id = response._id;
			return response._source;
		}
	};

	var getProfileById = (identificador, next)=>{
		var params = {
			index 	: 	"usuarios",
			type	: 	"usuarios",
			id 		: 	identificador
		};

		elastic.get(params, function(error, response) {
			if(error){
				return next(utils.errors(response.status));
			}
			console.log("[user-model] - getProfileById ("+identificador+")");
			return next(userBean(response));
		});

	};

	var getProfileByEmail = (email, next)=>{
		var params = {
			index 	: 	"usuarios",
			type	: 	"usuarios",
			size	: 	1,
			body	: 	{
				query	: 	{
					bool	: 	{
						must 	: 	{
							term	: 	{
								email 	: 	email
							}
						}
					}
				}
			}
		};

		elastic.search(params, function(error, response) {
			if(error){
				return next(utils.errors(response.status));
			}
			if(response.hits.hits.length === 0){
				return next(utils.errors(0));
			}
			console.log("[user-model] - getProfileByEmail ("+email+")");

			
			return next(userBean(response));
		});

	};

	var bookingBean = (response)=>{
		
		var hits = response.hits.hits;
		var mapping = [];
		for (var i=0; i < hits.length; i++) {
			hits[i]._source.id = hits[i]._id; 
			mapping.push(hits[i]._source);
		}
		return mapping;
	};

	var getBookingByUser = (json, next)=>{
		var params = {
			index 	: 	"reservas", 
			type	: 	"reservas",
			from	: 	json.from,
			size	: 	json.size,
			body	: 	{
				query	: 	{
					match	: 	{

						cliente 	: 	json.cliente

					}
				}
			}
		};

		elastic.search(params, function(error, response) {
			console.log("[user-model] - getBookingByUser("+json+")");
			return next(bookingBean(response));
		});
	}

	var insert = (form, identificador, next)=>{
		var params = {
			index 	: 	"usuarios",
			type	: 	"usuarios",
			id 		: 	identificador,
			body	: 	form

		};

		elastic.create(params, function(error, response) {
			if(error){
				return next(utils.errors(response.status));
			}
			console.log("[user-model] - insert ("+JSON.stringify(form)+", "+identificador+")");
			return getProfileById(response._id, next);
		});
	};

	var update = (user, next)=>{
		var id = user.id;
		delete user.id;
		console.log(user);
		var params = {
			index 	: 	"usuarios",
			type	: 	"usuarios",
			id 		: 	id,
			body	: 	{
				doc		: 	user
			}
		};

		elastic.update(params, function(error, response) {
			if(error){
				return next(utils.errors(response.status));
			}
			console.log("[user-model] - update ("+JSON.stringify(user)+")");
			return getProfileById(response._id, next);
		});

	};

	var remove = (identificador, next)=>{
		var params = {
			index 	: 	"usuarios",
			type	: 	"usuarios",
			id 		: 	identificador
		};
		elastic.delete(params, function(error, response) {
			if(error){

			}
			return next();
		})

	};

	return{
		insert				: 		insert,
		getProfileById 		: 		getProfileById,
		getProfileByEmail 	: 		getProfileByEmail,
		getBookingByUser	: 		getBookingByUser,
		update				: 		update,
		remove 				: 		remove
	};

})();

module.exports = userModel;
