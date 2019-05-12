let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
// data-time 속성이 있는 모든 것
const buttons = document.querySelectorAll('[data-time]');


function timer(seconds){
  //clear any exisiting timers(이벤트 중복 방식)
  clearInterval(countdown);

  const now = Date.now();
  const then = now + seconds * 1000;
  // console.log({now, then});
  
  //함수가 실행하자 마자 1초 후 interval 함수가 실행하기 전 한 번
  // 비는 숫자를 표기해 준다
  displayTimeLeft(seconds);
  displayEndTime(then);

  countdown = setInterval(() => {
    //math round를 하지 않으면 소수점 아래의 숫자가 표기됨
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    // check if we should stop it!
    // 0보다 적을 경우에는 inteverl을 해제 시켜 줌
    if(secondsLeft < 0){
      clearInterval(countdown);
      return;
    }
    //display it
    displayTimeLeft(secondsLeft);
  }, 1000);
}

// 타이머 시간을 뷰에 보여 줌
function displayTimeLeft(seconds){
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
  //홈페이지 title 속성의 값을 타이머로 설정해 줌 페이지 탭에서 확인 가능
  document.title = display;
  timerDisplay.textContent = display;
  //console.log({minutes, remainderSeconds});
}

// 타이머가 끝나는 시간을 알려줌
function displayEndTime(timestamp){
  const end = new Date(timestamp);
  const hour = end.getHours();
  const minutes = end.getMinutes();
  
  endTime.textContent = `Be Back At ${hour > 12 ? hour - 12 : hour}:${minutes < 10 ? '0' : ''}${minutes}`;
}

function startTimer(){
  //console.log(this.dataset.time);
  
  //속성의 값으로 들어가 있던 스트링 타입의 숫자를 숫자 타입으로 변환시켜 줌
  const seconds = parseInt(this.dataset.time);

  timer(seconds);
}


buttons.forEach(button => button.addEventListener('click', startTimer));

document.customForm.addEventListener('submit',function(e){
  // 서밋 이벤트 prevent
  e.preventDefault();
  const mins = this.minutes.value;
  timer(mins * 60);
  // 인풋박스 클리어
  this.reset();
});
