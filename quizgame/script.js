const highScore = document.getElementById("high-score");
const subjects = document.querySelectorAll(".card");
const subjectInputField = document.getElementById("subjectInput");
const startQuizButton = document.querySelector(".start-quiz");
const quizSelectorContainer = document.getElementById("subject-selector");
const questionCard = document.querySelector(".question-card");
const loadingScreen = document.getElementById("loading-screen");
const loadingText = document.getElementById("loading-text");

let subject = null;
let intervalId;
let questionIndex = 0;
let quiz;

function showLoadingScreen() {
  loadingScreen.style.display = "flex";
  loadingText.textContent = "Syncing Questions";
}

function hideLoadingScreen() {
  loadingScreen.style.display = "none";
}

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

function extractAndCleanJSON(text) {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1) {
    throw new Error("No JSON array found");
  }
  let jsonText = text.slice(start, end + 1);
  console.log(jsonText);
  try {
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("JSON Parse Error:", error.message);
    console.error("Cleaned JSON:", jsonText.substring(0, 500));
    throw error;
  }
}

async function fetchQuestions() {
  const prompt = `
            Generate 10 multiple choice question.

            Rules:
            - Topic: ${subject}
            - Difficulty: medium
            - 4 options
            - 1 correct answer
            - Output strict JSON only 

            Format:
            {
                "question": "",
                "options": ["", "", "", ""],
                "correctAnswerIndex": 0
            }
        `;
  try {
    showLoadingScreen();
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2:latest",
        prompt: prompt,
        stream: false,
      }),
    });

    const data = await res.json();
    const quiz = extractAndCleanJSON(data.response);
    hideLoadingScreen();
    return quiz;
  } catch (error) {
    hideLoadingScreen();
    console.log(error);
  }
}

function updateQuestion() {
  const currentQuestion = quiz[questionIndex];

  // Update question text
  questionCard.querySelector(".question").innerHTML = currentQuestion.question;

  // Update options
  const optionsDiv = questionCard.querySelector(".options");
  optionsDiv.innerHTML = "";
  currentQuestion.options.forEach((option) => {
    optionsDiv.innerHTML += `
      <label class="option">
          <input type="radio" name="answer" />
          <span class="custom-radio"></span>
          ${option}
      </label>
    `;
  });

  // Reset radio selection
  questionCard.querySelectorAll("input[type='radio']").forEach((radio) => {
    radio.checked = false;
  });
}

async function startQuiz() {
  console.log("Quiz Started");
  quizSelectorContainer.style.display = "none";
  quiz = await fetchQuestions();
  console.log(quiz);
  updateQuestion();
  changeTime();
}

startQuiz();

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
