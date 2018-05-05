const router =  require('express').Router();

var controller = require("../controllers/shared-controller");

router.get("/categorias", function(req, resp) {
	resp.send("OK!");

});

router.post("/search", function(req, resp) {
	resp.send("OK!");

});

router.post("/calendar", function(req, resp) {
	console.log(req.query.oferta);
});




module.exports = router;