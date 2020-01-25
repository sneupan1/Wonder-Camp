require('dotenv').config();
var express 	= require("express"),
	request 	= require("request"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	flash		= require("connect-flash"),
	mongoose 	= require("mongoose"),
	passport    = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Campground 	= require("./models/campground"),
	Comment 	= require("./models/comments"),
	User 		= require ("./models/user"),
	seedDB		= require("./seeds");

//requiring routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
var url = process.env.DATABASEURL || "mongodb://localhost/wonder_camp";
// mongoose.connect("mongodb://localhost/wonder_camp");
mongoose.connect(url, {
	useNewUrlParser: true,
	useCreateIndex: true
	}). then(()=> {
		console.log("connected to db!");
	}).catch(err => {
		console.log('Error:' , err.message);
	});
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Handsome kto moh",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.get("*", function(req, res) {
	res.redirect("/campgrounds");
});
var connectPORT = process.env.PORT || 3000;
app.listen(connectPORT, process.env.IP, function(){
	console.log("WonderCamp has started!");
});
