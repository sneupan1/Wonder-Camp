var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comments");
var middleware = require("../middleware");

//Comments new
router.get("/new", middleware.isLoggedIn, function(req, res){
		Campground.findById(req.params.id, function(err, campground){
			if(err || !campground){
				req.flash("error", "Campground not found!");
				res.redirect("back");
			}else {
				res.render("comments/new", {campground: campground});
			}
		});
});

//Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
	//lookup cmpgrounds using ID
	Campground.findById(req.params.id, function(err, campground){
		if (err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save the comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Sucessfully added comment.");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
	
});

//comments edit route
router.get("/:comment_id/edit", middleware.ownsComment, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if (err || !foundCampground){
			req.flash("error", "Campground not found!");
			res.redirect("back");
		}
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			}
			else{
				res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
			}
		});
	});
});

//comments update route
router.put("/:comment_id", middleware.ownsComment, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//comments detroy route

router.delete("/:comment_id", middleware.ownsComment, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports = router;