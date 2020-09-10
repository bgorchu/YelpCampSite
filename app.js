var express= require("express"),
			 app=express(),
			 bodyParser=require("body-parser"),
			 mongoose=require("mongoose"),
			 flash=require("connect-flash"),
			 passport=require("passport"),
			 LocalStrategy= require("passport-local"),
			 methodOverride= require("method-override"),
			 Campground= require("./models/campground"),
			 Comment= require("./models/comments"),
			 User=require("./models/user"),
			 seedDB=require("./seeds");


var commentroutes= require("./routes/comments"),
	campgroundroutes=require("./routes/campgrounds"),
	indexroutes=require("./routes/index")

const port = process.env.PORT || 8080

// seedDB();
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);



mongoose.connect(process.env.MONGO_URL|| "mongodb://localhost/yelp_camp",{
	useNewUrlParser:true,
	useCreateIndex: true
}).then(() =>{
	console.log("connected to db");
}).catch(err=>{
	console.log("Error:",err.message);
})


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine",  "ejs");
app.use(methodOverride("_method"));



//PASSPORT CONFIG
app.use(require("express-session")({
	secret: "Once upon a time in a land far away",
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentuser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("error");

	next();
});

app.use(indexroutes);
app.use("/campgrounds/:id/comments", commentroutes);
app.use("/campgrounds", campgroundroutes);




app.listen(port, function(){
	console.log("Listening on Port 8080");
});

