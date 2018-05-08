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

	var createOffer = (offer, identificador, next)=>{
		var params = {
			index 	: 	"ofertas",
			type	: 	"ofertas",
			id 		: 	identificador,
			body	: 	form
		};

		elastic.create(params, function(error, response) {
			if(error){
				return next(utils.errors(response.status));
			}
			console.log("[business-model] - createOffer ("+JSON.stringify(offer)+", "+identificador+")");
			return next(response._id);
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
			console.log("[user-model] - getBookingByBusiness("+json+")");
			return next(bookingBean(response));
		});
	}

	return{
		insert				: 		insert,
		getProfileById 		: 		getProfileById,
		getProfileByEmail 	: 		getProfileByEmail,
		createOffer			: 		createOffer
	};

})();

module.exports = businessModel;
