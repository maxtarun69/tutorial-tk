const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gridSize = 20;

function adjustCanvasSize() {
    let canvasSize = Math.min(window.innerWidth, window.innerHeight) - 20;
    canvas.width = canvas.height = canvasSize - (canvasSize % gridSize);
}

adjustCanvasSize();

const gridSizeX = canvas.width / gridSize;
const gridSizeY = canvas.height / gridSize;

const startSound = document.getElementById("startSound");
const eatSound = document.getElementById("eatSound");
const specialEatSound = document.getElementById("specialEatSound");
const gameOverSound = document.getElementById("gameOverSound");
const countdownSound = document.getElementById("countdownSound");

let snake, food, specialFood, dx, dy, score, gameLoopInterval, specialFoodTimeout, specialFoodCounter;

function initGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 10 };
    specialFood = null;
    dx = 1;
    dy = 0;
    score = 0;
    specialFoodCounter = 0;
    specialFoodTimeout = 0;
}

function drawSnake() {
    snake.forEach(segment => {
        ctx.fillStyle = "#00f";
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

function drawFood() {
    ctx.fillStyle = "#f00";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function drawSpecialFood() {
    if (specialFood) {
        ctx.fillStyle = "#ff0";
        ctx.fillRect(specialFood.x * gridSize, specialFood.y * gridSize, gridSize, gridSize);
    }
}

function drawScore() {
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.textAlign = "right";
    ctx.fillText(`Score: ${score}`, canvas.width - 10, 30);
}

function drawTimeout() {
    if (specialFood) {
        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.textAlign = "left";
        ctx.fillText(`Timeout: ${specialFoodTimeout.toFixed(1)}`, 10, 30);
    }
}

function drawGameOver() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        eatSound.play();
        createFood();
        score++;
        specialFoodCounter++;
        if (specialFoodCounter === 5) {
            createSpecialFood();
            specialFoodCounter = 0;
        }
    } else if (specialFood && head.x === specialFood.x && head.y === specialFood.y) {
        specialEatSound.play();
        score += 10;
        specialFood = null;
        specialFoodTimeout = 0;
        countdownSound.pause();
        countdownSound.currentTime = 0;
    } else {
        snake.pop();
    }
}

function createFood() {
    food.x = Math.floor(Math.random() * gridSizeX);
    food.y = Math.floor(Math.random() * gridSizeY);
}

function createSpecialFood() {
    specialFood = { x: Math.floor(Math.random() * gridSizeX), y: Math.floor(Math.random() * gridSizeY) };
    specialFoodTimeout = 5;
    countdownSound.play();
    countdownSound.volume = 1;
    setTimeout(() => {
        if (specialFood) {
            specialFood = null;
            countdownSound.pause();
            countdownSound.currentTime = 0;
        }
    }, 5000);
}

function checkCollision() {
    if (snake[0].x < 0 || snake[0].x >= gridSizeX || snake[0].y < 0 || snake[0].y >= gridSizeY) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

function gameLoop() {
    if (checkCollision()) {
        clearInterval(gameLoopInterval);
        gameOverSound.play();
        drawGameOver();
        document.getElementById("gameOverScreen").style.display = "block";
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    drawSpecialFood();
    drawScore();
    drawTimeout();
    moveSnake();
    if (specialFood) {
        specialFoodTimeout -= 0.1;
        countdownSound.volume = specialFoodTimeout / 5; 
        if (specialFoodTimeout <= 0) {
            specialFood = null;
            specialFoodTimeout = 0;
            countdownSound.pause();
            countdownSound.currentTime = 0;
        }
    }
}

document.addEventListener("keydown", event => {
    const key = event.key;
    if ((key === "ArrowUp" && dy === 0) || (key === "ArrowDown" && dy === 0)) {
        dx = 0;
        dy = (key === "ArrowUp") ? -1 : 1;
    } else if ((key === "ArrowLeft" && dx === 0) || (key === "ArrowRight" && dx === 0)) {
        dx = (key === "ArrowLeft") ? -1 : 1;
        dy = 0;
    }
});

function startGame() {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("gameOverScreen").style.display = "none";
    setTimeout(() => {
        startSound.play();
        initGame();
        gameLoopInterval = setInterval(gameLoop, 200);
    }, 3000);
}

function restartGame() {
    document.getElementById("gameOverScreen").style.display = "none";
    setTimeout(() => {
        startSound.play();
        initGame();
        gameLoopInterval = setInterval(gameLoop, 200);
    }, 3000);
}

window.onload = function() {
    document.getElementById("startScreen").style.display = "block";
    canvas.width = canvas.height = canvasSize;
};

window.onresize = function() {
    adjustCanvasSize();
    initGame();
};
