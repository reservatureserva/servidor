var utils = require("../utils/utils");
var model = require("../models/user-model");

var userCo = (function() {
	var profile = (email, next)=>{
		model.getProfileByEmail(email, next);
	};

	var register = (form, next)=>{
		
		//identificador unico basado en su dni
		var id = utils.encode64(form.dni);
		form.fecha_registro = (new Date).getTime();

		//identificador de la imagen que se guardará en el servidor
		if(form.foto_perfil != ""){
			form.foto_perfil = utils.savePicture(form.foto_perfil.split(',')[1], id, "users");
		}

		model.insert(form, id, next);
	};

	var update = (form)=>{

	};

	var remove = (id)=>{

	};

	var bookings = (json, next)=>{
		model.getBookingByUser(json, next);	
	};

	var createBooking = (booking)=>{

	};

	return{
		profile		: 		profile,
		register	: 		register,
		update		: 		update,
		remove		: 		remove,
		bookings	: 		bookings,
		createBooking : 	createBooking
	};

})();

module.exports = userCo;