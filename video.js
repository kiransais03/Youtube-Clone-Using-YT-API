// let cookieString = document.cookie;
// let idcookie=cookieString.split("=")[1];

let apikey=localStorage.getItem("apikey");
let vidId =localStorage.getItem("video_id");

console.log("OK OK");

let firstScript = document.getElementsByTagName("script")[0];

console.log(firstScript);
if(true){
firstScript.addEventListener("load", function () {
    console.log("Called Ok");
    onLoadScript();
})
}
else {
    console.log("HEllo");
}

async function onLoadScript() {
//   if (YT) {
    new YT.Player("embedplayer", {
      height: "500",
      width: "900",
      videoId:vidId,
      events: {
        onReady:async (event) => {
            console.log(event);
            extractVideoDetails(event.target.h.g.videoId);
            await fetchStats(event.target.h.g.videoId);
            await recomvideos(event.target.h.g.videoId);
            event.target.playVideo();
        }
      }
    });
  }
// }

document.getElementById("yt-logo-btn").addEventListener('click',homepage);

function homepage() {
  let anchor = document.createElement("a");
  anchor.href="./index.html";
  anchor.target="_self";
  anchor.click();
}

async function extractVideoDetails(videoId){ 
    let endpoint = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=60&videoId=${videoId}&key=${apikey}`;

    try {
        let response = await fetch(endpoint);
        let result = await response.json();
        // console.log(result, "comments")
        renderComments(result.items);
    }
    catch(error){
        console.log(`Error occured`, error)
    }
    
}

let global_currvideodata;

const videostatsContainer = document.getElementsByClassName("video-details")[0];

async function  fetchStats(videoId){
    // console.log("Inside fetchStats")
    let endpoint = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&key=${apikey}&id=${videoId}`;
    try {
        const response = await fetch(endpoint);
        const result = await response.json();
        const item = result.items[0] ;
        global_currvideodata = item;
        const title = document.getElementById("title");
        title.innerText = item.snippet.title ;
        console.log(item.snippet.title);
        title.style.fontSize = "20px";
        let channelid = item.snippet.channelId;
        // console.log(videoId);
       const respo=await fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channelid}&key=${apikey}`);
       const rest = await respo.json();
       console.log(channelid);

       let subcount = rest.items[0].statistics.subscriberCount;
       if(subcount>1000000)
       {
        let num=parseInt(subcount/1000000);
        subcount=num+"M";
       }
       else if(subcount>1000)
       {
        let num=subcount/1000;
        subcount=num+"K";
       }
       let profileurl = rest.items[0].snippet.thumbnails.default.url;

       let likecount =item.statistics.likeCount;

      if(likecount>1000000)
       {
        let numlike=parseInt(likecount/1000000);
        likecount=numlike+"M";
       }
       else if(likecount>1000)
       {
        let numlike=likecount/1000;
        likecount=numlike+"K";
       }

        videostatsContainer.innerHTML = `
        <div class="profile">
                <img src="${profileurl}" class="channel-logo" alt="">
                <div class="owner-details">
                    <span>${item.snippet.channelTitle}</span>
                    <span>${subcount} Subscribers</span>
                </div>
        </div>
        <div class="stats">
            <div class="like-container">
                <div class="like">
                   <span><svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;"><path d="M15 5.63 20.66 12 15 18.37V14h-1c-3.96 0-7.14 1-9.75 3.09 1.84-4.07 5.11-6.4 9.89-7.1l.86-.13V5.63M14 3v6C6.22 10.13 3.11 15.33 2 21c2.78-3.97 6.44-6 12-6v6l8-9-8-9z" fill="#0F0F0F"></path></svg> </span>
                   <span style="margin-right:10px">Share  </span>
                   <span class="material-icons">thumb_up</span>
                    <span>${likecount}</span>
                </div>
                <div class="like">
                    <span class="material-icons">thumb_down</span>
                </div>
            </div>
            <div class="comments-container">
                <span class="material-icons">comment</span>
                <span>${item.statistics.commentCount}</span>
                <span style="margin-left:10px"><svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;"><path d="M17 18v1H6v-1h11zm-.5-6.6-.7-.7-3.8 3.7V4h-1v10.4l-3.8-3.8-.7.7 5 5 5-4.9z" fill="#0F0F0F"></path></svg></span>
                <span>Download</span>
                </div>
        </div>`
    }
    catch(error){
        console.log("error", error)
    }
}

 

function renderComments(commentsList) {
    const commentsContainer = document.getElementById("comments-container"); 
    // commentsContainer.
    for(let i =  0; i < commentsList.length ; i++) {
        let comment = commentsList[i] ;
        const topLevelComment = comment.snippet.topLevelComment ;

        let commentElement = document.createElement("div");
        commentElement.className = "comment" ;
        commentElement.innerHTML = `
                <img src="${topLevelComment.snippet.authorProfileImageUrl}" alt="">
                <div class="comment-right-half">
                    <b>${topLevelComment.snippet.authorDisplayName}</b>
                    <p>${topLevelComment.snippet.textOriginal}</p>
                    <div style="display: flex; gap: 20px">
                        <div class="like">
                            <span class="material-icons">thumb_up</span>
                            <span>${topLevelComment.snippet.likeCount}</span>
                        </div>
                        <div class="like">
                            <span class="material-icons">thumb_down</span>
                        </div>
                        <button class="reply" onclick="loadComments(this)" data-comment-id="${topLevelComment.id}">
                            Replies(${comment.snippet.totalReplyCount})
                        </button>
                    </div>
                </div>
            `;
        commentsContainer.append(commentElement);

    }
}

async function loadComments(element){
    const commentId = element.getAttribute("data-comment-id");
    // console.log(commentId)
    let endpoint = `https://www.googleapis.com/youtube/v3/comments?part=snippet&parentId=${commentId}&key=${apikey}`;
    try {
       const response =  await fetch(endpoint);
        const result = await response.json();
        const parentNode = element.parentNode.parentNode ;
        let commentsList = result.items ;
        for(let i = 0 ; i < commentsList.length ; i++) {
            let replyComment =  commentsList[i] ; 
            let commentNode = document.createElement("div");
            commentNode.className = "comment comment-reply";

            commentNode.innerHTML = 
                     `<img src="${replyComment.snippet.authorProfileImageUrl}" alt="">
                        <div class="comment-right-half">
                            <b>${replyComment.snippet.authorDisplayName}</b>
                            <p>${replyComment.snippet.textOriginal}</p>
                            <div class="options">
                                <div class="like">
                                    <span class="material-icons">thumb_up</span>
                                    <span>${replyComment.snippet.likeCount}</span>
                                </div>
                                <div class="like">
                                    <span class="material-icons">thumb_down</span>
                                </div>
                            </div>`;

                parentNode.append(commentNode);
        }
    }   
    catch(error){
        console.log(error);
    }
}


// let response = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&regionCode=IN&relatedToVideoId=${videoId}&type=video&key=${apikey}`);

async function recomvideos(videoId) {
try{
  let response = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${global_currvideodata.snippet.title}&maxResults=50&regionCode=IN&type=video&key=${apikey}`);
  let result = await response.json();
  addrecomvideostoUi(result);
    }
catch(error) {
        console.log(error);
    }
}

async function addrecomvideostoUi(jsonresult) {
  
let recomcontent = document.getElementsByClassName("recommendedvideos")[0];
 for(let i=0;i<jsonresult.items.length;i++) 
 {
    let videoThumb = jsonresult.items[i].snippet.thumbnails.medium.url;
    let videoTitle = jsonresult.items[i].snippet.title;
    let videoChanneltitle = jsonresult.items[i].snippet.channelTitle;
    // let videoChannelId =jsonresult.items[i].snippet.channelId;
    let videoId = jsonresult.items[i].id.videoId;
    let videoDetails = await getvideodetails(videoId)
    let videoDuration = videoDetails.items[0].contentDetails.duration;
    let videoViewcount = getviews(videoDetails.items[0].statistics.viewCount);
    let videoPublishdate = formatDate(videoDetails.items[0].snippet.publishedAt);


    let recomcardelem = document.createElement("div");
    recomcardelem.classList.add("card-elem");
    recomcardelem.innerHTML=
    `<div class="video-thumbnail">
        <img src="${videoThumb}" alt="thumbnail">
    </div>
     <div class="chlogo-videotitle">
          <p>${videoTitle}</p>
          <div class="chname-videostats">
          <p>${videoChanneltitle}</p>
          <div class="videostats">
            <p>${videoViewcount} views</p>
            <p>• ${videoPublishdate}</p>
          </div>
         </div>
    </div>`;
     

      recomcardelem.addEventListener('click',(e)=>{
        e.preventDefault();
        console.log("CLicked video id",videoId)
        videoplayer(videoId);
      });
     recomcontent.append(recomcardelem);
 }
  
}



async function getvideodetails(videoid) {
    try {
    let response = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoid}&key=${apikey}`)
    let result = await response.json();
    return result;
    }
    catch(error) {
      // alert("Something Went Wrong,Pls Refresh.");
      console.log(error);
  }
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
  
  
  
  function formatDate(dateandtime) {
    // PT2H33M23S
    // 2023-06-01T09:07:19Z
  
    // Get the current date and time
  var currentDate = new Date();
  
  // Example published date from YouTube API
  var publishedDate = dateandtime;
  
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


  function videoplayer(id) {
    // <a href="./video.html"></a>
    console.log(id);
    // document.cookie="video_id="+ id +";path=${`/Youtube-Clone-Project/video.html`}";
    localStorage.setItem("video_id",id);
    let anchor = document.createElement("a");
    anchor.href="./video.html";
    anchor.target="_self";
    anchor.click();
  }



  function searchinvideopage(value) {
    localStorage.setItem("searched",value);
    localStorage.setItem("searchinhome","true");
    let anchor = document.createElement("a");
    anchor.href="./index.html";
    anchor.target="_self";
    anchor.click();
  }

  let searchbox = document.getElementById("searchip");

  searchbox.addEventListener("keydown", function(event) {
    //Press Enter To Search
     if (event.keyCode === 13) {
       if(searchbox.value.length>=1){
        searchinvideopage(searchbox.value);
       }
     }
   });
