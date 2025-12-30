const TIMER_UPDATE_INTERVAL = 100;
const SECONDS_PER_MINUTE = 60;
const MS_PER_SECOND = 1000;

const timerDiv = document.getElementById('timer');
const gridSizeInput = document.getElementById('gridSize');

const operations = {
    addition: "addition",
    multiplication: "multiplication"
};

let startTime;
let timerInterval;
let correctAnswers = 0;

/**
 * @param {HTMLElement} app
 * @param {number} gridSize
 * @returns {HTMLElement[]}
 */
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

/**
 * @param {number} maxNumber
 * @returns {number[]}
 */
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

/**
 * @returns {void}
 */
function startTimer() {
    startTime = Date.now();

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / MS_PER_SECOND);
        const minutes = Math.floor(elapsed / SECONDS_PER_MINUTE);
        const seconds = elapsed % SECONDS_PER_MINUTE;
        timerDiv.textContent = `${minutes} minutes ${seconds} seconds - ${correctAnswers} correct answers`;
    }, TIMER_UPDATE_INTERVAL);
}

/**
 * @returns {void}
 */
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
}

    /**
 * @param {number} rowValue
 * @param {number} columnValue
 * @param {string} operationId
 * @returns {number}
 */
function calculateExpectedResult(rowValue, columnValue, operationId) {
    if (operationId === operations.addition) {
        return rowValue + columnValue;
    } else if (operationId === operations.multiplication) {
        return rowValue * columnValue;
    } else {
        throw new Error(`Invalid operation ID: ${operationId}`);
    }
}

/**
 * @param {HTMLInputElement} input
 * @param {number} expectedResult
 * @param {number} totalAnswers
 * @returns {void}
 */
function validateInput(input, expectedResult, totalAnswers) {
    const userInput = parseInt(input.value);
    const wasCorrect = input.classList.contains('correct');

    if (userInput === expectedResult) {
        input.classList.add('correct');
        input.classList.remove('incorrect');
        if (!wasCorrect) {
            correctAnswers++;
        }

        if (correctAnswers === totalAnswers) {
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

/**
 * @param {HTMLElement[]} cells
 * @param {string} operationId
 * @returns {void}
 */
function createCornerHeader(cells, operationId) {
    cells[0].classList.add('grid-header');

    if (operationId === operations.addition) {
        cells[0].textContent = '+';
    }
    else if (operationId === operations.multiplication) {
        cells[0].textContent = 'x';
    }
    else {
        throw new Error(`Invalid operation ID: ${operationId}`);
    }
}

/**
 * @param {HTMLElement[]} cells
 * @param {number} gridSize
 * @returns {number[]}
 */
function createRowHeader(cells, gridSize) {
    const topRowNumbers = generateShuffledNumbers(gridSize);
    for (let i = 1; i <= gridSize; i++) {
        cells[i].classList.add('grid-header');
        cells[i].textContent = String(topRowNumbers[i - 1]);
    }

    return topRowNumbers;
}

/**
 * @param {HTMLElement[]} cells
 * @param {number} gridSize
 * @returns {number[]}
 */
function createColumnHeader(cells, gridSize) {
    const firstColumnNumbers = generateShuffledNumbers(gridSize);
    for (let i = 1; i <= gridSize; i++) {
        const index = i * (gridSize + 1);
        cells[index].classList.add('grid-header');
        cells[index].textContent = String(firstColumnNumbers[i - 1]);
    }

    return firstColumnNumbers;
}

/**
 * @param {HTMLElement[]} cells
 * @param {number} gridSize
 * @param {number[]} topRowNumbers
 * @param {number[]} firstColumnNumbers
 * @param {string} operationId
 * @returns {void}
 */
function populateGrid(cells, gridSize, topRowNumbers, firstColumnNumbers, operationId) {
    const totalAnswers = gridSize * gridSize;

    for (let row = 1; row <= gridSize; row++) {
        for (let col = 1; col <= gridSize; col++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.addEventListener('input', (e) => {
                const rowValue = firstColumnNumbers[row - 1];
                const columnValue = topRowNumbers[col - 1];

                const expectedResult = calculateExpectedResult(rowValue, columnValue, operationId);
                validateInput(e.target, expectedResult, totalAnswers);
            });

            const index = (row) * (gridSize + 1) + col;
            cells[index].appendChild(input);
        }
    }
}

/**
 * @param {string} appElementId
 * @param {string} operationId
 * @returns {void}
 */
function onStartClick(appElementId, operationId) {
    correctAnswers = 0;

    const gridSize = parseInt(gridSizeInput.value);

    const app = document.getElementById(appElementId);
    app.classList.add('visible');

    const cells = createBlankGrid(app, gridSize + 1);

    createCornerHeader(cells, operationId);

    const topRowNumbers = createRowHeader(cells, gridSize);
    const firstColumnNumbers = createColumnHeader(cells, gridSize);

    populateGrid(cells, gridSize, topRowNumbers, firstColumnNumbers, operationId);

    startTimer();
}

export {
    generateShuffledNumbers,
    startTimer,
    stopTimer,
    TIMER_UPDATE_INTERVAL,
    SECONDS_PER_MINUTE,
    MS_PER_SECOND
};

window.operations = operations;
window.onStartClick = onStartClick;
