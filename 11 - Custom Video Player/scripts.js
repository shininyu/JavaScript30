/* get our elements */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');

const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');

const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const screen = player.querySelector('.screen');
const fullscreen = player.querySelector('.fullscreen');

progressBar.style.flexBasis = '0%';

/* build out functions */
// play button running
function togglePlay(){
  const method = video.paused ? 'play' : 'pause';
  video[method]();
}
function updataButton(){
  // paused is the propery of video
  const icon = this.paused ? '►' : '❚ ❚';
  toggle.textContent = icon;
}

//sikup button running
function skip(){
  //console.log(this.dataset.skip);
  video.currentTime += parseFloat(this.dataset.skip);
}

//range update
function handleRangeUpdate(){
  video[this.name] = this.value;
  // console.log(this.name);
  // console.log(this.value);
}

// progress bar update depends on the current play time
function handleProgress(){
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`
}

// click on the progress bar then move the current play time to the spot where you clicked
function scrub(e){
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
  //console.log(e);
}

// width 100% 키우기
function screenWidth(){
  if(this.classList.contains('shown') && this === fullscreen){
   fullscreen.classList.remove('shown');
   screen.classList.add('shown');
   player.style.width = '100%';
  }else{
    fullscreen.classList.add('shown');
    screen.classList.remove('shown');
    player.style.width = '750px';
  }
}

/* hook up the event listeners */
// play & pause
video.addEventListener('click', togglePlay);
video.addEventListener('play', updataButton);
video.addEventListener('pause', updataButton);
toggle.addEventListener('click', togglePlay);

// skip
skipButtons.forEach(button => button.addEventListener('click', skip))

//range update
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate))
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate))

// progress bar works
video.addEventListener('timeupdate', handleProgress);

let mousedown = false;
// scrub on the progress bar
progress.addEventListener('click', scrub);
// if mousedown is true, runs scrub, if mousedown is false, doesn't run scrub
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', ()=> mousedown = true);
progress.addEventListener('mouseup', ()=> mousedown = false);

//screen width
screen.addEventListener('click', screenWidth);
fullscreen.addEventListener('click', screenWidth);

