const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');


//비디오 캠을 가져와서 로컬호스트에서 띄워지도록 해줌
function getVideo(){
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then(localMediaStream => {
    console.log(localMediaStream);
    //video.src = window.URL.createObjectURL(localMediaStream);
    // 크롬 및 파이어폭스와 같은 몇몇 브라우저에서 더이상 유효하지 않음
    video.srcObject = localMediaStream;
    video.play();
  })
  .catch(err => {
    console.error('what the heck', err);
  });
  
}

// 커다란 비디오 스크린을 띄워 줌
function paintToCanvas(){
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;
  

  return setInterval(()=>{
    ctx.drawImage(video, 0, 0, width, height);
    // take the pixels out(RGB)
    let pixels = ctx.getImageData(0, 0, width, height);
    
    // mess with them
    //pixels = redEffect(pixels);
    //pixels = rgbSplit(pixels);
    // 10 more frame
    //ctx.globalAlpha = 0.1;

    pixels = greenScreen(pixels);
    //put them back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto(){
  snap.currentTime = 0;
  // 촬영 사운드
  snap.play();

  //take the data from the canvas
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'person');
  link.innerHTML = `<img src="${data}" alt="A Person" />`
  strip.insertBefore(link, strip.firstChild);
}


//비디오 색상 보정
function redEffect(pixels){
  for(let i = 0; i < pixels.data.length; i+=4){
    pixels.data[i + 0] = pixels.data[i + 0] + 100; //RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; //GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //BLUE
  }
  return pixels;
}

// 색상별로 다른 방향으로 뒤바뀌는 효과
function rgbSplit(pixels){
  for(let i = 0; i < pixels.data.length; i+=4){
    //숫자를 조정해서 색상별로 효과 줄 수 있음
    pixels.data[i - 150] = pixels.data[i + 0] + 100; //RED
    pixels.data[i + 500] = pixels.data[i + 1] - 50; //GREEN 500
    pixels.data[i - 550] = pixels.data[i + 2] * 0.5; //BLUE 550
  }
  return pixels;
}

function greenScreen(pixels){
  //hold minimum ~ maximum green
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

//onactive, onaddtrack, oninactive, onremovetract
//getVideo();


video.addEventListener('canplay', paintToCanvas);