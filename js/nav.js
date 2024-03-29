"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $addstoryform.hide();
  $navUserProfile.text(`${currentUser.username}`).show();
}


// when a user clicks submit to create a new story 
function submitnewstory(){
  console.debug("createnewstory");
  hidePageComponents();
  $addstoryform.show();
  $allStoriesList.show();
  $("#story-title").val("");
  $("#story-author").val("");
  $("#story-url").val("");
};


$submit.on("click", submitnewstory);


/** Show favorite stories on click on "favorites" */
function navFavoritesClick(){
  hidePageComponents();
  putFavoritesListOnPage();
  }

$favoritebtn.on("click", navFavoritesClick);


// Show my own stories on click of mystories button 
function myStoriesClick(){
  hidePageComponents();
  putOwnStoriesOnPage();
}

$myStoriesBtn.on("click", myStoriesClick);