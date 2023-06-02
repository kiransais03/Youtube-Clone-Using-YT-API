// let cookieString = document.cookie;
// let idcookie=cookieString.split("=")[1];

let apikey=localStorage.getItem("apikey");
let vidId =localStorage.getItem("video_id")


let firstScript = document.getElementsByTagName("script")[0] ;

firstScript.addEventListener("load", onLoadScript)

function onLoadScript() {
  if (YT) {
    new YT.Player("embedplayer", {
      height: "500",
      width: "850",
      videoId:vidId,
      events: {
        onReady: (event) => {
            console.log(event);
            extractVideoDetails(event.target.h.g.videoId);
            fetchStats(event.target.h.g.videoId);
        }
      }
    });
  }
}



async function extractVideoDetails(videoId){ 
    let endpoint = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${apikey}`;

    try {
        let response = await fetch(endpoint);
        let result = await response.json();
        console.log(result, "comments")
        renderComments(result.items);
    }
    catch(error){
        console.log(`Error occured`, error)
    }
    
}

const videostatsContainer = document.getElementsByClassName("video-details")[0];

async function  fetchStats(videoId){
    console.log("Inside fetchStats")
    let endpoint = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&key=${apikey}&id=${videoId}`;
    try {
        const response = await fetch(endpoint);
        const result = await response.json();
        const item = result.items[0] ;
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
            </div>
        </div>
        `
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
    console.log(commentId)
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




