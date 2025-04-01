const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const gameOverText = document.getElementById("gameOver");
const restartButton = document.getElementById("restartButton");
const musicButton = document.getElementById("musicButton");
const gameMusic = document.getElementById("gameMusic");

const gridSize = 20;
let snake = [{ x: 200, y: 200 }];
let food = { x: 0, y: 0 };
let obstacles = [];
let direction = { x: 0, y: 0 };
let score = 0;
let gameOver = false;
let level = 1;
let snakeColor = "#e74c3c";
let isMusicPlaying = true;

canvas.width = 400;
canvas.height = 400;


function getRandomPosition() {
    let position;
    let valid = false;
    
    while (!valid) {
        position = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
        };
        
        if (!snake.some(segment => segment.x === position.x && segment.y === position.y) &&
            !obstacles.some(obs => obs.x === position.x && obs.y === position.y) &&
            !(position.x === food.x && position.y === food.y)) { 
            valid = true;
        }
    }
    return position;
}


function placeFood() {
    food = getRandomPosition();
}


function generateObstacles() {
  
    const numObstacles = Math.floor(score / 50) + 5; 
    obstacles = [];

    for (let i = 0; i < numObstacles; i++) {
        obstacles.push(getRandomPosition());
    }
}


function changeColors() {
    const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6"];
    snakeColor = colors[level % colors.length];

    
    const bodyColors = ["#3498db", "#e74c3c", "#f39c12", "#2ecc71", "#9b59b6"];
    document.body.style.backgroundColor = bodyColors[level % bodyColors.length];
}


function increaseCanvasSize() {
    canvas.width += 50;
    canvas.height += 50;
}


document.addEventListener("keydown", (e) => {
    if (gameOver) return;

    if (e.key === "ArrowUp" && direction.y === 0) {
        direction = { x: 0, y: -gridSize };
    } else if (e.key === "ArrowDown" && direction.y === 0) {
        direction = { x: 0, y: gridSize };
    } else if (e.key === "ArrowLeft" && direction.x === 0) {
        direction = { x: -gridSize, y: 0 };
    } else if (e.key === "ArrowRight" && direction.x === 0) {
        direction = { x: gridSize, y: 0 };
    }
});

function update() {
    if (gameOver) return;

   
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

   
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        gameOver = true;
    }

    
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
        }
    }

  
    for (let obs of obstacles) {
        if (head.x === obs.x && head.y === obs.y) {
            gameOver = true;
        }
    }

    if (gameOver) {
        gameOverText.style.display = "block";
        restartButton.style.display = "block";
        return;
    }

    
    snake.unshift(head);

    
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = score;
        placeFood();

        
        if (score % 50 === 0) {
            generateObstacles();
            changeColors();
            increaseCanvasSize();
        }
    } else {
        snake.pop();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

 
    ctx.fillStyle = "green";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

 
    ctx.fillStyle = "black";
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, gridSize, gridSize);
    });

    
    ctx.fillStyle = snakeColor;
    snake.forEach((segment, index) => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
}

function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        setTimeout(gameLoop, 100);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    gameMusic.play().catch(error => {
        console.log("Reproducción automática bloqueada:", error);
        musicButton.textContent = "🎵 Reproducir Música";
        isMusicPlaying = false;
    });
});


musicButton.addEventListener("click", () => {
    if (isMusicPlaying) {
        gameMusic.pause();
        musicButton.textContent = "🎵 Reproducir Música";
    } else {
        gameMusic.play();
        musicButton.textContent = "🔇 Pausar Música";
    }
    isMusicPlaying = !isMusicPlaying;
});


restartButton.addEventListener("click", () => {
    location.reload();
});

placeFood();
gameLoop();
