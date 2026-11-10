
import test from "node:test";
import assert from "node:assert/strict";

import {
  createGame,
  questions,
  getCurrentQuestion,
  advanceQuestion,
  chooseAnswer,
  getProgress,
  getMaximumScore
} from "./game.js";

// TEST 1: Game starts correctly
test("Game starts with zero points", () => {
  const game = createGame();

  assert.equal(game.score, 0);
  assert.equal(game.currentQuestionIndex, 0);
  assert.equal(game.isGameOver, false);
});

// TEST 2: First question is displayed
test("First question loads correctly", () => {
  const game = createGame();

  const question = getCurrentQuestion(game);

  assert.equal(question.id, 1);
});

// TEST 3: Correct answer earns points
test("Correct answer earns 10 points", () => {
  const game = createGame();

  const result = chooseAnswer(game, "A");

  assert.equal(result.score, 10);
  assert.equal(result.result, "CORRECT");
});

// TEST 4: Wrong answer does not advance
test("Wrong answer does not advance the game", () => {
  const game = createGame();

  const result = chooseAnswer(game, "B");

  assert.equal(result.score, 0);
  assert.equal(result.wrongAttempts, 1);
  assert.equal(result.currentQuestionIndex, 0);
});

// TEST 5: Only one correct answer per question
test("Repeated correct answers cannot earn extra points", () => {
  let game = createGame();

  game = chooseAnswer(game, "A");
  const repeated = chooseAnswer(game, "A");

  assert.equal(repeated.score, 10);
  assert.equal(repeated.result, "ALREADY_ANSWERED");
});

// TEST 6: Invalid option is rejected
test("Invalid options cannot advance the game", () => {
  const game = createGame();

  const result = chooseAnswer(game, "Z");

  assert.equal(result.result, "INVALID_OPTION");
  assert.equal(result.score, 0);
});

// TEST 7: Progress is calculated correctly
test("Progress updates after answering", () => {
  let game = createGame();

  game = chooseAnswer(game, "A");

  assert.equal(
    getProgress(game),
    Math.round((1/questions.length)*100)
  );
});

// TEST 8: Game ends after all questions
test("Game ends after all five correct answers", () => {
  let game = createGame();

  for (const question of questions) {
    game = chooseAnswer(game, question.correctAnswer);

    if(!game.isGameOver){
        game=advanceQuestion(game);
    }
  }

  assert.equal(game.isGameOver, true);
  assert.equal(game.result, "WON");
  assert.equal(game.score, 60);
});

// TEST 9: Maximum score is correct
test("Maximum score is 60", () => {
  assert.equal(getMaximumScore(), 60);
});

// TEST 10: No answers accepted after game ends
test("Game cannot be played after completion", () => {
  let game = createGame();

  for (const question of questions) {
    game = chooseAnswer(game, question.correctAnswer);

    if(!game.isGameOver){
        game=advanceQuestion(game);
    }
  }

  const result = chooseAnswer(game, "A");

  assert.equal(result.result, "GAME_OVER");
  assert.equal(result.score, 60);
});
