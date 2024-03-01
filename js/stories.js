"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

const showStar = Boolean(currentUser);



function generateStoryMarkup(story, showTrashCan = false) {
  // console.debug("generateStoryMarkup", story);
  const showStar = currentUser == undefined ? false : true
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <div>
          ${showTrashCan ? createTrashCanBtn() : ""}
          ${showStar ? getStarHTML(story,currentUser) : ""}
          <a href="${story.url}" target="a_blank" class="story-link">
            ${story.title}
          </a>
          <small class="story-hostname">(${hostName})</small>
          <div class="story-author">by ${story.author}</div>
          <div class="story-user">posted by ${story.username}</div>
        </li>
      </div>
    `);
}

/** Make favorite/not-favorite star for story */
function getStarHTML(story,user){
  const isFavorite = user.storyIsFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
  <span class = "star">
  <i class = "${starType} fa-star"></i>
  </span>`;
}

//add event listener for star

async function toggleStoryFavorite(e){
  const $tgt = $(e.target);
  const $closestLi = $tgt.closest("li");
  const storyid = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyid);

      // see if the item is already favorited (checking by presence of star)
  if ($tgt.hasClass("fas")){
       // currently a favorite: remove from user's fav list and change star
       await currentUser.removeStoryFavorites(story);
       $tgt.closest("i").toggleClass("fas far");
  }
  else {
    await currentUser.addStoryToFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}

$allStoriesList.on("click",".star",toggleStoryFavorite);
$favoritedStories.on("click",".star",toggleStoryFavorite);
$myStories.on("click",".star",toggleStoryFavorite);



/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();

}

// KQ created this function to call add stories when btn submit
async function addNewStoryToPage(e){
  e.preventDefault();
  let title = $("#story-title").val();
  let author = $("#story-author").val();
  let url = $("#story-url").val();

  let newStory = await storyList.addStory(currentUser,
    {title, url, author});

  let $story = generateStoryMarkup(newStory);  
  $allStoriesList.prepend($story);
  $addstoryform.hide();

}

  $addstoryform.on("submit",addNewStoryToPage);


/** Put favorites list on page. */
function putFavoritesListOnPage(){
  $favoritedStories.empty();

  if (currentUser.favorites.length === 0){
    $favoritedStories.append("<h5> No stories favorited </h5>")
  }
  else {
    // loop through all of our stories and generate HTML for them
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }
  $favoritedStories.show();
}

// Put my own stories on page 
function putOwnStoriesOnPage(){
  $myStories.empty();
  if (currentUser.ownStories.length === 0){
    $myStories.append("<h5> No stories added! </h5>");
  }
  else {
    for (let story of currentUser.ownStories){
      const $myStory = generateStoryMarkup(story,true);
      $myStories.prepend($myStory);
    }
  }
  $myStories.show();
}

//trashcan HTML for deletion
function createTrashCanBtn(){
  return `
  <span class = "trash-can">
    <i class = "fas fa-trash-alt"></i>
  </span>
  `
}

//remove story markup
async function removeStoryOnPage(e){
  e.preventDefault();
  const $tgt = $(e.target);
  const $closestLi = $tgt.closest("li");
  const $storyId = $closestLi.attr("id");
  await storyList.removeStory(currentUser,$storyId);
  $closestLi.remove();
  
}

$myStories.on("click", ".trash-can", removeStoryOnPage)

