const GRID_SIZE = 2;
const TIMER_UPDATE_INTERVAL = 100;
const SECONDS_PER_MINUTE = 60;
const MS_PER_SECOND = 1000;

const timerDiv = document.getElementById('timer');

let startTime;
let timerInterval;
let correctAnswers = 0;

function createBlankGrid(app, gridSize) {
    app.innerHTML = '';
    app.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    const cells = [];
    const totalCells = gridSize * gridSize;
    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        app.appendChild(cell);
        cells.push(cell);
    }

    return cells;
}

function generateShuffledNumbers(maxNumber) {
    const numbers = [];
    for (let i = 1; i <= maxNumber; i++) {
        numbers.push(i);
    }

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
    }
}

function validateInput(input, expectedResult) {
    const userInput = parseInt(input.value);
    const wasCorrect = input.classList.contains('correct');

    if (userInput === expectedResult) {
        input.classList.add('correct');
        input.classList.remove('incorrect');
        if (!wasCorrect) {
            correctAnswers++;
        }

        if (correctAnswers === GRID_SIZE * GRID_SIZE) {
            stopTimer();
        }
    } else {
        input.classList.add('incorrect');
        input.classList.remove('correct');
        if (wasCorrect) {
            correctAnswers--;
        }
    }
}

function createCornerHeader(cells) {
    cells[0].classList.add('grid-header');
    cells[0].textContent = 'X';
}

function createRowHeader(cells) {
    const topRowNumbers = generateShuffledNumbers(GRID_SIZE);
    for (let i = 1; i <= GRID_SIZE; i++) {
        cells[i].classList.add('grid-header');
        cells[i].textContent = topRowNumbers[i - 1];
    }
}

function createColumnHeader(cells) {
    const firstColumnNumbers = generateShuffledNumbers(GRID_SIZE);
    for (let i = 1; i <= GRID_SIZE; i++) {
        const index = i * (GRID_SIZE + 1);
        cells[index].classList.add('grid-header');
        cells[index].textContent = firstColumnNumbers[i - 1];
    }
}

function onStartClick() {
    correctAnswers = 0;
    const app = document.getElementById('app');

    const cells = createBlankGrid(app, GRID_SIZE + 1);

    createCornerHeader(cells);
    createRowHeader(cells);
    createColumnHeader(cells);

    // Add input fields to cells not in the first row or first column
    for (let row = 1; row <= GRID_SIZE; row++) {
        for (let col = 1; col <= GRID_SIZE; col++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.addEventListener('input', (e) => {
                const rowValue = parseInt(cells[row * (GRID_SIZE + 1)].textContent);
                const columnValue = parseInt(cells[col].textContent);
                const expectedResult = rowValue * columnValue;
                validateInput(e.target, expectedResult);
            });

            const index = (row) * (GRID_SIZE + 1) + col;
            cells[index].appendChild(input);
        }
    }

    startTimer();
}

export {
    generateShuffledNumbers,
    startTimer,
    stopTimer,
    GRID_SIZE,
    TIMER_UPDATE_INTERVAL,
    SECONDS_PER_MINUTE,
    MS_PER_SECOND
};

// Expose to global scope for inline onclick handler
window.onStartClick = onStartClick;
