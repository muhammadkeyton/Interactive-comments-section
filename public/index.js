//popup modal functionality

// Get the modal
var modal = document.querySelector(".modal");

// Get the close button that closes the modal
var close_button = document.getElementsByClassName("close-button")[0];

// When the user clicks on any delete button on main comment, open the modal
let allDeleteButtons = document.querySelectorAll(".comment .delete");

allDeleteButtons.forEach((deleteButton,index)=>{
  deleteButton.addEventListener("click",function(){
      //making the modal visible
      document.querySelector(".modal").style.display = "block";

      //main comment delete functionality

      //getting the comment Id for this comment
      let allDeleteMainCommentsId = document.querySelectorAll(".mainCommentDelete input");
      let mainCommentId = allDeleteMainCommentsId[index].value

      console.log(mainCommentId);

      let deleteMainCommentInput = document.querySelector(".delete-form .mainCommentId")
      deleteMainCommentInput.value =mainCommentId;



  });
});

//when the user clicks on any deleted button in comment replies
let allReplyDeleteButtons = document.querySelectorAll(".comment-reply .delete");

allReplyDeleteButtons.forEach((replyDeleteButton,index)=>{
  replyDeleteButton.addEventListener("click",()=>{
    //making the modal visible
    document.querySelector(".modal").style.display = "block";

    //getting main comment id and reply comment id
    let mainCommentId = document.querySelectorAll(".replyCommentDelete input")[index].value;
    let replyCommentId = document.querySelectorAll(".comment-reply .nestedvoteScore .replyId")[index].value;

    console.log("main comment id:"+mainCommentId);
    console.log("reply comment id:"+replyCommentId);

    //passing on the main comment id to the modal's form
    let deleteMainCommentInput = document.querySelector(".delete-form .mainCommentId")
    deleteMainCommentInput.value =mainCommentId;

    //passing on the reply comment id to the modal's form
    let deleteReplyCommentInput = document.querySelector(".delete-form .replyCommentId")
    deleteReplyCommentInput.value =replyCommentId;

  });

});


// When the user clicks on close_button close the modal
close_button.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


//main comment votes functionality

//main comment upvotes
let mainVoteUp = document.querySelectorAll(".main-vote-up")
mainVoteUp.forEach((voteUp,index)=>{
  voteUp.addEventListener("click",()=>{
    //changing currentVoteScore
    let currentVoteScore = document.querySelectorAll(".main-vote-score")[index];
    var increment = 1;
    currentVoteScore.innerText = Number(currentVoteScore.innerText) + increment

    //getting this particular upvote and adding button click effect
    document.querySelectorAll(".main-vote-up")[index].classList.add("button-clicked-up");
    setTimeout(()=>{
      document.querySelectorAll(".main-vote-up")[index].classList.remove("button-clicked-up");
    },100)

    //passing the new vote score to form input and submitting the form
    let newVoteScore = currentVoteScore.innerText
    voteScoreForm = document.querySelectorAll(".mainvoteScore")[index];
    voteScoreInput = document.querySelectorAll(".mainvoteScore .voteScore")[index];
    voteScoreInput.setAttribute("value",newVoteScore);
    voteScoreForm.submit();





  });

});

//main comment downvote
let mainVoteDown = document.querySelectorAll(".main-vote-down");
mainVoteDown.forEach((voteDown,index)=>{
  voteDown.addEventListener("click",()=>{
    //changing currentVoteScore
    let currentVoteScore = document.querySelectorAll(".main-vote-score")[index];
    var decrement = 1;

    if(currentVoteScore.innerText > 0){
      currentVoteScore.innerText = Number(currentVoteScore.innerText) - decrement
    }
    //getting this particular upvote and adding button click effect
    document.querySelectorAll(".main-vote-down")[index].classList.add("button-clicked-down");
    setTimeout(()=>{
      document.querySelectorAll(".main-vote-down")[index].classList.remove("button-clicked-down");
    },100)

    //passing the new vote score to form input and submitting the form
      let newVoteScore = currentVoteScore.innerText
      voteScoreForm = document.querySelectorAll(".mainvoteScore")[index];
      voteScoreInput = document.querySelectorAll(".mainvoteScore .voteScore")[index];
      voteScoreInput.setAttribute("value",newVoteScore);
      voteScoreForm.submit();







  });

});



//main comment reply button behaviour and functionality
document.querySelectorAll(".comment .reply").forEach((reply,index)=>{
  //adding event listener to all reply anchor tags
  reply.addEventListener("click",()=>{

    //autofocusing on the clicked textarea and adding the reply tag(@someone)
    let textarea = document.querySelector(".main-comment textarea")

    textarea.focus()

    //setting form route to /reply and getting/sending the comment id with the post when the user clicks send
    let commentId = document.querySelectorAll(".commentId input")[index].value;

    let replyTo = document.querySelectorAll(".replyTo input")[index].value

    console.log("commentId",commentId);
    console.log("replyTo",replyTo);

    let formHiddenInputId = document.querySelectorAll(".typinForm input")[0];
    formHiddenInputId.value = commentId;

    let formHiddenInputReply = document.querySelectorAll(".typinForm input")[1];
    formHiddenInputReply.value = replyTo;


    let commentForm = document.querySelector(".typinForm");
    commentForm.setAttribute("action","reply");


  });


});


// //reply to other replies in comment button behaviour and functionality
let replyToOtherReply = document.querySelectorAll(".reply-to-other-reply");

replyToOtherReply.forEach((nestedReply,idx)=>{
  nestedReply.addEventListener("click",()=>{
    let textarea = document.querySelector(".main-comment textarea")
    textarea.focus()

    //added one to the index to fix bug when testing locally remove the one
    let commentId = document.querySelectorAll(".mainCommentId input")[idx].value;
    let replyToOtherReply = document.querySelectorAll(".replyToOtherReply input")[idx].value;

    console.log("commentIdreply",commentId);
    console.log("replying to",replyToOtherReply);

    let formHiddenInputId = document.querySelectorAll(".typinForm input")[0];
    formHiddenInputId.value = commentId;

    let formHiddenInputReplyToOther = document.querySelectorAll(".typinForm input")[2];
    formHiddenInputReplyToOther.value = replyToOtherReply;


    commentForm = document.querySelector(".typinForm");
    commentForm.setAttribute("action","reply-to-other");

  })

});

//nested comments replies upvotes functionality
let commentReplyUpVote = document.querySelectorAll(".reply-vote-up");

commentReplyUpVote.forEach((replyVote,index)=>{

  replyVote.addEventListener("click",()=>{
    let currentReplyVoteScore = document.querySelectorAll(".reply-vote-score")[index]
    let increment = 1;
    currentReplyVoteScore.innerText = Number(currentReplyVoteScore.innerText) + increment;

    //getting this particular upvote and adding button click effect
    document.querySelectorAll(".reply-vote-up")[index].classList.add("button-clicked-up");
    setTimeout(()=>{
      document.querySelectorAll(".reply-vote-up")[index].classList.remove("button-clicked-up");
    },100)

    //passing the new vote score to form input and submitting the form
    let newVoteScore = currentReplyVoteScore.innerText
    voteScoreForm = document.querySelectorAll(".nestedvoteScore")[index];
    voteScoreInput = document.querySelectorAll(".nestedvoteScore .voteScore")[index];
    voteScoreInput.setAttribute("value",newVoteScore);
    voteScoreForm.submit();



});

});

//nested comments replies downvotes functionality
let commentReplyDownVote = document.querySelectorAll(".reply-vote-down");

commentReplyDownVote.forEach((replyVote,index)=>{

  replyVote.addEventListener("click",()=>{
    let currentReplyVoteScore = document.querySelectorAll(".reply-vote-score")[index]
    let decrement = 1;

    if(Number(currentReplyVoteScore.innerText)> 0){
      currentReplyVoteScore.innerText = Number(currentReplyVoteScore.innerText) - decrement;
    }


    //getting this particular upvote and adding button click effect
    document.querySelectorAll(".reply-vote-down")[index].classList.add("button-clicked-down");
    setTimeout(()=>{
      document.querySelectorAll(".reply-vote-down")[index].classList.remove("button-clicked-down");
    },100)

    //passing the new vote score to form input and submitting the form
    let newVoteScore = currentReplyVoteScore.innerText
    voteScoreForm = document.querySelectorAll(".nestedvoteScore")[index];
    voteScoreInput = document.querySelectorAll(".nestedvoteScore .voteScore")[index];
    voteScoreInput.setAttribute("value",newVoteScore);
    voteScoreForm.submit();


});

});


//main comment edit functionality
let allEditButtons = document.querySelectorAll(".comment .edit");

allEditButtons.forEach((edit,index)=>{
  edit.addEventListener("click",()=>{
    let allEditMainCommentsId = document.querySelectorAll(".mainCommentDelete input");
    let commentId = allEditMainCommentsId[index];
    console.log("edit id:"+commentId.value);

    //getting the main comment to edit
    let mainComment = document.querySelectorAll(".comment .comment-content")[index];

    let textarea = document.querySelector(".main-comment textarea")
    textarea.innerText = mainComment.innerText;
    textarea.focus()

    let editFormId = document.querySelector(".typinForm .editCommentId")
    editFormId.value = commentId.value

    commentForm = document.querySelector(".typinForm");
    commentForm.setAttribute("action","edit");

  });


});

//reply comment edit functionality
let allReplyEditButtons = document.querySelectorAll(".comment-reply .edit");

allReplyEditButtons.forEach((replyEdit,index)=>{
  replyEdit.addEventListener("click",()=>{
    //getting main comment id and reply comment id
    let mainCommentId = document.querySelectorAll(".replyCommentDelete input")[index].value;
    let replyCommentId = document.querySelectorAll(".comment-reply .nestedvoteScore .replyId")[index].value;

    console.log("maincommentId:"+mainCommentId);
    console.log("replycommentId:"+replyCommentId);

    // getting the reply comment to edit
    let replyComment = document.querySelectorAll(".comment-reply .reply-comment-content")[index];

    let textarea = document.querySelector(".main-comment textarea")
    textarea.innerText = replyComment.innerText;
    textarea.focus()

    let editFormMainId = document.querySelector(".typinForm .editCommentId")
    editFormMainId.value = mainCommentId

    let editFormReplyId = document.querySelector(".typinForm .editReplyId")
    editFormReplyId.value = replyCommentId

    commentForm = document.querySelector(".typinForm");
    commentForm.setAttribute("action","edit");


  });


});
