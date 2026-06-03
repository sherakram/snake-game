let board = document.querySelector('.board');
let modal = document.querySelector('.modals');
let modalStartGame = document.querySelector('.modals .startGame');
let modalGameOver = document.querySelector('.modals .gameOver');
let scoreElement = document.querySelector('.score-value');
let highScoreElement = document.querySelector('.high-score-value');
let timeElement = document.querySelector('.time-value');
let gameOverScoreElement = document.querySelector('.game-over-score');

let blockWidth = 20;
let blockHeight = 20;

let cols = Math.floor(board.clientWidth / blockWidth);
let rows = Math.floor(board.clientHeight / blockHeight);

let score = 0;
let highScore = 0;
let time = '00-00';

let seconds = 0;
let timerInterval = null;

let highScoreFromStorage = localStorage.getItem('highScore');

if (highScoreFromStorage) {
    highScore = parseInt(highScoreFromStorage);
    highScoreElement.textContent = highScore;
}

let food = {x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)};

let blocks = [];
let snake = [{x: 3, y: 10}];
let intervalID = null;
let direction = 'left';


for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        let block = document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }
}

function drawSnake() {

    blocks[`${food.x}-${food.y}`].classList.add('foodColor');
    
    let head = null;

    if (direction === 'left') {
        head = {x: snake[0].x, y: snake[0].y-1};
    } else if (direction === 'right') {
        head = {x: snake[0].x, y: snake[0].y+1};
    } else if (direction === 'up') {
        head = {x: snake[0].x-1, y: snake[0].y};
    } else if (direction === 'down') {
        head = {x: snake[0].x+1, y: snake[0].y};
    }

    // Check for collision with walls
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {

        modal.style.display = 'flex';

        modalStartGame.style.display = 'none';

        modalGameOver.style.display = 'flex';

        gameOverScoreElement.textContent = score;

        blocks[`${food.x}-${food.y}`].classList.remove('foodColor');

        snake.forEach(part => {
            blocks[`${part.x}-${part.y}`].classList.remove('snakeColor');
        })

        clearInterval(intervalID);
        clearInterval(timerInterval);

        return;
    }
    
    snake.unshift(head);

    let tail = snake.pop();

    blocks[`${tail.x}-${tail.y}`].classList.remove('snakeColor');

    snake.forEach(part => {
        blocks[`${part.x}-${part.y}`].classList.add('snakeColor');
    })

    // Check for collision with food
    if (head.x === food.x && head.y === food.y) {
        snake.push(head);

        blocks[`${food.x}-${food.y}`].classList.remove('foodColor');

        food = {x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)};

        score += 10;
        scoreElement.textContent = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            highScoreElement.textContent = highScore;
        }
    }

}


// Start game when start button is clicked
document.querySelector('#startButton').addEventListener('click', () => {
    
    startTimer();
    
    intervalID = setInterval (() => {
        drawSnake();
    }, 400)

    modal.style.display = 'none';
})

// Start game when restart button is clicked
document.querySelector('#restartButton').addEventListener('click', restartGame);


// Listen for keydown events to change the direction of the snake
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && direction !== 'right') {
        direction = 'left';
    } else if (event.key === 'ArrowRight' && direction !== 'left') {
        direction = 'right';
    } else if (event.key === 'ArrowUp' && direction !== 'down') {
        direction = 'up';
    } else if (event.key === 'ArrowDown' && direction !== 'up') {
        direction = 'down';
    }
})

function restartGame() {

    clearInterval(intervalID);
    clearInterval(timerInterval);
    
    score = 0;
    scoreElement.innerText = score;
    
    seconds = 0;
    timeElement.innerText = '00-00';

    startTimer();

    snake.forEach(part => {
        blocks[`${part.x}-${part.y}`].classList.remove('snakeColor');
    })

    blocks[`${food.x}-${food.y}`].classList.remove('foodColor');

    snake = [{x: 3, y: 10}];
    direction = 'down';

    food = {x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)};

    modal.style.display = 'none';

    intervalID = setInterval (() => {
        drawSnake();
    }, 400)
}

// start timer when the game starts
function startTimer() {

    timerInterval = setInterval(() => {

        seconds++;

        let mins = Math.floor(seconds / 60);
        let secs = seconds % 60;

        // format: 00-00
        timeElement.textContent =
            String(mins).padStart(2, '0') + '-' +
            String(secs).padStart(2, '0');

    }, 1000);
}

