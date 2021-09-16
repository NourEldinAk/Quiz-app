let bullets = document.querySelector(".bullets .spans");
let currentIndex = 0;
let questionsCount = document.querySelector(".quiz-info .questions-count span");
let submitButton = document.querySelector(".submit-button");
let theRightAnswer;
let rightAnswers = 0;
let countdownInterval;
let countdownElement = document.querySelector(".countdown");
fetch("questions.json")
  .then((res) => res.json())
  .then((res) => {
    countdown(4, res.length);
    createBullets(res.length);
    addQuestions(res[currentIndex], res.length);

    submitButton.onclick = () => {
      theRightAnswer = res[currentIndex].right_answer;
      currentIndex++;

      checkAnswer(theRightAnswer, res.length);
      clearInterval(countdownInterval);
      countdown(4, res.length);

      document.querySelector(".answers-area").innerHTML = "";
      document.querySelector(".quiz-area").innerHTML = "";
      addQuestions(res[currentIndex], res.length);
      handleBullets();
    };
  });
function createBullets(num) {
  questionsCount.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let span = document.createElement("span");
    if (i === 0) {
      span.className = "on";
    }
    bullets.appendChild(span);
  }
}
function addQuestions(obj, qCount) {
  if (currentIndex < qCount) {
    let h2 = document.createElement("h2");
    let headerText = document.createTextNode(obj.title);
    h2.appendChild(headerText);
    document.querySelector(".quiz-area").appendChild(h2);
    let mainDiv = document.querySelector(".answers-area");
    for (let i = 1; i <= 4; i++) {
      let answerDiv = document.createElement("div");
      answerDiv.className = "answer";
      let input = document.createElement("input");
      input.type = "radio";
      input.name = "answers";
      input.id = `answer_${i}`;
      input.dataset.answer = obj[`answer_${i}`];
      if (i === 1) {
        input.checked = true;
      }
      let label = document.createElement("label");
      let labelTextNode = document.createTextNode(input.dataset.answer);
      label.appendChild(labelTextNode);
      label.setAttribute("for", `answer_${i}`);
      answerDiv.appendChild(input);
      answerDiv.appendChild(label);
      mainDiv.appendChild(answerDiv);
    }
  } else {
    submitButton.remove();
    document.querySelector(".quiz-area").remove();
    document.querySelector(".answers-area").remove();
    document.querySelector(".bullets").remove();
    let theResult = document.querySelector(".results");
    if (rightAnswers > qCount / 2 && rightAnswers < qCount) {
      theResult.innerHTML = `<span class="good">Good</span> you answered ${rightAnswers} questions`;
    } else if (rightAnswers === qCount) {
      theResult.innerHTML = `<span class="perfect">perfect</span> you answered ${rightAnswers} questions`;
    } else {
      theResult.innerHTML = `<span class="bad">bad</span> you answered ${rightAnswers} questions`;
    }
  }
}
function checkAnswer(rAnswer, qCount) {
  let answer = document.getElementsByName("answers");
  let theChoosenAnswer;
  for (let i = 0; i < answer.length; i++) {
    if (answer[i].checked) {
      theChoosenAnswer = answer[i].dataset.answer;
    }
  }

  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
  }
}
function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}
function countdown(duration, qCount) {
  if (currentIndex < qCount) {
    let minutes, seconds;
    countdownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countdownElement.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
