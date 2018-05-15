const router =  require('express').Router();


var userCo = require("../controllers/user-controller");

router.post("/profile", function(req, resp) {
	userCo.profile(req.body.email, function(user) {
		resp.json(user);		
	});
});

router.post("/register", function(req, resp) {
	console.log(req.body);
	userCo.register(req.body, function(user) {
		resp.json(user);
	});
});


router.put("/update", function(req, resp) {
	userCo.update(req.body, function(user) {
		resp.json(user)
	});
});


router.delete("/delete", function(req, resp) {
	userCo.remove(req.body.id, function(ok) {
		resp.json(req.body.id);
	});
});


router.post("/booking", function(req, resp) {
	console.log(req.body);
	userCo.bookings(req.body, function(user) {
		resp.json(user);		
	});
});

router.post("/availability", function(req, resp) {
	console.log(req.body);
	userCo.availability(req.body, function(calendar) {
		resp.json(calendar);		
	});
});


router.post("/createBooking", function(req, resp) {
	console.log(req.body);
	userCo.createBooking(req.body);
	resp.json({name: "Patata"})
});

module.exports = router;