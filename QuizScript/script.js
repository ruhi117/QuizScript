// ==== Hamburger Menu Toggle (used in index.html and instructions.html) ====
function toggleMenu() {
  const menu = document.getElementById("navLinks");
  menu.classList.toggle("active");
}




// ==== Quiz Logic (used in quiz.html) ====
let currentQuestion = 0;
let selectedAnswers = [];

// Load question on quiz.html
function loadQuestion() {
  if (typeof questions === "undefined") return;

  if (selectedAnswers.length === 0)
    selectedAnswers = new Array(questions.length).fill(null);

  const q = questions[currentQuestion];
  document.getElementById("question-text").innerText = `${currentQuestion + 1}. ${q.question}`;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  optionsDiv.style.opacity = 0;
setTimeout(() => {
  optionsDiv.style.opacity = 1;
}, 100);

  q.options.forEach((option, index) => {
    const btn = document.createElement("div");
    btn.classList.add("option");
    btn.innerText = option;
    btn.onclick = () => selectAnswer(index);
    if (selectedAnswers[currentQuestion] === index) {
      btn.style.backgroundColor = "#ffd369";
    }
    optionsDiv.appendChild(btn);
  });

  
  const buttonContainer = document.querySelector(".quiz-buttons");
buttonContainer.innerHTML = "";

// Previous button
if (currentQuestion > 0) {
  const prevBtn = document.createElement("button");
  prevBtn.innerText = "Previous";
  prevBtn.onclick = prevQuestion;
  buttonContainer.appendChild(prevBtn);
}

// Clear button
const clearBtn = document.createElement("button");
clearBtn.innerText = "Clear";
clearBtn.onclick = clearSelection;
buttonContainer.appendChild(clearBtn);

// Next or Submit
const nextOrSubmitBtn = document.createElement("button");
if (currentQuestion === questions.length - 1) {
  nextOrSubmitBtn.innerText = "Submit";
  nextOrSubmitBtn.onclick = submitQuiz;
} else {
  nextOrSubmitBtn.innerText = "Next";
  nextOrSubmitBtn.onclick = nextQuestion;
}
buttonContainer.appendChild(nextOrSubmitBtn);

}


function selectAnswer(index) {
  const q = questions[currentQuestion];
  const optionsDiv = document.getElementById("options");

  // Prevent re-clicking
  if (selectedAnswers[currentQuestion] !== null) return;

  selectedAnswers[currentQuestion] = index;

  // Apply color feedback
  const allOptions = optionsDiv.querySelectorAll(".option");
  allOptions.forEach((btn, i) => {
    btn.classList.add("disabled");
    if (i === q.answer) {
      btn.classList.add("correct");
    }
    if (i === index && index !== q.answer) {
      btn.classList.add("incorrect");
    }
  });
}



function submitQuiz() {
  localStorage.setItem("quizAnswers", JSON.stringify(selectedAnswers));
  window.location.href = "result.html";

   localStorage.setItem("quizAnswers", JSON.stringify(selectedAnswers));
    window.location.href = "result.html";
}


function nextQuestion() {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    loadQuestion();
  } 
}


function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
  }
}

function clearSelection() {
  selectedAnswers[currentQuestion] = null;
  loadQuestion();
}

questions.forEach((q, index) => {
  const userAns = selectedAnswers[index];
  const isCorrect = userAns === q.answer;

  const qDiv = document.createElement("div");
  qDiv.classList.add("question-card", "slide-right");
  qDiv.style.animationDelay = `${index * 0.2}s`;
  qDiv.style.animationFillMode = "forwards";

  if (userAns !== null) {
    qDiv.classList.add(isCorrect ? "correct-card" : "incorrect-card");
  }

  qDiv.innerHTML = `
    <p><strong>Q${index + 1}:</strong> ${q.question}</p>
    <p><strong>Your Answer:</strong> ${userAns !== null ? q.options[userAns] : "Not Answered"}</p>
    <p><strong>Correct Answer:</strong> ${q.options[q.answer]}</p>
  `;
  answersDiv.appendChild(qDiv);
});





// ==== Result Page Logic (used in result.html) ====
function loadResults() {
  
  if (typeof questions === "undefined") return;

  const selectedAnswers = JSON.parse(localStorage.getItem("quizAnswers")) || [];
  let correct = 0, incorrect = 0, attempted = 0;
  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "<h2>Correct Answers:</h2>";

  questions.forEach((q, index) => {
    const userAns = selectedAnswers[index];
    const isCorrect = userAns === q.answer;

    if (userAns !== null) {
      attempted++;
      isCorrect ? correct++ : incorrect++;
    }

    const qDiv = document.createElement("div");
    qDiv.classList.add("question-card");
    qDiv.innerHTML = `
      <p><strong>Q${index + 1}:</strong> ${q.question}</p>
      <p><strong>Your Answer:</strong> ${userAns !== null ? q.options[userAns] : "Not Answered"}</p>
      <p><strong>Correct Answer:</strong> ${q.options[q.answer]}</p>
    `;
    answersDiv.appendChild(qDiv);
  });

  const unattempted = questions.length - attempted;
  const score = correct * 5 - incorrect;

  if (score >= 10) {
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 }
  });
}


  document.getElementById("attempted").innerText = attempted;
  document.getElementById("unattempted").innerText = unattempted;
  document.getElementById("correct").innerText = correct;
  document.getElementById("incorrect").innerText = incorrect;
  document.getElementById("score").innerText = score;

   
 
 //  Message
  let resultMessage = "";
if (score >= 45) resultMessage = "🧠 Genius Level!";
else if (score >= 30) resultMessage = "👏 Great Job!";
else if (score >= 15) resultMessage = "🙂 Keep Practicing!";
else resultMessage = "💡 Don't give up — try again!";

document.getElementById("result-message").innerText = resultMessage;

}
