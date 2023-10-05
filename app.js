//jshint esversion:6
import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import encrypt from 'mongoose-encryption';


mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const app = express();

console.log(process.env.API_KEY);

app.set('view engine', 'ejs');
app.use(express.static("public/css"));
app.use(bodyParser.urlencoded({ extended: true }));


const userSchema = new mongoose.Schema({

    email: String,
    password: String

});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);


app.get("/", function(req, res) {

res.render("home");

});

app.get("/login", (req,res) => {

    res.render("login")
});


app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username })
        .then(foundUser => {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                } else {
                    console.log("Falsches Passwort");
                }
            } else {
                console.log("Benutzer nicht gefunden");
            }
        })
        .catch(err => {
            console.error(err);
        });
});


app.get("/register", function(req,res) {
    
    res.render("register");

});

app.post("/register", async function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    try {
        await newUser.save();
        res.render("secrets");
    } catch (err) {
        console.log(err);
    }
});



app.get("/logout", function(req, res) {

    res.render("logout");
    
});



app.listen(3000, function() {
    console.log("Server started on port 3000");
  });