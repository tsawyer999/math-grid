const timerDiv = document.getElementById('timer');
const app = document.getElementById('app');

const GRID_SIZE = 12;
const TIMER_UPDATE_INTERVAL = 100;
const SECONDS_PER_MINUTE = 60;
const MS_PER_SECOND = 1000;

let startTime;
let timerInterval;
let correctAnswers = 0;
const totalAnswers = GRID_SIZE * GRID_SIZE;

// Create grid cells dynamically
function createGrid(gridSize) {
    app.innerHTML = '';
    const totalCells = gridSize * gridSize;
    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        app.appendChild(cell);
    }
}

// Initialize grid on page load
createGrid(GRID_SIZE + 1);

function generateShuffledNumbers(maxNumber) {
    const numbers = [];
    for (let i = 1; i <= maxNumber; i++) {
        numbers.push(i);
    }
    // Shuffle array
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers;
}

function startTimer() {
    startTime = Date.now();

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / MS_PER_SECOND);
        const minutes = Math.floor(elapsed / SECONDS_PER_MINUTE);
        const seconds = elapsed % SECONDS_PER_MINUTE;
        timerDiv.textContent = `${minutes} minutes ${seconds} seconds`;
    }, TIMER_UPDATE_INTERVAL);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }MAX_NUMBER
}

function onStartClick() {
    correctAnswers = 0;
    startTimer();

    const cells = app.querySelectorAll('div');

    // Set the first cell to 'X'
    cells[0].textContent = 'X';

    // Assign unique random numbers to the top row (skip first column)
    const topRowNumbers = generateShuffledNumbers(GRID_SIZE);
    for (let i = 1; i <= GRID_SIZE; i++) {
        cells[i].textContent = topRowNumbers[i - 1];
    }

    // Assign unique random numbers to the first column (skip first row)
    const firstColumnNumbers = generateShuffledNumbers(GRID_SIZE);
    for (let i = 1; i <= GRID_SIZE; i++) {
        cells[i * (GRID_SIZE + 1)].textContent = firstColumnNumbers[i - 1];
    }

    // Add input fields to cells not in the first row or first column
    for (let row = 1; row <= GRID_SIZE; row++) {
        for (let col = 1; col <= GRID_SIZE; col++) {
            const index = (row) * (GRID_SIZE + 1) + col;
            const input = document.createElement('input');
            input.type = 'text';

            const rowValue = parseInt(cells[row * (GRID_SIZE + 1)].textContent);
            const columnValue = parseInt(cells[col].textContent);

            // Add input event listener to validate
            input.addEventListener('input', (e) => {
                const expectedResult = rowValue * columnValue;
                const userInput = parseInt(e.target.value);

                const wasCorrect = e.target.classList.contains('correct');
                const isCorrect = userInput === expectedResult;

                if (isCorrect) {
                    e.target.classList.add('correct');
                    e.target.classList.remove('incorrect');
                    if (!wasCorrect) {
                        correctAnswers++;
                    }
                } else {
                    e.target.classList.add('incorrect');
                    e.target.classList.remove('correct');
                    if (wasCorrect) {
                        correctAnswers--;
                    }
                }

                // Check if all answers are correct
                if (correctAnswers === totalAnswers) {
                    stopTimer();
                }
            });

            //cells[index].innerHTML = '';
            cells[index].appendChild(input);
        }
    }
}

export {
    generateShuffledNumbers,
    startTimer,
    stopTimer,
    GRID_SIZE,
    TIMER_UPDATE_INTERVAL,
    SECONDS_PER_MINUTE,
    MS_PER_SECOND,
    totalAnswers
};

// Expose to global scope for inline onclick handler
window.onStartClick = onStartClick;
