const startButton = document.getElementById('start');
const timerDiv = document.getElementById('timer');
const app = document.getElementById('app');

let startTime;
let timerInterval;

function generateShuffledNumbers() {
    const numbers = [];
    for (let i = 1; i <= 12; i++) {
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
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        timerDiv.textContent = `${minutes} minutes ${seconds} seconds`;
    }, 100);
}

startButton.addEventListener('click', () => {
    startTimer();

    // Assign unique random numbers to top row (skip first column)
    const cells = app.querySelectorAll('div');
    const topRowNumbers = generateShuffledNumbers();
    for (let i = 1; i < 13; i++) {
        cells[i].textContent = topRowNumbers[i - 1];
    }

    // Assign unique random numbers to first column (skip first row)
    const firstColumnNumbers = generateShuffledNumbers();
    for (let i = 1; i < 13; i++) {
        cells[i * 13].textContent = firstColumnNumbers[i - 1];
    }
});
