
import {
  questions,
  createGame,
  chooseAnswer,
  advanceQuestion,
  getCurrentQuestion,
  getProgress,
  getMaximumScore
} from "./game.js";

// Connect JavaScript to the HTML elements
const welcomeScreen = document.getElementById("welcome-screen");
const quizScreen = document.getElementById("quiz-screen");
const finalScreen = document.getElementById("final-screen");

const startButton = document.getElementById("start-button");

const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");

const questionEmoji = document.getElementById("question-emoji");
const questionText = document.getElementById("question-text");

const answerButtons = document.getElementById("answer-buttons");
const feedbackMessage = document.getElementById("feedback-message");
const scoreText = document.getElementById("score-text");

const finalScore = document.getElementById("final-score");

// Create the initial game state
let game = createGame();

// Start the mission
startButton.addEventListener("click", () => {
  game = createGame();

  welcomeScreen.classList.add("hidden");
  finalScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  showQuestion();
});

// Display the current question
function showQuestion() {
  const question = getCurrentQuestion(game);

  if (!question) {
    showFinalScreen();
    return;
  }

  questionEmoji.textContent = question.emoji;
  questionText.textContent = question.question;

  progressText.textContent =
    `Question ${game.currentQuestionIndex + 1} of ${questions.length}`;

  progressFill.style.width = `${getProgress(game)}%`;

  scoreText.textContent = `Score: ${game.score}`;

  feedbackMessage.textContent = "";

  answerButtons.innerHTML = "";

  // Create a button for every answer option
  question.options.forEach(option => {
    const button = document.createElement("button");

    button.textContent = option.text;

    button.addEventListener("click", () => {
      handleAnswer(option.id);
    });

    answerButtons.appendChild(button);
  });
}

// Handle the player's answer
function handleAnswer(selectedOption) {
  const previousScore = game.score;

  game = chooseAnswer(game, selectedOption);

  if (game.result === "WRONG") {
    feedbackMessage.textContent =
      "Oops! Try again, silly! 🥺💗";

    scoreText.textContent = `Score: ${game.score}`;
    return;
  }

  if (game.result === "CORRECT") {
    feedbackMessage.textContent =
      "YAY! Correct answer! +10 points 💗";
    questionText.classList.remove("reward-pop");
    void questionText.offsetWidth;
    questionText.classList.add("reward-pop");
    lockAnswerButtons();

    scoreText.textContent = `Score: ${game.score}`;
    progressFill.style.width = `${getProgress(game)}%`;

    // Wait a moment before showing the next question
    setTimeout(() => {
      game = advanceQuestion(game);
      showQuestion();
    }, 1200);

    return;
  }

  if (game.result === "WON") {
    feedbackMessage.textContent =
      "YOU DID IT! LOVE QUEST COMPLETE! 🎉";

    lockAnswerButtons();

    scoreText.textContent = `Score: ${game.score}`;

    setTimeout(() => {
      showFinalScreen();
    }, 1500);
  }
}

// Prevent multiple clicks while moving to the next question
function lockAnswerButtons() {
  const buttons = answerButtons.querySelectorAll("button");

  buttons.forEach(button => {
    button.disabled = true;
  });
}

// Show the victory screen
function showFinalScreen() {
  quizScreen.classList.add("hidden");
  finalScreen.classList.remove("hidden");

  finalScore.textContent =
    `Your score: ${game.score} / ${getMaximumScore()}`;

  progressFill.style.width = "100%";
}
