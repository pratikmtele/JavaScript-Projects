const highScore = document.getElementById("high-score");
const subjects = document.querySelectorAll(".card");
const subjectInputField = document.getElementById("subjectInput");
const startQuizButton = document.querySelector(".start-quiz");
const quizSelectorContainer = document.getElementById("subject-selector");

let subject = null;
let intervalId;

function changeTime() {
  clearInterval(intervalId);
  let timeLeft = 60;
  intervalId = setInterval(() => {
    timeLeft--;
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    document.querySelector(".timer").innerHTML = minutes + ":" + seconds;

    if (timeLeft <= 0) {
      clearInterval(intervalId);
      console.log("Time's up!");
    }
  }, 1000);
}

changeTime();

function startQuiz() {
  console.log("Quiz Started");
  quizSelectorContainer.style.display = "none";
  changeTime();
}

subjects.forEach((subjectCard) => {
  subjectCard.addEventListener("click", function () {
    subject = subjectCard.getAttribute("data-subject");
    startQuiz();
  });
});

startQuizButton.addEventListener("click", () => {
  subject = subjectInputField.value;
  if (subject) startQuiz();
});
