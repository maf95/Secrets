require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const md5 = require('md5');

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
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    newUser.save((err)=>{
        if (!err){
            res.render('secrets');
        }
    })
});

app.post('/login', (req, res) => {
    User.findOne({email:req.body.username},(err,userFound)=>{
       if(userFound){
           if(userFound.password===md5(req.body.password)){
               res.render('secrets');
           } else {
               res.send('Incorrect password!');
           }
       } else {
           res.send('User not found!');
       }
    });
});











app.listen(3000, function() {
    console.log("Server started on port 3000");
  });

