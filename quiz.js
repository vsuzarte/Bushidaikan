// Quiz state variables
let currentQuestionIndex = 0;
let score = 0;
let questions = [];

// DOM elements
const questionContainer = document.getElementById('question-container');
const optionsContainer = document.getElementById('options-container');
const resultContainer = document.getElementById('result-container');
const restartBtn = document.getElementById('restart-btn');
const backToMenuBtn = document.getElementById('back-to-menu-btn');

// Event listener for starting the game
document.getElementById('start-game-btn').addEventListener('click', startGame);

// Functions to start and restart the game
function startGame() {
    hideElement('menu-container');
    showElement('quiz-container');
    startQuiz();
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    questions = getRandomQuestions(3);
    showQuestion();
}

function getRandomQuestions(numQuestions) {
  const allPosturas = [...posturas];

  const selectedPosturas = [];

  for (let i = 0; i < numQuestions; i++) {
      const remainingPosturas = allPosturas.filter(postura => !selectedPosturas.includes(postura));

      const randomIndex = Math.floor(Math.random() * remainingPosturas.length);
      const currentQuestion = remainingPosturas[randomIndex];

      const otherPosturas = remainingPosturas.filter(postura => postura !== currentQuestion);

      // Pegar a postura correta
      const correctOption = {
          nome: currentQuestion.nome,
          imagem: currentQuestion.imagem,
          isCorrect: true,
      };

      // Pegar 3 posturas incorretas aleatórias
      const incorrects = otherPosturas.sort(() => Math.random() - 0.5).slice(0, 3);

      const incorrectOptions = [];

        incorrects.forEach(incorrectPostura => {
            const incorrectOption = {
                nome: incorrectPostura.nome,
                imagem: incorrectPostura.imagem,
                isCorrect: false,
            };
            incorrectOptions.push(incorrectOption);
        });
    
      // Incluir a postura correta em uma posição aleatória
      const fullOptions = [correctOption, ...incorrectOptions];
      const shuffledOptions = fullOptions.sort(() => Math.random() - 0.5);

      selectedPosturas.push(shuffledOptions);
  }

  return selectedPosturas;
}

function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    const correctOption = currentQuestion.find(option => option.isCorrect === true);

    questionContainer.innerHTML = `<img src="${correctOption.imagem}" alt="${correctOption.nome}">`;
    optionsContainer.innerHTML = '';

    const shuffledOptions = currentQuestion.sort(() => Math.random() - 0.5);

    shuffledOptions.forEach((option, index) => {
        const button = createOptionButton(option.nome);
        button.addEventListener('click', () => checkAnswer(option.isCorrect));
        optionsContainer.appendChild(button);
    });
}

function createOptionButton(optionName) {
    const button = document.createElement('button');
    button.innerHTML = optionName;
    button.classList.add('btn-question', 'option-btn');
    return button;
}

function checkAnswer(isCorrect) {
    if (isCorrect) {
        score++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    showElement('result-container');
    resultContainer.innerHTML = `Quiz concluído! Sua pontuação: ${score}/${questions.length}`;
    showElement('restart-btn');
    showElement('back-to-menu-btn');

    restartBtn.addEventListener('click', restartQuiz);
    backToMenuBtn.addEventListener('click', goBackToMenu);
}

function goBackToMenu() {
    hideElement('back-to-menu-btn');
    goToMainMenu();
}

function restartQuiz() {
    hideElement('back-to-menu-btn');
    goToMainMenu();
    startGame();
}

function goToMainMenu() {
    showElement('menu-container');
    hideElement('quiz-container');
    hideElement('result-container');
    hideElement('restart-btn');
}

function showElement(elementId) {
    document.getElementById(elementId).style.display = 'block';
}

function hideElement(elementId) {
    document.getElementById(elementId).style.display = 'none';
}

// Initialize the quiz when the page loads
window.onload = startQuiz;
