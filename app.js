const express        = require("express");
const exphbs         = require("express-handlebars");
const methodOverride = require('method-override');
const flash          = require('connect-flash');
const session        = require('express-session');
const bodyParser     = require("body-parser");

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

// Method override for PUT, DELETE
app.use(methodOverride('_method'));

// Middleware for session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

// Flash
app.use(flash());

// Global variables
app.use(function(request,response, next){
    response.locals.success_msg = request.flash("success_msg");
    response.locals.error_msg = request.flash("error_msg");
    response.locals.error = request.flash("error");
    next();
});

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

const port = 5000;

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});