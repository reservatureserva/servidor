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

	var offersBean = (response)=>{
		
		var hits = response.hits.hits;
		var mapping = [];
		for (var i=0; i < hits.length; i++) {
			hits[i]._source.id = hits[i]._id; 
			mapping.push(hits[i]._source);
		}
		return mapping;
	};
	var searchOffers = (response, next)=>{
		var params = {
			index 	: 	"ofertas",
			from	: 	0,
			size	: 	20,
			body	: 	response/*{
				sort :[
  					{
  						precio_base: {
							order: response.orden
						}
  					},
  					{
            			_geo_distance : {
            	 			order : "asc",
                			unit : "km",
                			mode : "min",
                			ubicacion.coord : {
                				"lat":  response.position[0],
        						"lon": 	response.position[1]
        					}
            			}
        			}
  				],
  				query: {
    				bool: {  
      					must : [
      						{
								multi_match: {
									query: response.categoria,
									fields: ["categoria"]
        						}
							},
					      	{
					        	multi_match: {
									query: response.busqueda,
									fields: ["titulo", "descripcion", "agencia.nombre"]
					        	}
							},
							{
								range:{
									precio_base:{
										"gte": response.precio[0],
										"lte" : response.precio[1]
									}
								}
							}
      					],
      
		      			filter: {
		        			geo_distance: {
								distance: response.distancia,
								ubicacion.coord: {
                					"lat":  response.position[0],
        							"lon": 	response.position[1]
        						}
							}
		      			}
    				}
  				}
  			}*/
  		};

  		elastic.search(params, function(error, response) {
  			if(error){
  				return next(utils.errors(response.status));
  			}
  			if(!response.hits){
  				return next({});
  			}
  			console.log("[shared-model] - searchOffers ("+response+")");


  			return next(offersBean(response));
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
  			if(!response.hits){
  				return next({});
  			}
  			return next(categoriesBean(response));
  		});
  	};

  	return{
  		getCategories	: 	getCategories,
  		searchOffers	: 	searchOffers
  	};

  })();

  module.exports = sharedModel;
