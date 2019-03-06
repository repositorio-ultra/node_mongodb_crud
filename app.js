const express = require("express");
const exphbs  = require("express-handlebars");
const methodOverride = require('method-override');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

// Connect to mongoose
mongoose.connect("mongodb://localhost/vidjot-dev",{ useNewUrlParser: true })
.then(()=>{ console.log("MongoDB connected")})
.catch(err => {console.log(err)});

// Load Idea Model
require("./models/Idea");
const Idea = mongoose.model("ideas");


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

// Method override for PUT
app.use(methodOverride('_method'));

// Index Route

app.get("/", (request, response)=>{
    const title = "Welcome 1";
    response.render("index",{title: title});

});

app.get("/about", (request,response)=>{
    response.render("about"); 
});
app.get("/ideas", (request,response)=>{
    Idea.find({})
    .sort({date: "descending"} )
    .then( ideas =>{
        response.render("ideas/index",{
            ideas : ideas
        });
    });
    
});

app.get("/ideas/edit/:id", (request,response)=>{
    Idea.findOne({
        _id: request.params.id
    })
    .then( ideas =>{
        console.log(ideas);
        response.render("ideas/edit",{ 
            idea: ideas
        });

    });
});

app.get("/ideas/add", (request,response)=>{
    response.render("ideas/add");
});

app.post("/ideas",(request,response,next)=>{
    console.log(request.body);
    let error = [];
    if (! request.body.title )
    {
        console.log("sem título");
        error.push({text: "Please add a title" });
    }
    if (! request.body.details)
    {
        console.log("sem detalhes");
        error.push({text: "Please add details" });
        console.log(error.length);
    }

    if (error.length > 0)
    {
        response.render("ideas/add", {

            errors : error,
            title: request.body.title,
            details: request.body.details            
        });
    }
    else
    {
       const newUser = {
           title: request.body.title,
           details: request.body.details

       }
       //New idea é da model, criada no topo da página
       new Idea(newUser) 
       .save()
       .then(
           idea =>{
               response.redirect("/ideas");
           }
       )
    }

});

// Edit form process
app.put("/ideas/:id", (request, response)=>{
    Idea.findOne({
        _id: request.params.id
    })
    .then( idea => {
        // new values
        idea.title = request.body.title;
        idea.details = request.body.details;
        idea.save()
        .then( idea => {
            response.redirect("/ideas");
        });
    });
});

// Delete form process
app.delete("/ideas/:id", (request, response)=>{
    Idea.remove({
        _id: request.params.id
    })
    .then( () => {

            response.redirect("/ideas");

    });
});

const port = 5000;

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});