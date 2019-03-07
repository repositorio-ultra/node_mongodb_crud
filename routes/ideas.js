const express         = require("express");
const mongoose        = require("mongoose");
const router          = express.Router();

//Tudo que vem nesta router tem como prefixo na url /ideas, portanto ele deve ser removido neste arquivo

// Connect to mongoose
mongoose.connect("mongodb://localhost/vidjot-dev",{ useNewUrlParser: true })
.then(()=>{ console.log("MongoDB connected")})
.catch(err => {console.log(err)});

// Load Idea Model
require("../models/Idea");
const Idea = mongoose.model("ideas");

router.get("/", (request,response)=>{
    Idea.find({})
    .sort({date: "descending"} )
    .then( ideas =>{
        response.render("ideas/index",{
            ideas : ideas
        });
    });
    
});


router.get("/edit/:id", (request,response)=>{
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

router.get("/add", (request,response)=>{
    response.render("ideas/add");
});

router.post("/",(request,response,next)=>{
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
        response.render("add", {

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
               request.flash("success_msg", "Video idea added..");
               response.redirect("/ideas");
           }
       )
    }

});

// Edit form process
router.put("/:id", (request, response)=>{
    Idea.findOne({
        _id: request.params.id
    })
    .then( idea => {
        // new values
        idea.title = request.body.title;
        idea.details = request.body.details;
        idea.save()
        .then( idea => {
            request.flash("success_msg", "Video idea updated..");
            response.redirect("/ideas");
        });
    });
});

// Delete form process
router.delete("/:id", (request, response)=>{
    Idea.deleteOne({
        _id: request.params.id
    })
    .then( () => {
        request.flash("success_msg", "Video idea removed...");
        response.redirect("/");
    });
});


module.exports = router;