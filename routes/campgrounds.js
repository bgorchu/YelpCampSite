var express= require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware");


router.get("/", function(req,res){
	Campground.find({}, function(err,allcampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds:allcampgrounds, currentuser: req.user});
		}
	});

});




router.post("/", middleware.isLoggedIn, function(req,res){
	var name=req.body.name;
	var price=req.body.price;
	var image=req.body.image;
	var desc=req.body.description;
	var author={
		id: req.user._id,
		username:req.user.username

	}
	var newCampground={name:name, price:price, image:image, description:desc, author: author}
	Campground.create(newCampground, function(err, newlycreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	});


});


router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){

	Campground.findById(req.params.id, function(err, found){
		if(err){
		}
		res.render("campgrounds/edit", {campground:found});
});

});

router.put("/:id",middleware.checkCampgroundOwnership, function(req,res){

	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updated){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});


});


router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
});



//shows info about campground
router.get("/:id", function(req,res){
	
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show", {campground:foundCampground});

	}

});

});




router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");

		}
	});
});





module.exports= router;
