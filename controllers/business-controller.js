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
		if(form.foto_perfil){
			form.foto_perfil = utils.savePicture(form.foto_perfil.split(',')[1], id, "business");
		}

		model.insert(form, id, next);
	};

	var update = (business, next)=>{
		if(business.foto_perfil && business.foto_perfil != ""){
			business.foto_perfil = utils.savePicture(business.foto_perfil.split(',')[1], business.id, "businesss");
		}
		model.update(business, next);
	};

	var remove = (id, next)=>{
		model.remove(id, next);
	};

	var bookings = (json, next)=>{
		model.getBookingByBusiness(json, next);	
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
		}else{
			urls = "/img/offers/default.png"
		}

		offer.imagenes = urls;

		model.createOffer(offer, id,next);

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
		createCalendar 	: 		createCalendar
	};

})();

module.exports = businessCo;