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
		if(form.foto_perfil && form.foto_perfil != ""){
			form.foto_perfil = utils.savePicture(form.foto_perfil.split(',')[1], id, "users");
		}

		model.insert(form, id, next);
	};

	var update = (user, next)=>{
		//identificador de la imagen que se guardará en el servidor
		if(user.foto_perfil && user.foto_perfil != ""){
			user.foto_perfil = utils.savePicture(user.foto_perfil.split(',')[1], user.id, "users");
		}
		model.update(user, next);
	};

	var remove = (id)=>{

	};

	var availability = (weekAndOffer, next)=>{
		var lunes = new Date(weekAndOffer.lunes); 
		var fIni = weekAndOffer.lunes;
		lunes.setHours(24*7);
		lunes.setMinutes(-1);
		var fFin = lunes.getTime();
		var body = {
			query : {
				bool : {
					must : [
					{
						term : {
							oferta : weekAndOffer.oferta
						}
					},
					{
						range : {
							fecha_inicio : {
								gte : fIni,
								lte : fFin
							}
						}
					}
					]
				}
			}
		}
		model.getCalendarByOffer(weekAndOffer.oferta, function(calendario) {
			model.getAvailability(body, function(reservas) {
				return next(buildCalendarAvailability(calendario, reservas, weekAndOffer));
			});	
		});
	};

	var buildCalendarAvailability = (calendario, reservas, weekAndOffer)=>{
		var stock = calendario.total_disponible;
		delete calendario.oferta;
		delete calendario.total_disponible;
		var i = 0;
		for(var day in calendario){
			json[day].day = utils.getddMMYYYY(weekAndOffer.fIni, i++);
		}
		return calendario;
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