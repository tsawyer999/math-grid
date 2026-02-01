const TIMER_UPDATE_INTERVAL = 100;
const SECONDS_PER_MINUTE = 60;
const MS_PER_SECOND = 1000;

const timerDiv = document.getElementById("timer");

const operations = {
  addition: "addition",
  multiplication: "multiplication",
};

/**
 * @type {boolean}
 */
let isTimerStarted = false;

/**
 * @type {number}
 */
let correctAnswers = 0;

/**
 * @param {HTMLElement} app
 * @param {number} gridSize
 */
function createBlankGrid(app, gridSize) {
  app.innerHTML = "";
  app.style.gridTemplateColumns = `repeat(${gridSize + 1}, 1fr)`;

  createHeaderCell(app, "grid-operator-header");
  for (let i = 0; i < gridSize; i++) {
    createHeaderCell(app, "grid-column-header");
  }

  for (let i = 0; i < gridSize; i++) {
    createHeaderCell(app, "grid-row-header");

    // grid-cell
    for (let i = 0; i < gridSize; i++) {
      createCell(app);
    }
  }
}

/**
 * @param {HTMLElement} app
 * @param {string} className
 */
function createHeaderCell(app, className) {
  const cell = document.createElement("div");
  cell.classList.add("grid-header");
  cell.classList.add(className);
  app.appendChild(cell);
}

function createCell(app) {
  const cell = document.createElement("div");
  cell.classList.add("grid-cell");
  app.appendChild(cell);
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
 * @param {number} startTime
 * @returns {void}
 */
function startTimer(startTime) {
  setTimeout(() => {
    isTimerStarted = true;
    const timerInterval = setInterval(() => {
      displayTime(correctAnswers, startTime, Date.now());
      if (timerInterval && !isTimerStarted) {
        clearInterval(timerInterval);
        isTimerStarted = false;
      }
    }, TIMER_UPDATE_INTERVAL);
  }, TIMER_UPDATE_INTERVAL + 100);
}

function displayTime(correctAnswers, startTime, stopTime) {
  const elapsed = Math.floor((stopTime - startTime) / MS_PER_SECOND);
  const minutes = Math.floor(elapsed / SECONDS_PER_MINUTE);
  const seconds = elapsed % SECONDS_PER_MINUTE;
  timerDiv.textContent = `${minutes} minutes ${seconds} seconds - ${correctAnswers} correct answers`;
}

/**
 * @returns {void}
 */
function stopTimer() {
  const stopTime = Date.now();
  localStorage.setItem("stopTime", String(stopTime));
  isTimerStarted = false;
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
function onInputChange(input, expectedResult, totalAnswers) {
  const userInput = parseInt(input.value);
  const wasCorrect = input.classList.contains("correct");

  if (userInput === expectedResult) {
    input.classList.add("correct");
    input.classList.remove("incorrect");
    if (!wasCorrect) {
      correctAnswers++;
    }
  } else {
    input.classList.add("incorrect");
    input.classList.remove("correct");
    if (wasCorrect) {
      correctAnswers--;
    }
  }

  if (correctAnswers === totalAnswers) {
    stopTimer();
  }
}

/**
 * @param {string} operationId
 * @returns {void}
 */
function populateOperatorHeader(operationId) {
  const cells = document.querySelectorAll(".grid-operator-header");
  if (cells.length === 0) {
    throw new Error("Grid operator header not found");
  }

  if (operationId === operations.addition) {
    cells[0].textContent = "+";
  } else if (operationId === operations.multiplication) {
    cells[0].textContent = "x";
  } else {
    throw new Error(`Invalid operation ID: ${operationId}`);
  }
}

/**
 * @param {number[]} topRowNumbers
 * @returns {void}
 */
function populateRowHeader(topRowNumbers) {
  const cells = document.querySelectorAll(".grid-row-header");
  for (let i = 0; i < topRowNumbers.length; i++) {
    cells[i].textContent = String(topRowNumbers[i]);
  }
}

/**
 * @param {number[]} firstColumnNumbers
 * @returns {void}
 */
function populateColumnHeader(firstColumnNumbers) {
  const cells = document.querySelectorAll(".grid-column-header");
  for (let i = 0; i < firstColumnNumbers.length; i++) {
    cells[i].textContent = String(firstColumnNumbers[i]);
  }
}

/**
 * @param {string[]} cellValues
 * @param {int} gridSize
 * @param {int[]} rowNumbers
 * @param {int[]} columnNumbers
 * @param {string} operationId
 * @returns {void}
 */
function populateGrid(
  cellValues,
  gridSize,
  rowNumbers,
  columnNumbers,
  operationId,
) {
  populateOperatorHeader(operationId);
  populateRowHeader(rowNumbers);
  populateColumnHeader(columnNumbers);
  populateValues(cellValues, gridSize, rowNumbers, columnNumbers, operationId);
}

/**
 * @param {string[]} cellValues
 * @param {int} gridSize
 * @param {int[]} rowNumbers
 * @param {int[]} columnNumbers
 * @param {string} operationId
 * @returns {void}
 */
function populateValues(
  cellValues,
  gridSize,
  rowNumbers,
  columnNumbers,
  operationId,
) {
  const cells = document.querySelectorAll(".grid-cell");
  for (let row = 0; row < gridSize; row++) {
    for (let column = 0; column < gridSize; column++) {
      const rowValue = rowNumbers[row];
      const columnValue = columnNumbers[column];
      const expectedResult = calculateExpectedResult(
        rowValue,
        columnValue,
        operationId,
      );
      const totalAnswers = gridSize * gridSize;
      const cellIndex = row * gridSize + column;
      const input = document.createElement("input");
      input.type = "text";
      input.classList.add("grid-input");

      const value = cellValues[cellIndex];
      if (!!value) {
        const intValue = parseInt(value);
        input.value = value;
        if (intValue === expectedResult) {
          input.classList.add("correct");
        } else {
          input.classList.add("incorrect");
        }
      }
      input.setAttribute("data-expected-result", String(expectedResult));
      input.addEventListener("input", (e) => {
        onInputChange(e.target, expectedResult, totalAnswers);
        saveData();
      });
      cells[cellIndex].appendChild(input);
    }
  }
}

async function loadGrid() {
  const appElementId = localStorage.getItem("appElementId");
  const operationId = localStorage.getItem("operation");
  const startTimeValue = localStorage.getItem("startTime");
  const stopTimeValue = localStorage.getItem("stopTime");
  const correctAnswersValue = localStorage.getItem("correctAnswers");
  const gridSizeValue = localStorage.getItem("gridSize");
  const cellValuesValue = localStorage.getItem("cellValues");
  const rowNumbersValue = localStorage.getItem("rowNumbers");
  const columnNumbersValue = localStorage.getItem("columnNumbers");

  if (
    !(
      !!appElementId &&
      !!operationId &&
      !!startTimeValue &&
      !!correctAnswersValue &&
      !!gridSizeValue &&
      !!cellValuesValue &&
      !!rowNumbersValue &&
      !!columnNumbersValue
    )
  ) {
    return;
  }

  const gridSize = parseInt(gridSizeValue);
  const gridSizeInput = document.getElementById("gridSize");
  gridSizeInput.value = gridSize;

  const app = document.getElementById(appElementId);
  app.classList.add("visible");

  createBlankGrid(app, gridSize);

  const cellValues = cellValuesValue.split(";");
  const rowNumbers = rowNumbersValue.split(";").map(Number);
  const columnNumbers = columnNumbersValue.split(";").map(Number);
  populateGrid(cellValues, gridSize, rowNumbers, columnNumbers, operationId);

  correctAnswers = parseInt(correctAnswersValue);

  const startTime = parseInt(startTimeValue);
  if (!stopTimeValue) {
    startTimer(startTime);
  } else {
    const stopTime = parseInt(stopTimeValue);
    displayTime(correctAnswers, startTime, stopTime);
  }
}

/**
 * @param {string} appElementId
 * @param {string} operationId
 * @returns {void}
 */
function onStartClick(appElementId, operationId) {
  stopTimer();
  const gridSizeInput = document.getElementById("gridSize");
  const gridSize = parseInt(gridSizeInput.value);

  const app = document.getElementById(appElementId);
  app.classList.add("visible");

  createBlankGrid(app, gridSize);

  const cellValues = new Array(gridSize * gridSize).fill("");
  const rowNumbers = generateShuffledNumbers(gridSize);
  const columnNumbers = generateShuffledNumbers(gridSize);
  populateGrid(cellValues, gridSize, rowNumbers, columnNumbers, operationId);

  const startTime = Date.now();
  startTimer(startTime);

  correctAnswers = 0;

  saveData();
  void saveMetaData(
    appElementId,
    operationId,
    gridSize,
    rowNumbers,
    columnNumbers,
    startTime,
  );
}

/**
 * @param {string} appElementId
 * @param {string} operationId
 * @param {number} gridSize
 * @param {number[]} rowNumbers
 * @param {number[]} columnNumbers
 * @param {number} startTime
 * @returns {void}
 */
async function saveMetaData(
  appElementId,
  operationId,
  gridSize,
  rowNumbers,
  columnNumbers,
  startTime,
) {
  localStorage.setItem("appElementId", appElementId);
  localStorage.setItem("operation", operationId);
  localStorage.setItem("startTime", String(startTime));
  localStorage.removeItem("stopTime");
  localStorage.setItem("correctAnswers", String(correctAnswers));
  localStorage.setItem("gridSize", String(gridSize));
  localStorage.setItem("rowNumbers", rowNumbers.join(";"));
  localStorage.setItem("columnNumbers", columnNumbers.join(";"));
}

/**
 * @returns {void}
 */
function saveData() {
  const inputs = document.querySelectorAll(".grid-input");
  const values = Array.from(inputs)
    .map((input) => input.value)
    .join(";");

  localStorage.setItem("cellValues", String(values));
  localStorage.setItem("correctAnswers", String(correctAnswers));
}

export {
  generateShuffledNumbers,
  startTimer,
  stopTimer,
  TIMER_UPDATE_INTERVAL,
  SECONDS_PER_MINUTE,
  MS_PER_SECOND,
};

window.operations = operations;
window.onStartClick = onStartClick;
window.loadGrid = loadGrid;
