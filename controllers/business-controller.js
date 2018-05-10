var utils = require("../utils/utils");
var model = require("../models/business-model");

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

	var bookings = (id, next)=>{
		model.getBookingByBusiness(id, next);	
	};

	var createOffer = (offer, next)=>{
		var id = utils.encode64(offer.titulo);
		offer.cancelado = false;
		
		var urls = [];
		//identificador de la imagen que se guardará en el servidor
		if(offer.imagenes){
			for(var index = 0; index < offer.imagenes.length; index++){
				urls.push(utils.savePicture(offer.imagenes[index].split(',')[1], id + "_"+index, "offers"));
			}
			offer.imagenes = urls;
		}

		model.insertOffer(offer, id,next);

	};

	var createCalendar = (calendar, next)=>{
		model.insertCalendar(calendar, next);
	};

	return{
		profile			: 		profile,
		register		: 		register,
		update			: 		update,
		remove			: 		remove,
		bookings		: 		bookings,
		createOffer 	: 		createOffer,
		createCalendar 	: 	createCalendar
	};

})();

module.exports = businessCo;