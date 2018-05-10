const router =  require('express').Router();


var businessCo = require("../controllers/business-controller");

router.post("/profile", function(req, resp) {
	businessCo.profile(req.body.email, function(business) {
		resp.json(business);
	});
});

router.post("/register", function(req, resp) {
	businessCo.register(req.body.email, function(business) {
		resp.json(business);
	});
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
	businessCo.bookings(req.body, function(business) {
		resp.json(business);		
	});
});

router.post("/createOffer", function(req, resp) {
	businessCo.createOffer(req.body, function(id){
		resp.json(id);
	});
});

router.post("/createCalendar", function(req, resp) {
	businessCo.createOffer(req.body, function(id){
		resp.json(id);
	});
});

module.exports = router;