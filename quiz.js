// Game constants
const GRID_SIZE = 20;
const ENEMY_COUNT = 10;
const BATTLE_CHANCE = 0.3;
const LEVEL_UP_BASE = 100;
const MEDCOIN_REWARD = 10;
const DAMAGE_ON_WRONG = 15;
const HEAL_ON_LEVEL = 20;

// Game state
const gameState = {
    playerPosition: { x: 0, y: 0 },
    playerStats: {
        hp: 100,
        maxHp: 100,
        medcoins: 0,
        level: 1,
        exp: 0,
        expToNext: LEVEL_UP_BASE
    },
    enemies: [],
    grid: [],
    inBattle: false,
    currentEnemy: null,
    moveCount: 0,
    gameStarted: false
};

// Show welcome screen
function showWelcomeScreen() {
    const welcomeScreen = document.createElement('div');
    welcomeScreen.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
    welcomeScreen.innerHTML = `
        <div class="text-center pixel-border p-8 bg-gray-900 max-w-2xl">
            <h2 class="text-2xl text-blue-400 mb-6">Welcome to PharmaQuest RPG!</h2>
            <div class="text-left space-y-4 mb-6">
                <p class="text-gray-300">🎮 How to Play:</p>
                <ul class="list-disc list-inside text-sm text-gray-400 space-y-2">
                    <li>Use Arrow Keys to move your character (👨‍⚕️)</li>
                    <li>Encounter medicine pills (💊) to start pharmacy battles</li>
                    <li>Answer questions correctly to earn MedCoins and experience</li>
                    <li>Watch your HP - wrong answers will hurt you!</li>
                    <li>Level up to become stronger and earn more rewards</li>
                    <li>Avoid gray walls and plan your route carefully</li>
                </ul>
            </div>
            <button onclick="startGame()" class="retro-button animate-pulse">Press SPACE to Start!</button>
        </div>
    `;
    document.body.appendChild(welcomeScreen);
}

// Start game
function startGame() {
    const welcomeScreen = document.querySelector('.bg-black.bg-opacity-90');
    if (welcomeScreen) {
        welcomeScreen.remove();
    }
    gameState.gameStarted = true;
    resetGame();
}

// Load questions from JSON
let questions = [];
fetch('Content/Data/OPRA2024Questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        console.log('Loaded', questions.length, 'questions');
    })
    .catch(error => {
        console.error('Error loading questions:', error);
    });

// Initialize game grid
function initializeGrid() {
    gameState.grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
    gameState.enemies = [];

    // Create a more structured maze-like pattern
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (Math.random() < 0.2 && !(i === 0 && j === 0)) {
                gameState.grid[i][j] = 1;
            }
        }
    }

    // Ensure there's a path to the end
    createPath();

    // Place enemies in accessible locations
    for (let i = 0; i < ENEMY_COUNT; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * GRID_SIZE);
            y = Math.floor(Math.random() * GRID_SIZE);
        } while (gameState.grid[y][x] !== 0 || (x === 0 && y === 0));
        
        gameState.enemies.push({ x, y, defeated: false });
        gameState.grid[y][x] = 2;
    }
}

// Create a guaranteed path through the maze
function createPath() {
    const path = [];
    let currentX = 0;
    let currentY = 0;
    
    while (currentX < GRID_SIZE - 1 || currentY < GRID_SIZE - 1) {
        gameState.grid[currentY][currentX] = 0;
        path.push({ x: currentX, y: currentY });
        
        if (Math.random() < 0.5 && currentX < GRID_SIZE - 1) {
            currentX++;
        } else if (currentY < GRID_SIZE - 1) {
            currentY++;
        }
    }
}

// Render game grid with improved visuals
function renderGrid() {
    const gridElement = document.getElementById('game-grid');
    gridElement.innerHTML = '';
    gridElement.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 32px)`;

    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const tile = document.createElement('div');
            tile.className = 'game-tile';
            
            if (x === gameState.playerPosition.x && y === gameState.playerPosition.y) {
                tile.classList.add('player');
                tile.innerHTML = '👨‍⚕️';
            } else if (gameState.grid[y][x] === 1) {
                tile.classList.add('wall');
            } else if (gameState.grid[y][x] === 2) {
                tile.classList.add('enemy');
                tile.innerHTML = '💊';
            }
            
            gridElement.appendChild(tile);
        }
    }
}

// Update status display with animations
function updateStatus() {
    const hpElement = document.getElementById('player-hp');
    const medcoinsElement = document.getElementById('medcoins');
    const levelElement = document.getElementById('player-level');

    // Animate HP changes
    const currentHp = parseInt(hpElement.textContent);
    if (currentHp !== gameState.playerStats.hp) {
        hpElement.style.transition = 'color 0.3s';
        hpElement.style.color = gameState.playerStats.hp > currentHp ? '#4ade80' : '#ef4444';
        setTimeout(() => {
            hpElement.style.color = '#4ade80';
        }, 300);
    }

    hpElement.textContent = gameState.playerStats.hp;
    medcoinsElement.textContent = gameState.playerStats.medcoins;
    levelElement.textContent = gameState.playerStats.level;

    // Show HP as percentage bar
    const hpPercent = (gameState.playerStats.hp / gameState.playerStats.maxHp) * 100;
    hpElement.style.background = `linear-gradient(to right, #4ade80 ${hpPercent}%, transparent ${hpPercent}%)`;
}

// Handle player movement with improved controls
function movePlayer(dx, dy) {
    if (gameState.inBattle || !gameState.gameStarted) return;

    const newX = gameState.playerPosition.x + dx;
    const newY = gameState.playerPosition.y + dy;

    if (newX >= 0 && newX < GRID_SIZE && 
        newY >= 0 && newY < GRID_SIZE && 
        gameState.grid[newY][newX] !== 1) {
        
        // Enemy encounter
        if (gameState.grid[newY][newX] === 2) {
            const enemy = gameState.enemies.find(e => e.x === newX && e.y === newY);
            if (enemy && !enemy.defeated) {
                gameState.currentEnemy = enemy;
                startBattle();
            }
        } else if (Math.random() < BATTLE_CHANCE && gameState.moveCount++ > 3) {
            startBattle();
            gameState.moveCount = 0;
        }

        gameState.playerPosition.x = newX;
        gameState.playerPosition.y = newY;
        renderGrid();
    }
}

// Enhanced battle system
function startBattle() {
    gameState.inBattle = true;
    const battleScreen = document.getElementById('battle-screen');
    battleScreen.classList.remove('hidden');

    // Select random question
    const question = questions[Math.floor(Math.random() * questions.length)];
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options');

    questionText.textContent = question.question;
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'retro-button w-full mb-2 transition-all hover:scale-105';
        button.textContent = `${['A', 'B', 'C', 'D'][index]}. ${option}`;
        button.onclick = () => handleAnswer(index, question.correctAnswer, question.explanation);
        optionsContainer.appendChild(button);
    });
}

// Handle battle answer with feedback
function handleAnswer(playerAnswer, correctAnswer, explanation) {
    const isCorrect = playerAnswer === correctAnswer;
    
    if (isCorrect) {
        // Correct answer rewards
        gameState.playerStats.medcoins += MEDCOIN_REWARD * gameState.playerStats.level;
        gameState.playerStats.exp += 20 * gameState.playerStats.level;
        
        // Level up check
        if (gameState.playerStats.exp >= gameState.playerStats.expToNext) {
            levelUp();
        }

        // Remove defeated enemy
        if (gameState.currentEnemy) {
            gameState.currentEnemy.defeated = true;
            gameState.grid[gameState.currentEnemy.y][gameState.currentEnemy.x] = 0;
        }

        showFeedback('Correct! 🎉', explanation, 'text-green-400');
    } else {
        // Wrong answer penalties
        gameState.playerStats.hp = Math.max(0, gameState.playerStats.hp - DAMAGE_ON_WRONG);
        if (gameState.playerStats.hp <= 0) {
            gameOver();
            return;
        }
        showFeedback('Incorrect! 😕', explanation, 'text-red-400');
    }

    setTimeout(() => {
        endBattle();
        updateStatus();
    }, 3000);
}

// Show feedback after answer
function showFeedback(result, explanation, colorClass) {
    const battleScreen = document.getElementById('battle-screen');
    const feedback = document.createElement('div');
    feedback.className = `fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                         text-center ${colorClass} text-xl font-bold z-50 pixel-border p-4 bg-gray-900`;
    feedback.innerHTML = `${result}<br><span class="text-sm text-gray-300 mt-2">${explanation}</span>`;
    battleScreen.appendChild(feedback);
    setTimeout(() => feedback.remove(), 3000);
}

// Level up system
function levelUp() {
    gameState.playerStats.level++;
    gameState.playerStats.exp -= gameState.playerStats.expToNext;
    gameState.playerStats.expToNext = LEVEL_UP_BASE * gameState.playerStats.level;
    gameState.playerStats.maxHp += 20;
    gameState.playerStats.hp = Math.min(gameState.playerStats.maxHp, gameState.playerStats.hp + HEAL_ON_LEVEL);
    
    showLevelUpMessage();
}

// Show level up message
function showLevelUpMessage() {
    const message = document.createElement('div');
    message.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-yellow-400 text-2xl z-50 animate-bounce';
    message.innerHTML = '🎊 LEVEL UP! 🎊';
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 2000);
}

// Game over handling
function gameOver() {
    const gameOverScreen = document.createElement('div');
    gameOverScreen.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
    gameOverScreen.innerHTML = `
        <div class="text-center pixel-border p-8 bg-gray-900">
            <h2 class="text-2xl text-red-500 mb-4">Game Over!</h2>
            <p class="mb-4">Final Score: ${gameState.playerStats.medcoins} MedCoins</p>
            <button onclick="resetGame()" class="retro-button">Try Again</button>
        </div>
    `;
    document.body.appendChild(gameOverScreen);
}

// End battle
function endBattle() {
    gameState.inBattle = false;
    gameState.currentEnemy = null;
    document.getElementById('battle-screen').classList.add('hidden');
    renderGrid();
}

// Reset game
function resetGame() {
    gameState.playerPosition = { x: 0, y: 0 };
    gameState.playerStats = {
        hp: 100,
        maxHp: 100,
        medcoins: 0,
        level: 1,
        exp: 0,
        expToNext: LEVEL_UP_BASE
    };
    gameState.moveCount = 0;
    gameState.inBattle = false;
    gameState.currentEnemy = null;
    
    const gameOverScreen = document.querySelector('.bg-black.bg-opacity-90');
    if (gameOverScreen) {
        gameOverScreen.remove();
    }
    
    initializeGrid();
    renderGrid();
    updateStatus();
}

// Handle keyboard input with improved responsiveness
document.addEventListener('keydown', (e) => {
    if (e.repeat) return; // Prevent key repeat

    switch(e.key) {
        case 'ArrowUp':
            movePlayer(0, -1);
            break;
        case 'ArrowDown':
            movePlayer(0, 1);
            break;
        case 'ArrowLeft':
            movePlayer(-1, 0);
            break;
        case 'ArrowRight':
            movePlayer(1, 0);
            break;
        case ' ':
            if (!gameState.gameStarted) {
                startGame();
            }
            break;
    }
    updateStatus();
});

// Initialize game
window.onload = showWelcomeScreen;
