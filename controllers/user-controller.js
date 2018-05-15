var utils = require("../utils/utils");
var model = require("../models/user-model");

var week = "";

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

	var remove = (identificador, next)=>{
		model.remove(identificador, next);
	};

	var availability = (weekAndOffer, next)=>{
		week = weekAndOffer.lunes;
		var lunes = new Date(parseFloat(weekAndOffer.lunes)); 
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
			if(calendario.id){
				model.getAvailability(body, function(reservas) {
					return next(buildCalendarAvailability(calendario, reservas));
				});
			}else{
				//no se ha encontrado calendarios
				return next({});
			}
		});
	};

	var buildCalendarAvailability = (calendario, reservas)=>{
		var stock = calendario.total_disponible;
		var id = calendario.id;
		delete calendario.oferta;
		delete calendario.total_disponible;
		delete calendario.id;
		var i = 0;
		for(var day in calendario){
			calendario[day].day = utils.getddMMYYYY(week, i++);
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
		createBooking : 	createBooking,
		availability  : 	availability
	};

})();

module.exports = userCo;