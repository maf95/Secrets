require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true,useUnifiedTopology: true});


const userSchema = new mongoose.Schema({
    email:String,
    password: String
});


const User = mongoose.model("User", userSchema);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register')
});

app.post('/register', (req, res) => {

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
        email: req.body.username,
        password: hash
    });
    newUser.save((err)=>{
        if (!err){
            res.render('secrets');
        }
    });
    });
    
});

app.post('/login', (req, res) => {
    User.findOne({email:req.body.username},(err,userFound)=>{
       if(userFound){
        bcrypt.compare(req.body.password,userFound.password, function(err, result) {
            if(result ===true){
                res.render('secrets');
            } else {
                res.send('Invalid password!');
            }
        });
       } else {
           res.send('User not found!');
       }
    });
});











app.listen(3000, function() {
    console.log("Server started on port 3000");
  });

