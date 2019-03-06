const express  = require("express");
const mongoose = require("mongoose");
const router   = express.Router();

//Tudo que vem nesta router tem como prefixo na url /users


// User Login Route
router.get("/login", (request,response) =>{
    response.send("login");
});
router.get("/register", (request,response) =>{
    response.send("register");
});


module.exports = router;