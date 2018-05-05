const router =  require('express').Router();


var businessCo = require("../controllers/business-controller");

router.post("/profile", function(req, resp) {
	businessCo.profile(req.body.email);
	resp.json([{name: "Patata"}])
});

router.post("/register", function(req, resp) {
	console.log(req.body);
	businessCo.register(req.body);
	resp.json({name: "Patata"})
});


router.put("/update", function(req, resp) {
	console.log(req.body);
	businessCo.update(req.body);
	resp.json({name: "Patata"})
});


router.delete("/delete", function(req, resp) {
	console.log(req.body);
	businessCo.remove(req.body.email);
	resp.json({name: "Patata"})
});

router.post("/booking", function(req, resp) {
	console.log(req.body);
	businessCo.bookings(req.body);
	resp.json({name: "Patata"})
});

router.post("/createOffer", function(req, resp) {
	console.log(req.body);
	businessCo.createOffer(req.body);
	resp.json({name: "Patata"})
});

router.post("/createCalendar", function(req, resp) {
	console.log(req.body);
	businessCo.createCalendar(req.body);
	resp.json({name: "Patata"})
});

module.exports = router;