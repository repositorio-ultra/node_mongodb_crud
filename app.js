const express        = require("express");
const exphbs         = require("express-handlebars");
const methodOverride = require('method-override');
const flash          = require('connect-flash');
const session        = require('express-session');
const bodyParser     = require("body-parser");
const path           = require("path");
const passport       = require("passport");
const mongoose       = require("mongoose");

const app = express();

// How middleware works
// app.use(function(request,response, next){
//     console.log(Date.now());
//     request.nome = "Ricardo ";
//     next(); 
// });

// Handlebars Middeware
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}))
app.set("view engine", "handlebars");

//Body parser middleware para exibir o conteúdo dos formulários submetidos
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Static Folder
app.use(express.static(path.join(__dirname,"public")));
console.log((path.join(__dirname,"public")));

// Method override for PUT, DELETE
app.use(methodOverride('_method'));

// Middleware for session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

// Passport Middleware for user session authentication
app.use(passport.initialize());
app.use(passport.session());

// Flash
app.use(flash());

// Global variables
app.use(function(request,response, next){
    response.locals.success_msg = request.flash("success_msg");
    response.locals.error_msg   = request.flash("error_msg");
    response.locals.error       = request.flash("error");
    response.locals.user        = request.user || null; // Só não vai ser null se estiver logado via passport
    next();
});

// DB Config
const db = require('./config/database');

// Connect to mongoose
mongoose.connect(db.mongoURI,{ useNewUrlParser: true })
.then(()=>{ console.log("MongoDB connected")})
.catch(err => {console.log(err)});

// Index Route

app.get("/", (request, response)=>{
    const title = "Welcome 1";
    response.render("index",{title: title});

});

app.get("/about", (request,response)=>{
    response.render("about"); 
});

// Load Routes
const ideas = require("./routes/ideas");
const users = require("./routes/users");

// Use Routes
app.use("/ideas", ideas);
app.use("/users", users);

// Passport Config
require("./config/passport")(passport);

const port = process.env.PORT || 5000; // Necessário para o deploy

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});