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
        const button = createOptionButton(option.nome, option.isCorrect);
        button.addEventListener('click', () => selectAnswer(button));
        optionsContainer.appendChild(button);
    });

    // Adicione esta linha para criar um botão de confirmação
    const confirmButton = createConfirmButton();
    confirmButton.addEventListener('click', () => confirmAnswer());
    optionsContainer.appendChild(confirmButton);
}

function createOptionButton(optionName, isCorrect) {
    const button = document.createElement('button');
    button.innerHTML = optionName;
    button.classList.add('btn-question', 'option-btn');
    button.dataset.isCorrect = isCorrect;
    button.dataset.isSelected = 'false';  // Adicione esta linha para controlar se o botão foi selecionado
    return button;
}

function createConfirmButton() {
    const button = document.createElement('button');
    button.innerHTML = 'Confirmar';
    button.classList.add('btn-confirm', 'btn-confirmar');
    return button;
}

function selectAnswer(clickedButton) {
    // Remova a classe 'btn-selecionado' de todos os botões
    const allButtons = document.querySelectorAll('.option-btn');
    allButtons.forEach(button => {
        button.classList.remove('btn-selecionado');
        button.dataset.isSelected = 'false';  // Redefina o status de seleção para falso
    });

    // Adicione a classe 'btn-selecionado' apenas ao botão clicado
    clickedButton.classList.add('btn-selecionado');
    clickedButton.dataset.isSelected = 'true';  // Marque o botão como selecionado
}

function confirmAnswer() {
    // Encontrar todos os botões de opção
    const allButtons = document.querySelectorAll('.option-btn');

    // Desabilitar cliques nos botões após a resposta ser confirmada
    allButtons.forEach(button => {
        button.removeEventListener('click', () => selectAnswer(button));
        button.disabled = true;
    });

    // Encontrar o botão selecionado
    const selectedButton = document.querySelector('.btn-selecionado');

    if (selectedButton) {
        // Verificar se a opção selecionada é a resposta correta
        const isCorrect = selectedButton.dataset.isCorrect === 'true';

        // Adicionar classes de estilo com base na resposta
        if (isCorrect) {
            console.log('Resposta correta!');
            selectedButton.classList.add('resposta-correta');
            showSuccessMessage();
            showContinueButton(true);
        } else {
            console.log('Resposta incorreta!');
            selectedButton.classList.add('resposta-incorreta');

            // Encontrar o botão correto e destacá-lo em verde
            const correctButton = Array.from(allButtons).find(button => button.dataset.isCorrect === 'true');
            if (correctButton) {
                correctButton.classList.add('resposta-correta');
            }

            showErrorMessage();
            showContinueButton(false);
        }
    } else {
        allButtons.forEach(button => {
            button.removeEventListener('click', () => selectAnswer(button));
            button.disabled = false;
        });
    }
}

function showErrorMessage() {
    const messageContainer = document.createElement('div');
    
    // Encontre a opção correta
    const correctButton = Array.from(document.querySelectorAll('.option-btn')).find(button => button.dataset.isCorrect === 'true');
    const correctOptionName = correctButton.innerHTML;

    messageContainer.innerHTML = `
        <img src="./src/images/errou.png" alt="Erro">
        <p>Ops! Você errou. A resposta correta é: <br> <span class="span-option">${correctOptionName}.</span><br> Tente novamente.</p>
    `;
    
    messageContainer.classList.add('message-container', 'error-message');
    optionsContainer.appendChild(messageContainer);
}

function showSuccessMessage() {
    const messageContainer = document.createElement('div');
    
    // Encontre a opção correta
    const correctButton = Array.from(document.querySelectorAll('.option-btn')).find(button => button.dataset.isCorrect === 'true');
    const correctOptionName = correctButton.innerHTML;

    messageContainer.innerHTML = `
        <img src="./src/images/acertou.png" alt="Sucesso">
        <p>Parabéns! Você acertou a opção: <br> <span class="span-option">${correctOptionName}</span></p>
    `;
    
    messageContainer.classList.add('message-container', 'success-message');
    optionsContainer.appendChild(messageContainer);
}

function showContinueButton(acertou) {
    // Remover o botão de confirmação
    const confirmButton = document.querySelector('.btn-confirm');
    confirmButton.remove();

    if(acertou)
        score++;

    // Adicionar um botão de continuar
    const continueButton = document.createElement('button');
    continueButton.innerHTML = 'Continuar';
    continueButton.classList.add('btn-continue');

    continueButton.addEventListener('click', () => {
        
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            endQuiz();
        }
            showQuestion();
        }
    );
    
    optionsContainer.appendChild(continueButton);
}

function endQuiz() {
    showElement('result-container');

    // Melhorar a frase
    const scoreText = score === questions.length ? 'Parabéns! Você acertou todas as perguntas!' : `Sua pontuação: ${score}/${questions.length}. Continue praticando!`;
    resultContainer.innerHTML = `<p>${scoreText}</p>`;

    // Adicionar uma imagem
    const image = document.createElement('img');
    image.src = './src/images/final.png';  // Substitua pelo caminho real da sua imagem
    image.alt = 'Imagem do resultado';
    image.style.width = '100%';  // Ajuste o tamanho conforme necessário
    resultContainer.appendChild(image);

    showElement('restart-btn');
    showElement('back-to-menu-btn');
    hideElement('options-container');
    hideElement('question-container');

    restartBtn.addEventListener('click', restartQuiz);
    backToMenuBtn.addEventListener('click', goBackToMenu);
}

function goBackToMenu() {
    hideElement('back-to-menu-btn');
    goToMainMenu();
}

function restartQuiz() {
    showElement('options-container');
    showElement('question-container');
    hideElement('back-to-menu-btn');
    goToMainMenu();
    startGame();
}

function goToMainMenu() {
    showElement('options-container');
    showElement('question-container');
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
