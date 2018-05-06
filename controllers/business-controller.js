var utils = require("../utils/utils");
var model = require("../models/user-model");

var businessCo = (function() {
	var profile = (email, next)=>{
		model.getProfileByEmail(email, next);
	};

	var register = (form, next)=>{
		
		//identificador unico basado en su cif
		var id = utils.encode64(form.cif);
		form.fecha_registro = (new Date).getTime();

		//identificador de la imagen que se guardará en el servidor
		if(form.logo != ""){
			form.logo = utils.savePicture(form.logo.split(',')[1], id, "business");
		}

		model.insert(form, id, next);
	};

	var update = (form)=>{

	};

	var remove = (id)=>{

	};

	var bookings = (id)=>{

	};

	var createOffer = (offer)=>{

	};

	var createCalendar = (calendar)=>{

	};

	return{
		profile		: 		profile,
		register	: 		register,
		update		: 		update,
		remove		: 		remove,
		bookings	: 		bookings,
		createOffer : 		createOffer,
		createCalendar : 	createCalendar
	};

})();

module.exports = businessCo;