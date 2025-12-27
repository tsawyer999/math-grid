const startButton = document.getElementById('start');
const timerDiv = document.getElementById('timer');
const app = document.getElementById('app');

let startTime;
let timerInterval;

startButton.addEventListener('click', () => {
    startTime = Date.now();

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        timerDiv.textContent = `${minutes} minutes ${seconds} seconds`;
    }, 100);

    // Assign unique random numbers to top row (skip first column)
    const cells = app.querySelectorAll('div');
    const topRowNumbers = [];
    for (let i = 1; i <= 12; i++) {
        topRowNumbers.push(i);
    }
    // Shuffle array for top row
    for (let i = topRowNumbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [topRowNumbers[i], topRowNumbers[j]] = [topRowNumbers[j], topRowNumbers[i]];
    }
    // Assign to top row cells (skip first column, index 0)
    for (let i = 1; i < 13; i++) {
        cells[i].textContent = topRowNumbers[i - 1];
    }

    // Assign unique random numbers to first column (skip first row)
    const firstColumnNumbers = [];
    for (let i = 1; i <= 12; i++) {
        firstColumnNumbers.push(i);
    }
    // Shuffle array for first column
    for (let i = firstColumnNumbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [firstColumnNumbers[i], firstColumnNumbers[j]] = [firstColumnNumbers[j], firstColumnNumbers[i]];
    }
    // Assign to first column cells (skip first row, start at row 1)
    for (let i = 1; i < 13; i++) {
        cells[i * 13].textContent = firstColumnNumbers[i - 1];
    }
});
