var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comments");
var middleware = require("../middleware");

//index route - show all campgrounds
router.get("/", function(req,res) {  
	//get all campgrounds from db
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});

//create route
router.post("/", middleware.isLoggedIn, function(req, res) {
	//get data from the form and add to campgrounds array
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username : req.user.username
	}
	var newCampground = {name : name, price: price, image: image, description: description, author : author};
	
    //create a new campgrounds and save to database
	Campground.create(newCampground, function(err, newCreated){
		if(err){
			console.log(err);
		} else {
			//redirect back to campgrounds page
		res.redirect("/campgrounds");
		}
	});
	
});

//new route
router.get("/new", middleware.isLoggedIn, function(req, res) {
		res.render("campgrounds/new");
});

//Show Route
router.get("/:id", function(req,res){
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Campground not found!");
			res.redirect("back");
		} else{
			//render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//edit campground route
router.get("/:id/edit", middleware.isAuthorized, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			res.redirect("back");
		} else {
			res.render("campgrounds/edit", {campground: foundCampground});
		}
	});
});
//update campground route
router.put("/:id", middleware.isAuthorized, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//Destroy campground route
router.delete("/:id", middleware.isAuthorized, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err, campgroundRemoved){
		if(err){
			res.redirect("/campgrounds");
		} else {
			Comment.deleteMany( {_id: { $in: campgroundRemoved.comments } }, (err) => {
				if (err) {
					console.log(err);
				}
				res.redirect("/campgrounds");
			});
		}
	});
});

module.exports = router;
