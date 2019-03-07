const express  = require("express");
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const passport = require("passport");
const router   = express.Router();

//Tudo que vem nesta router tem como prefixo na url /users
//Load User Model
require("../models/User");
const User = mongoose.model("users");

// User Login Route
router.get("/login", (request,response) =>{
    response.render("users/login");
});
router.get("/register", (request,response) =>{
    response.render("users/register");
});

// Register Form post
router.post("/register", (request,response) =>{
    console.log(request.body);
    console.log(request.body['password']);
    let errors = [];
    if(request.body.password != request.body['confirm-password'] )
    {
        errors.push({text: "A confirmação da senha está incorreta..."} );
    }
    if( request.body.password.length < 4)
    {
        errors.push({text: "A senha de ter pelo menos 4 caracteres..."} );
    }
    if (errors.length > 0)
    {
        response.render("users/register", {
            errors: errors,
            nome: request.body.nome,
            email: request.body.email,
            password: request.body.password,
            'confirm-password': request.body['confirm-password']
        });
    }
    else
    {
        User.findOne({email: request.body.email})
        .then(user => {
            if(user)
            {
                request.flash("error_msg", "Email já cadastrado");
                response.redirect("/users/register");
            }
            else
            {
                const newUser = new User({
                    nome: request.body.nome,
                    email: request.body.email,
                    password: request.body.password
                });
                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(newUser.password, salt,(err, hash)=>{
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                        .then(user => {
                            request.flash("success_msg", "Você foi registrado com sucesso ");
                            response.redirect("/users/login");
                        })
                        .catch( err => {
                            console.log(err);
                            return;
                        })
                    })
                });
            }
        })
    }
});


module.exports = router;