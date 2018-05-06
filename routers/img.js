const router =  require('express').Router();
var path = require('path');

router.get("/*", function(req, resp) {
	console.log(req.url);
	var pathImg = "img".concat(req.url);

	resp.sendFile(path.resolve(pathImg));
});






module.exports = router;