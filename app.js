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

    // Add input fields to cells not in first row or first column
    for (let row = 1; row < 13; row++) {
        for (let col = 1; col < 13; col++) {
            const index = row * 13 + col;
            const input = document.createElement('input');
            input.type = 'text';

            // Add input event listener to validate
            input.addEventListener('input', (e) => {
                const rowNum = parseInt(cells[row * 13].textContent);
                const colNum = parseInt(cells[col].textContent);
                const expectedResult = rowNum * colNum;
                const userInput = parseInt(e.target.value);

                if (userInput === expectedResult) {
                    e.target.style.color = 'green';
                } else {
                    e.target.style.color = 'red';
                }
            });

            cells[index].innerHTML = '';
            cells[index].appendChild(input);
        }
    }
});
