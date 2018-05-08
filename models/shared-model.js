var elastic = require('./elastic-client');
var utils = require('../utils/utils');

var sharedModel = (function(){

	var sharedBean = (response)=>{
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

	var searchOffers = (response, next)=>{
		var params = {
			index 	: 	"ofertas",
			type	: 	"ofertas",
			from	:   response.ini,
			size	: 	response.fin,
			sort 	: 	jsonSort
			/*body	: 	{
				query	: 	{
					filtered	: 	{
						multi_match	: 	{
							"query": response., 
							"fields": ["titulo", "descripcion", "agencia.nombre"]
						}
					}
				}
			}*/
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

	var categoriesBean = (response)=>{
		var hits = response.hits.hits;
		var mapping = [];
		for (var i=0; i < hits.length; i++) {
			hits[i]._source.id = hits[i]._id; 
			mapping.push(hits[i]._source);
		}
		return mapping;
	};



	var getCategories = (next)=>{
		var params = {
			index 	: 	"categorias", 
			type	: 	"categorias",
			from	: 	0,
			size	: 	100,
			body	: 	{
				query	: 	{
					match_all 	: 	{}
				}
			}
		};

		elastic.search(params, function(error, response) {
			console.log("[shared-model] - getCategories");
			return next(categoriesBean(response));
		});
	};

	return{
		getCategories	: 	getCategories
	};

})();

module.exports = sharedModel;
