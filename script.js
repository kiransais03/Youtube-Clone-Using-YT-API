let apikey="AIzaSyBvRcAOZkDVl2yX6uL4hLMy5JBHp6w681k";

//Storing Api Key in the local storage of the browser 

localStorage.setItem("apikey",apikey);


// Home Page

let endpoint =`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=51&regionCode=IN&key=${apikey}`;

async function homepage() {
    try {
    let response = await fetch(endpoint);
    let result = await response.json();
    let search=false
     await addDatatoUi(result,search);
    }
    catch(error) {
        alert("Something Went Wrong,Pls Refresh.");
        console.log(error);
    }
}

homepage();

async function addDatatoUi(jsonresult,search) 
{
  let videoContent = document.getElementsByClassName("video-content")[0];
  videoContent.innerHTML=``;

  for(let i=0;i<jsonresult.items.length;i++) 
  {

    let videoThumb = jsonresult.items[i].snippet.thumbnails.medium.url;
    let videoTitle = jsonresult.items[i].snippet.title;
    let videoChanneltitle = jsonresult.items[i].snippet.channelTitle;
    let videoChannelId =jsonresult.items[i].snippet.channelId;
    let channellogourl = await getchannellogo(videoChannelId);
    let videoId;
    let videoDuration;
    let videoViewcount;
    let videoPublishdate

  if(search) 
  {
    videoId = jsonresult.items[i].id.videoId;
    let videoDetails = await getvideodetails(videoId)
    videoDuration = videoDetails.items[0].contentDetails.duration;
    videoViewcount = getviews(videoDetails.items[0].statistics.viewCount);
    videoPublishdate = formatDate(videoDetails.items[0].snippet.publishedAt);
  }
  else {
    videoId = jsonresult.items[i].id;
     videoDuration = jsonresult.items[i].contentDetails.duration;
    videoViewcount = getviews(jsonresult.items[i].statistics.viewCount);
    videoPublishdate = formatDate(jsonresult.items[i].snippet.publishedAt);
  }

  
  let cardelem = document.createElement("div");
  cardelem.innerHTML=
        `<div class="video-thumbnail">
          <img src="${videoThumb}" alt="thumbnail">
        </div>
        <div class="chlogo-videotitle">
          <img src="${channellogourl}" alt="g">
          <p>${videoTitle}</p>
        </div>
        <div class="chname-videostats">
          <p>${videoChanneltitle}</p>
          <div class="videostats">
            <p>${videoViewcount} views</p>
            <p>${videoPublishdate}</p>
          </div>
      </div>`;
      cardelem.classList.add("card-elem");

      cardelem.addEventListener('click',()=>{
        videoplayer(videoId);
      });
     videoContent.append(cardelem);
  }

}

async function getchannellogo(channelid) {
  let response = await fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channelid}&key=${apikey}`);
  let result = await response.json();
  let logo=result.items[0].snippet.thumbnails.default.url;
  return logo;
}

function getviews(n){
  if(n < 1000) return n ;
  else if ( n >= 1000 && n <= 999999){
      n /= 1000;
      n = parseInt(n)
      return n+"K" ;
  }
  return parseInt(n / 1000000) + "M" ;
}



function formatDate(duration) {
  // PT2H33M23S
  // 2023-06-01T09:07:19Z

  // Get the current date and time
var currentDate = new Date();

// Example published date from YouTube API
var publishedDate = "2023-06-01T09:07:19Z";

// Convert the YouTube API date string to a Date object
var videoDate = new Date(publishedDate);

// Calculate the time difference in milliseconds
var timeDiff = currentDate - videoDate;

// Calculate the time differences in minutes, hours, days, months, and years
var minutesDiff = Math.floor(timeDiff / (1000 * 60));
var hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
var daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
var monthsDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30));
var yearsDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365));

// Determine the appropriate time ago string to display
var timeAgo = "";
if (minutesDiff < 60) {
  if(minutesDiff<=1)
  {
    timeAgo = minutesDiff + " minute ago";
  }
  else
  timeAgo = minutesDiff + " minutes ago";
} else if (hoursDiff < 24) {
  if(hoursDiff<=1)
  {
    timeAgo = hoursDiff + " hour ago";
  }
  else
  timeAgo = hoursDiff + " hours ago";
} else if (daysDiff < 30) {
  if(daysDiff<=1)
  {
    timeAgo = daysDiff + " day ago";
  }
  else
  timeAgo = daysDiff + " days ago";
} else if (monthsDiff < 12) {
  if(monthsDiff<=1)
  {
    timeAgo = monthsDiff + " month ago";
  }
  else
  timeAgo = monthsDiff + " months ago";
} else {
  if(yearsDiff<=1)
  {
    timeAgo = yearsDiff + " year ago";
  }
  else
  timeAgo = yearsDiff + " years ago";
}

// Output the time ago string
return timeAgo;
}


// Search Functionality

let searchbox = document.getElementById("searchip");
async function searchpage() {
  try {
    let query=searchbox.value;
    console.log(query);
    console.log("hhhei")
  let response = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=${query}&type=video&key=${apikey}`);
  let result = await response.json();
  let search=true;
   await addDatatoUi(result,search);
  }
  catch(error) {
      alert("Something Went Wrong,Pls Refresh.");
      console.log(error);
  }
}

async function getvideodetails(videoid) {
  try {
  let response = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoid}&key=${apikey}`)
  let result = await response.json();
  return result;
  }
  catch(error) {
    alert("Something Went Wrong,Pls Refresh.");
    console.log(error);
}
}


document.getElementById("searchbtn").addEventListener("click",searchifanything);

function searchifanything () {
  if(searchbox.value.length>=1){
    searchpage();
    }
}

// Scrollbars Hover Effects

let sidediv = document.getElementsByClassName("side-draw")[0];

sidediv.addEventListener('mouseover',addclass);

sidediv.addEventListener('mouseout',removeclass);

function addclass() {
    sidediv.classList.add('hovered');
  }

  function removeclass() {
    sidediv.classList.remove('hovered');
  }


  //Buttons Fucntionalities

  document.getElementById("yt-logo-btn").addEventListener('click',homepage);

  document.querySelector("#homebutton").addEventListener('click',homepage);

  searchbox.addEventListener("keydown", function(event) {
   //Press Enter To Search
    if (event.keyCode === 13) {
      if(searchbox.value.length>=1){
      searchpage();
      }
    }
  });
    
  //Video Click Redirect to next page by saving the Video ID in cookies

function videoplayer(id) {
  // <a href="./video.html"></a>
  console.log(id);
  // document.cookie="video_id="+ id +";path=${`/Youtube-Clone-Project/video.html`}";
  localStorage.setItem("video_id",id);
  let anchor = document.createElement("a");
  anchor.href="./video.html";
  anchor.target="_blank";
  anchor.click();
}

