
require('dotenv').config();

const express= require('express');
const ejs= require('ejs');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const flash = require ('connect-flash');
const User= require('./models/user');
const methodOverride = require('method-override')
const engine = require('ejs-mate');
const ExpressError = require("./utils/ExpressError");
const CatchAsync = require("./utils/CatchAsync");
const userRoutes = require('./routes/user-routes');
const adminRoutes = require('./routes/admin-routes');
const authRoutes = require('./routes/auth');
const passport = require('passport');
const localStrategy = require('passport-local');
const Visitor= require('./models/Visitor');
const MongoStore = require('connect-mongo');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const db_url= process.env.DB_URL;

const app = express();

//'mongodb://localhost:27017/eTreasury'
mongoose.connect(db_url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() =>{
        console.log("CONNECTION OPEN")
    })
    .catch((e) =>{
        console.log("Error!");
        console.log(e);
    })
mongoose.set('useCreateIndex', true)

const store= MongoStore.create({
    mongoUrl: db_url, 
    secret: process.env.STORE_SECRET,
    mongoOptions: { useUnifiedTopology: true },
    touchAfter: 24 * 60 * 60
})
store.on("error", function(e){
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: '_jb',
    secret: process.env.SESSION_SECRET,
    resave: false,
    // secure: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 365,
        maxAge: 1000 * 60 * 60 * 24 * 365
    }
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(mongoSanitize());
app.use(helmet());

const scriptSrcUrls= [
    "https://code.jquery.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.datatables.net/",
    "https://cdn.jsdelivr.net/",
    "https://www.google.com/",
    "https://www.gstatic.com/"
];
const styleSrcUrls= [
    "https://fonts.googleapis.com/",
    "https://fonts.gstatic.com/",
    "https://pro.fontawesome.com/",
    "https://cdn.datatables.net/",
    "https://unpkg.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/"
];
const connectSrcUrls= [
    "https://www.google.com/"
];
const fontSrcUrls= [
    "https://fonts.googleapis.com/",
    "https://fonts.gstatic.com/",
    "https://pro.fontawesome.com/",
    "https://unpkg.com/"
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [
                "https://www.google.com/",
                "https://www.gstatic.com/"
            ],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'unsafe-inline'", "'self'",...styleSrcUrls],
            
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dn47bnyxc/",
                "https://cdn.pixabay.com/",
                "https://cdn.datatables.net"
            ],
            fontSrc: ["'self'", ...fontSrcUrls]
        }
    })
)

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use('local', new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) =>{ //these are global. res.locals is accessable by all pages.
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user; //req.user is a passport function that gives detailed information about logged in user
    next();
})

app.get('/', CatchAsync(async(req, res) =>{
    const visitors= await Visitor.findOne({name: 'localhost'})
    if(visitors == null){
        const beginCount= new Visitor({
            count: 1,
            name: 'localhost'
        })
        beginCount.save();
    }else{
        visitors.count +=1;
        visitors.save();
    }
    res.render('home');
}))


// AUTH ROUTES
app.use('/', authRoutes);

// USER PANEL 
app.use('/', userRoutes);




// Admin Panel
app.use('/', adminRoutes);




app.all('*', (req, res, next) =>{
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next)=>{
    const {statusCode = 500}= err;
    if(!err.message){
        err.message= "Something went wrong";
    }
    res.status(statusCode).render('error', {err});
})

const port= process.env.PORT || 5000;

app.listen(port, () =>{
    console.log(`Server started at ${port}`);
})