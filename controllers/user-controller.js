var userCo = (function() {
	var model = require("../models/user-model.js");
	var profile = (email)=>{

	};

	var register = (form, next)=>{
		form.fecha_registro = (new Date).getTime();
		//identificador de la imagen que se guardará en el servidor
		if(form.foto_perfil != ""){
			utils.savePicture(form.foto_perfil.split(',')[1], form.dni);
		}
		var idFotoPerfil = form.dni.concat(form.fecha_registro);
		model.insert();
	};

	var update = (form)=>{

	};

	var remove = (id)=>{

	};

	var bookings = (id)=>{

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