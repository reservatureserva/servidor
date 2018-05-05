var utils = (function() {
	var encode64 = (str)=>{
		return Buffer.from(str).toString('base64');
	};

	var decode64 = (cripted)=>{
		return Buffer.from(cripted, 'base64').toString('ascii');
	};

	var pathToSave  = (type, id)=>{
		return type.concat("/").concat(encode(id)).concat(".jpg");
	};

	var savePicture = (base64Data, id, type)=>{
		require("fs").writeFile(
			pathToSave(type, id), 
			base64Data, 
			'base64', 
			function(err) {
				console.log(err);
			});

	};
	return{
		encode64 	: 	encode64,
		decode64 	: 	decode64,
		savePicture : 	savePicture
	}
})();