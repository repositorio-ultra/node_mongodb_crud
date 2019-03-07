const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Scheam
const UserSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

mongoose.model("users", UserSchema);