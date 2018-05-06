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

	return{
		insert				: 		insert,
		getProfileById 		: 		getProfileById,
		getProfileByEmail 	: 		getProfileByEmail
	};

})();

module.exports = businessModel;
