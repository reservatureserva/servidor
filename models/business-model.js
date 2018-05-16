var elastic = require('./elastic-client');
var utils = require('../utils/utils');

var businessModel = (function(){

	var businessBean = (response)=>{
		response.hits.hits[0]._source.id = response.hits.hits[0]._id;
		return response.hits.hits[0]._source;
	};

	var getProfileById = (identificador, next)=>{
		var params = {
			index 	: 	"empresas",
			type	: 	"empresas",
			id 		: 	identificador
		};

		elastic.get(params, function(error, response) {
			if(error){
				return next(utils.errors(response.status));
			}
			console.log("[business-model] - getProfileById ("+identificador+")");
			return next(businessBean(response));
		});

	};

	var getProfileByEmail = (email, next)=>{
		var params = {
			index 	: 	"empresas",
			type	: 	"empresas",
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
			console.log("[business-model] - getProfileByEmail ("+email+")");

			
			return next(businessBean(response));
		});

	};

	var insert = (form, identificador, next)=>{
		var params = {
			index 	: 	"empresas",
			type	: 	"empresas",
			id 		: 	identificador,
			body	: 	form

		};

		elastic.create(params, function(error, response) {
			if(error){
				return next(utils.errors(response.status));
			}
			console.log("[business-model] - insert ("+JSON.stringify(form)+", "+identificador+")");
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
				console.log("ERROR, [user-model] - remove ("+identificador+")"+JSON.stringify(error));
			}
			console.log("[user-model] - remove ("+identificador+")");
			return next(response.result);
		});
	};

	var createOffer = (offer, identificador, next)=>{
		var params = {
			index 	: 	"ofertas",
			type	: 	"ofertas",
			id 		: 	identificador,
			body	: 	offer
		};

		elastic.create(params, function(error, response) {
			if(error){
				return next(utils.errors(response.status));
			}
			console.log("[business-model] - createOffer ("+JSON.stringify(offer)+", "+identificador+")");
			return next({id:response._id});
		});
	};

	var insertCalendar = (calendar, next)=>{
		var params = {
			index 	: 	"calendarios",
			type	: 	"calendarios",
			body	: 	calendar
		};

		elastic.index(params, function(error, response) {
			if(error){
				return next(utils.errors("Error de calendar"));
			}
			console.log("[business-model] - insertCalendar ("+calendar+")");
			return next({});
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

	var getBookingByBusiness = (json, next)=>{
		console.log(json);
		var params = {
			index 	: 	"reservas", 
			type	: 	"reservas",
			from	: 	json.from,
			size	: 	json.size,
			body	: 	{
				query	: 	{
					match 	: 	{
						"agencia.cif"	: 	json.cif 	
					}	
				}
			}
		};

		elastic.search(params, function(error, response) {
			console.log("[user-model] - getBookingByBusiness("+json+")");
			return next(bookingBean(response));
		});
	}

	return{
		insert				: 		insert,
		update 				: 		update,
		remove 				: 		remove,
		getProfileById 		: 		getProfileById,
		getProfileByEmail 	: 		getProfileByEmail,
		createOffer			: 		createOffer,
		insertCalendar 		: 		insertCalendar,
		getBookingByBusiness : 		getBookingByBusiness
	};

})();

module.exports = businessModel;
