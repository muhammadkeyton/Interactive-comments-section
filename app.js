
require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const time = require(__dirname+"/time.js");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const session = require("express-session");
const flash = require('connect-flash');
const profile = require(__dirname+"/profile.js");


const app = express();

//using body parser
app.use(bodyParser.urlencoded({ extended: true }));

//using ejs
app.set('view engine', 'ejs');

//serving static files
app.use(express.static(__dirname+'/public'));


// setting up session
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized:false
}))

// initilizing passport and setting up passport to manage sessions
app.use(passport.initialize());
app.use(passport.session());

//using flash to display error messages and more
app.use(flash());


//connecting to mongodb database
mongoose.connect(process.env.DATABASE);

//user database schema
const userSchema = new mongoose.Schema({
  username:String,
  profileImg:String,
  commentsIds:[]
})

userSchema.plugin(passportLocalMongoose);

//comments schema
const commentSchema = new mongoose.Schema({
  content:String,
  createdAt:String,
  score:Number,
  commenterInfo:userSchema,
  replies:[{content:String,createdAt:String,score:Number,replyingTo:String,commenterInfo:userSchema,replyToOtherReply:String,mainCommentId:String}]

})

const User = mongoose.model("user",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const Comment = mongoose.model("comment",commentSchema);

app.get("/",(req,res)=>{
  res.render("login-signup",{method:"sign-in",route:"/",message:"no"});
});

app.get("/sign-up",(req,res)=>{
  res.render("login-signup",{method:"sign-up",route:"/sign-up",message:"no"});
});

app.get('/log-out', function(req, res){
  req.logout();
  res.redirect('/');
});


app.get("/comments-section",(req,res)=>{
  const currentUser = req.user;

  if(req.isAuthenticated()){
    Comment.find({},(err,foundComments)=>{
      if(err){
        console.log(err);
      }else{
        //getting current time and passing it to be rendered and checked against time saved on db
        const currentTime = time.getCurrentTime()
        res.render("comment",{comments:foundComments,currentTime:currentTime,time:time,currentUser:currentUser});
      }

    });


  }else{
    res.redirect("/");
  }



});


//registering new users
app.post("/sign-up",(req,res)=>{

  //checking if user already in database and registering if not found
  User.findOne({username:req.body.username},(err,foundUser)=>{
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        req.flash("info",`user with the name ${req.body.username} already exists,try another name.`);
        res.render("login-signup",{method:"sign-up",route:"/sign-up",message:req.flash("info")[0]})
      }else{
        User.register({username:req.body.username},req.body.password,(err,user)=>{
          if(err){
            console.log(err);
            res.redirect("/sign-up")
          }else{
            //finding the saved user and adding profile image
            User.findOne({username:req.body.username},(err,foundUser)=>{
              if(err){console.log(err);}else{
                foundUser.profileImg = profile;
                foundUser.save();
              }

            });
            passport.authenticate("local")(req,res,()=>{
              res.redirect("/comments-section");
            });

          }


        });

      }
    }

  });

});


//logging in existing users
app.post("/",(req,res)=>{
  const user = new User({
    username:req.body.username,
    password:req.body.password
  })

  User.findOne({username:req.body.username},(err,foundUser)=>{
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        //checking if password matches and signing in the user
        foundUser.authenticate(req.body.password, function(err,model,passwordError){
           if(passwordError){
             req.flash("info","incorrect password! please check and try again.")
             res.render("login-signup",{method:"Sign-in",route:"/",message:req.flash('info')[0]})
           } else{
             req.login(user, function(err) {
               if(err){
                 console.log(err);
                 res.redirect("/")
               }else{
                 passport.authenticate("local")(req,res,function(){
                   res.redirect("/comments-section")});
               }

           });

           }
       });

      }else{
        //user not found in databse
        if(req.body.username && req.body.password){
          req.flash("info",`${req.body.username} was not found in database! please sign up instead.`)
          res.render("login-signup",{method:"sign-up",route:"/sign-up",message:req.flash('info')[0]})
        }else{
          //user tries to submit empty form
          req.flash("info","you can't sign in without entering credentials");
          res.render("login-signup",{method:"sign-in",route:"/",message:req.flash("info")[0]})
        }


      }

    }



  });


});


//this is the route for posting a comment and it finds the current user and passes the comment id to the comments and the users collections
app.post("/comment",(req,res)=>{
  const comment = req.body.replyContent;
  const createdAt = time.getCurrentTime();
  const score = 0;



User.findOne({ username:req.user.username}, function (err,foundUser){
  if(err){
    console.log(err);
    res.redirect("/")
  }else{
    if(comment.length > 0){

      const newComment = new Comment({
        content:comment,
        createdAt:createdAt,
        score:0,
        commenterInfo:foundUser
      });

      newComment.save((err)=>{
        if(!err){
          foundUser.commentsIds.push(newComment.id)
          foundUser.save();
          console.log("successfully saved new comment to db");
          res.redirect("/comments-section")
        }

      });
      newComment.commenterInfo.commentsIds.push(newComment.id);







    }else{
      res.redirect("/comments-section");
    }

  }




});

});

app.get("/view",(req,res)=>{
  Comment.find({},(err,all)=>{
    console.log(all[0]);
  });
});

app.post("/reply",(req,res)=>{
  const replyContent = req.body.replyContent;
  const commentId = req.body.commentId;
  const replyTo = req.body.replyTo;


  const createdAt = time.getCurrentTime();
  const score = 0;

  if(replyContent.length > 0){
    Comment.findById(commentId, function (err,foundComment){
      if(err){
        console.log(err);
      }else{

        User.findOne({ username:req.user.username}, function (err, foundUser){
          foundComment.replies.push({commenterInfo:foundUser,content:replyContent,replyingTo:replyTo,createdAt:createdAt,score:score,mainCommentId:commentId})
          foundComment.save((err)=>{if(err){console.log(err);}else{console.log("successfully updated comment document");}});
          res.redirect("/comments-section")
        });




      }

    });

  }else{
    res.redirect("/comments-section")
  }



});


app.post("/reply-to-other",(req,res)=>{
  const replyContent = req.body.replyContent;
  const commentId = req.body.commentId;
  const replyToOtherReply = req.body.replyToOtherReply;

  const createdAt = time.getCurrentTime();
  const score = 0;

  Comment.findById(commentId, function (err,foundComment){
    if(err){
      console.log(err);
      res.redirect("/comments-section");
    }else{
      User.findOne({username:req.user.username},(err,foundUser)=>{
        foundComment.replies.push({commenterInfo:foundUser,content:replyContent,replyToOtherReply:replyToOtherReply,score:score,createdAt:createdAt,mainCommentId:commentId});
        foundComment.save((err)=>{if(err){console.log(err);}else{console.log("successfully updated reply to other reply in comment");}})
        res.redirect("/comments-section");
      });

    }


});

});


//saving main comment vote score
app.post("/mainVote",(req,res)=>{
  const mainvoteScore = req.body.mainvoteScore;
  const commentId = req.body.commentId;

  Comment.findById(commentId, function (err,foundComment){
    if(err){console.log(err);}else{
      foundComment.score = mainvoteScore;
      foundComment.save((err)=>{
        if(err){console.log(err);}else{console.log("successfully updated score for main comment");}
      })
      res.redirect("/comments-section")

    }
  });


});


// saving nested comments vote score
app.post("/nestedVote",(req,res)=>{
  const nestedVoteScore = req.body.nestedVoteScore;
  const nestedCommentId = req.body.nestedCommentId;
  const mainCommentId = req.body.mainCommentId;

  Comment.findById(mainCommentId,function(err,foundComment){
    if(err){console.log(err);}else{
      foundComment.replies.forEach((reply)=>{
        if(reply.id === nestedCommentId){
          reply.score = nestedVoteScore;
          foundComment.save((err)=>{if(err){console.log(err);}else{console.log("successfully updated score for nested vote");}  })
          res.redirect("/comments-section");
        }
      });

    }

  });
});

//editing main comments and reply comments
app.post("/edit",(req,res)=>{
  const mainCommentId = req.body.editCommentId;
  const replyCommentId = req.body.editReplyId
  const commentContent = req.body.replyContent;
  console.log(req.body);
  if(mainCommentId && replyCommentId){
    console.log("we got both what next");
    Comment.findById(mainCommentId,function(err,foundComment){
      if(err){
        console.log(err);
      }else{
        foundComment.replies.forEach((reply)=>{
          if(reply.id === replyCommentId){
            reply.content = commentContent;
            foundComment.save((err)=>{console.log("successfully edited reply comment");});
            res.redirect("/comments-section")
          }
        });

      }
    });

  }else{
    Comment.findById(mainCommentId, function(err,foundComment){
      if(err){
        console.log(err);
      }else{
        foundComment.content = commentContent;
        foundComment.save((err)=>{if(err){console.log(err);}else{console.log("successfully edited main comment content");}})
        res.redirect("/comments-section");
      }

    });

  }

});


//deleting main comment and reply comments
app.post("/delete",(req,res)=>{
  const mainCommentId = req.body.mainCommentId;
  const replyCommentId = req.body.replyCommentId;

  if(mainCommentId && replyCommentId){
    console.log("we have both what should we do");
    Comment.findOneAndUpdate({_id:mainCommentId}, {$pull:{replies:{_id:replyCommentId} }},(err,foundComment)=>{
      if(err){
        console.log(err);
      }else{
        console.log("successfully deleted reply comment");
        res.redirect("/comments-section")
      }

    })


  }else{
    Comment.findByIdAndDelete(mainCommentId,(err)=>{
      if(err){
        console.log(err);
      }else{
        console.log("successfully deleted main comment with an id of:"+mainCommentId);
        res.redirect("/comments-section");
      }

    });

  }

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port,(req,res)=>{
  console.log(`server running on port ${port}`);
});
