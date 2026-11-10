export const questions=[
    {
        id: 1,
        question:"How much does your girlfriend loves you?",
        emoji: "🥺",
        options:[
            {id:"A", text:"MORE THAN ANYTHING"},
            {id:"B", text:"Not really cares"}
        ],
        correctAnswer:"A"
    },
    {
        id:2,
        question: "How should we fix your mood?",
        emoji: "😔",
        options:[
            {id:"A", text:"HUGS AND KISSES"},
            {id:"B", text:"Don't want to fix it"}
        ],
        correctAnswer:"A"
    },
    {
        id: 3,
        question: "Will you forgive your girlfriend?",
        emoji: "🥰",
        options:[
            {id:"A", text:"OFCOURSE!"},
            {id:"B", text:"Need time to think"}
        ],
        correctAnswer:"A"
    },
    {
        id: 4,
        question: "What do you want right now?",
        emoji: "😘",
        options:[
            {id:"A", text:"A MILLION KISSES"},
            {id:"B", text:"Personal space"}
        ],
        correctAnswer:"A"
    },
    {
        id: 5,
        question: "Do you trust your girlfriend in not repeating her mistakes?",
        emoji: "😍",
        options:[
            {id:"A", text:"YESSS!"},
            {id:"B", text:"Nope"}
        ],
        correctAnswer:"A"
    },
    {
        id: 6,
        question: "Will you pinky promise to love your girlfriend forever?",
        emoji: "🥰",
        options:[
            {id:"A", text:"YES!"},
            {id:"B", text:"Not really"}
        ],
        correctAnswer:"A"
    }
]

export function createGame() {
  return {
    currentQuestionIndex: 0,
    score: 0,
    wrongAttempts: 0,
    isGameOver: false,
    answered: false
  };
}

export function getCurrentQuestion(state) {
  if (state.isGameOver) return null;

  return questions[state.currentQuestionIndex] ?? null;
}

export function chooseAnswer(state, selectedOption) {
  if (state.isGameOver) {
    return { ...state, result: "GAME_OVER" };
  }

  if (state.answered) {
    return { ...state, result: "ALREADY_ANSWERED" };
  }

  const question = getCurrentQuestion(state);

  if (!question) {
    return { ...state, isGameOver: true, result: "GAME_OVER" };
  }

  const validOption = question.options.some(
    option => option.id === selectedOption
  );

  if (!validOption) {
    return { ...state, result: "INVALID_OPTION" };
  }

  if (selectedOption !== question.correctAnswer) {
    return {
      ...state,
      wrongAttempts: state.wrongAttempts + 1,
      result: "WRONG"
    };
  }

  const nextIndex = state.currentQuestionIndex + 1;
  const gameFinished = nextIndex >= questions.length;

  return {
    ...state,
    score: state.score + 10,
    currentQuestionIndex: nextIndex,
    wrongAttempts: 0,
    answered: true,
    isGameOver: gameFinished,
    result: gameFinished ? "WON" : "CORRECT"
  };
}

export function advanceQuestion(state) {
  if (state.isGameOver || !state.answered) {
    return state;
  }

  return {
    ...state,
    answered: false,
    result: null
  };
}

export function getProgress(state) {
  return Math.round(
    (state.currentQuestionIndex / questions.length) * 100
  );
}

export function getMaximumScore() {
  return questions.length * 10;
}