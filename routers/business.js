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
	businessCo.update(req.body, function(business) {
		resp.json(business)
	});
});


router.delete("/delete", function(req, resp) {
	businessCo.remove(req.body.id, function(ok) {
		resp.json(req.body.id);
	});
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
	businessCo.createCalendar(req.body, function(id){
		resp.json(id);
	});
});

module.exports = router;