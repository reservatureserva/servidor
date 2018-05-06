var utils = (function() {
	var encode64 = (str)=>{
		return Buffer.from(str).toString('base64');
	};

	var decode64 = (cripted)=>{
		return Buffer.from(cripted, 'base64').toString('ascii');
	};

	var pathToSave  = (type, id)=>{
		return "img/".concat(type).concat("/").concat(id).concat(".jpg");
	};

	var savePicture = (base64Data, id, type)=>{
		var path = pathToSave(type, id);
		require("fs").writeFile(
			path, 
			base64Data, 
			'base64', 
			function(err) {
				//TODO control de errores
			});
		return path;

	};

	var errors = (errorCode)=>{
		var feedBack = {
			mensaje : "Ha ocurrido un problema"
		};
		switch(errorCode){
			case 0	:
			feedBack.mensaje = "Este usuario no consta en la base de datos";
			break;
			case 409 :
			feedBack.mensaje = "Este usuario ya está registrado";
			break;

		}
		return feedBack;
	};

	return{
		encode64 	: 	encode64,
		decode64 	: 	decode64,
		savePicture : 	savePicture,
		errors		: 	errors
	}
})();

module.exports = utils;