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

//returns true or false if favorited and should show star 
// const showStar = currentUser == undefined ? false : true;



function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  const showStar = currentUser == undefined ? false : true
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <div>
          ${showStar ? getStarHTML(story,currentUser) : ""}
          <a href="${story.url}" target="a_blank" class="story-link">
            ${story.title}
          </a>
          <small class="story-hostname">(${hostName})</small>
          <small class="story-author">by ${story.author}</small>
          <small class="story-user">posted by ${story.username}</small>
        </li>
      </div?
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
    $favoritedStories.append("<h5> No stories favoritied </h5>")
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



