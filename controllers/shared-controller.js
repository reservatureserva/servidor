var utils = require("../utils/utils");
var model = require("../models/shared-model");

var sharedCo = (function() {
	var search = (query, next)=>{
		var body = {};
		body.sort = [
		{
			_geo_distance : {
				order : "asc",
				unit : "km",
				mode : "min",
				"ubicacion\.coord" : {
					"lat":  query.position[0],
					"lon": 	query.position[1]
				}
			}
		}
		];

		if(query.orden !== "DIST"){
			var o = query.orden.toLowerCase
			body.sort.unshift({
				precio_base: {
					order: o
				}
			});
		}
		body.query = {};
		body.query.bool = {};
		body.query.bool.must = [];
		
		if(query.categoria){
			body.query.bool.must.push(
				{
					multi_match: {
						query: query.categoria,
						fields: ["categoria"]
					}
				}
			);
		}

		if(query.busqueda){
			body.query.bool.must.push(
				{
					multi_match: {
						query: query.busqueda,
						fields: ["titulo", "descripcion", "agencia.nombre"]
					}
				}
			);
		}
		
		if(query.precio){
			body.query.bool.must.push({
				range:{
					precio_base:{
						"gte": query.precio[0],
						"lte" : query.precio[1]
					}
				}
			});
		}
		if(query.distancia){
			body.query.bool.filter = {
		        geo_distance: {
					distance: response.distancia,
					"ubicacion\.coord": {
                		"lat":  response.position[0],
        				"lon": 	response.position[1]
        			}
				}
		    };
			
		}

		

		model.searchOffers(body, next);
	};

	var getCategories = (next)=>{
		model.getCategories(next);
	};

	return{
		search		: 		search,
		getCategories : 	getCategories
	};
})();

module.exports = sharedCo;