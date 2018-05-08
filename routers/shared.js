const router =  require('express').Router();

var controller = require("../controllers/shared-controller");

router.get("/categorias", function(req, resp) {
	controller.getCategories(function(cat) {
		resp.json(cat);
	});

});

router.get("/", function(req, resp) {
	console.log(req.query);
	resp.send("OK img!");
});

router.post("/search", function(req, resp) {
	controller.search(req.body, function(search) {
		resp.json(search);
	});

});

router.post("/calendar", function(req, resp) {
	console.log(req.query.oferta);
});






module.exports = router;