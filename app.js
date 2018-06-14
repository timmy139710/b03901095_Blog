var express = require("express");
var session = require('express-session');
var path = require("path");
var bodyParser = require("body-parser");

var app = express();
var user = require('./user');
var post = require('./post');

var sessions;
app.use(session({secret: 'my-secret'}));
app.use(express.static(path.join(__dirname,"/html")));
app.use(bodyParser.json());

app.listen(7777,function(){
    console.log("Started listening on port", 7777);
})

app.post('/signin', function (req, res) {
    sessions=req.session;
    var user_email=req.body.email;
    var password=req.body.password;
    user.validateSignIn(user_email,password,function(result){
      if(result){
        sessions.email = user_email;
        sessions.name = result.name;
        sessions.password =password;
        console.log(user_email);
        res.write(result.name);
        res.end();
      }
      else{
        res.send('Wrong username password')
      }
    });
})

app.post('/signup', function (req, res) {
    var name=req.body.name;
    var email=req.body.email;
    var password=req.body.password;
   
    if(name && email && password){
      user.signup(name, email, password);
      res.send('Registered');
    }
    else{
      res.send('Failure');
    }

});

app.post('/signOut', function (req, res){
  sessions=[];
  res.send('Success');
})

app.post('/addPost', function (req, res) {
    var title = req.body.title;
    var subject = req.body.subject;
    var id = req.body.id;
    console.log('addPost id: ', id);
    if(id == '' || id == undefined){
      post.addPost(title, subject ,function(result){
        res.send(result);
      }); 
    }
    else{
      post.updatePost(id, title, subject ,function(result){
        res.send(result);
      }); 
    }
  })

app.post('/getPost', function (req, res) {
    console.log(req.body.name);
    var req_name = req.body.name;

    //handle unauthorized log in
    post.getPost(function(result){
      if(sessions && (sessions.name === req_name))
        res.send(result);
      else if(req_name === 'guest'){
        res.send(result);
      }
      else 
        res.send('unauthorized');
    });
});

app.post('/getPostWithId', function(req,res){
    var id = req.body.id;
    console.log('getPostWithId id: ', id);
    post.getPostWithId(id, function(result){
      res.send(result)
    })
  })

app.post('/deletePost', function(req,res){
    var id = req.body.id;
    post.deletePost(id, function(result){
      res.send(result)
    })
  })