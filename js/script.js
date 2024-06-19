console.log("lets write javascript");
let cuurentsong = new Audio();
let songs;
let currfolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
  currfolder=folder;
  let a = await fetch(`/${folder}/`);
  let respones = await a.text();

  let div = document.createElement("div");
  div.innerHTML = respones;
  let as = div.getElementsByTagName("a");
  songs = [];

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  
  // show all the songs in the playliat
  let songUL = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
    songUL.innerHTML= ""
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li> <img class="invert" src="img/music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", "")}</div>
        <div>jaydip</div>
        
        </div>
        <div class="playnow">
            <span>Play now</span>
        <img class="invert" src="img/play.svg" alt="">
        </div>   
       </li>`;
  }
  //play the first song
  //attach  an event listner to each song
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", element => {
    
      playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  return songs
}
const playmusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track)
  cuurentsong.src = `/${currfolder}/` + track;
  if (!pause) {
    cuurentsong.play();
    play.src = "img/pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};
async function displayalubum(){
  let a = await fetch(`/songs/`);
  
  let respones = await a.text();
  let div = document.createElement("div");
  div.innerHTML = respones;
 
  let anchor = div.getElementsByTagName("a")
  let cardContainer = document.querySelector(".cardConainer")
  
  let array = Array.from(anchor)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    
    
    if(e.href.includes("/songs/")&& !e.href.includes(".htaccess")) {
       let folder = e.href.split("/").slice(-2)[1]
      
      // get the metadata  of the folder
      let a = await fetch(`/songs/${folder}/info.json`)
       let respones = await a.json();
       console.log(respones)
      
       cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
      <div class="play">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 20V4L19 12L5 20Z"
            stroke="#141B34"
            fill="#000"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
         </svg>
      </div>
      <img src="/songs/${folder}/cover3.jpg" alt="">
      <h2>${respones.title}</h2>
      <p>${respones.description}</p>
    </div>`
    
    
  
    }
  }
  //load the playlist whnvwer card ia clicked
  Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click", async item=>{
      songs = await getsongs(`songs/${ item.currentTarget.dataset.folder}`);
      playmusic(songs[0])

      
    })
  })
}
async function main() {
  //get the list of all songs
  await getsongs("songs/ncs/info.json");
  playmusic(songs[0], true);

  //diplay all the alubum on the page
  await displayalubum()

  //song all the song in the playlist
  
  //attach an evnt listner to play ,next and prevoius
  play.addEventListener("click", () => {
    if (cuurentsong.paused) {
      cuurentsong.play();
      play.src = "img/pause.svg";
    } else {
      cuurentsong.pause();
      play.src = "img/play.svg";
    }
  });
  //listn for time update evnt
  cuurentsong.addEventListener("timeupdate", () => {
    console.log(cuurentsong.currentTime, cuurentsong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      cuurentsong.currentTime
    )} / ${secondsToMinutesSeconds(cuurentsong.duration)}`;
    document.querySelector(".circle").style.left =
      (cuurentsong.currentTime / cuurentsong.duration) * 100 + "%";
  });
  //add event listner to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let precent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = precent + "%";

    cuurentsong.currentTime=((cuurentsong.duration) * precent) / 100;
  });
  //add evnt listner for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  //add event lisnter for close
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });
  //add evntlisner to next and previous
  previous.addEventListener("click", () => {
    console.log("previous clicked");
    let index = songs.indexOf(cuurentsong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playmusic(songs[index - 1]);
    }
  });
  next.addEventListener("click", () => {
    console.log("next clicked");
    let index = songs.indexOf(cuurentsong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playmusic(songs[index + 1]);
    }
  });
  //add evntlisner to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      e, e.target,e.target.value
      cuurentsong.volume= parseInt(e.target.value)/100
      if(cuurentsong.volume >0){
        document.querySelector(".volume>img").src= document.querySelector(".volume>img").src.replace("mute.svg","volume.svg")

      }


    });
    //add evenlisner for the mute the track
    document.querySelector(".volume>img").addEventListener("click",e=>{
      console.log("changing",e.target.src)
      if(e.target.src.includes( "img/volume.svg")){
        e.target.src=e.target.src.replace("img/volume.svg", "img/mute.svg")
        cuurentsong.volume = 0;
        document
    .querySelector(".range")
    .getElementsByTagName("input")[0].value=0;
      
      }
      else{
        e.target.src=e.target.src.replace("img/mute.svg","img/volume.svg")
        cuurentsong.volume=.10;
        document
    .querySelector(".range")
    .getElementsByTagName("input")[0].value=10;
      }
    })
    
}

main();
