var utils = require("../utils/utils");
var model = require("../models/shared-model");

var sharedCo = (function() {
	var search = (query, next)=>{
		/*var sort = query. ??;
		var*/ 
		model.searchOffers(query, next);
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