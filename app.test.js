import {
  generateShuffledNumbers,
  SECONDS_PER_MINUTE,
  MS_PER_SECOND,
} from "./app.js";

describe("Math Grid Application", () => {
  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
            <div id="timer"></div>
            <button id="start">Start</button>
            <div id="app">
                ${Array(169).fill("<div></div>").join("")}
            </div>
        `;

    // Clear localStorage
    localStorage.clear();

    // Mock confirm
    global.confirm = jest.fn(() => true);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe("generateShuffledNumbers", () => {
    test("should contain all numbers once", () => {
      const numbers = generateShuffledNumbers(12);
      const sorted = [...numbers].sort((a, b) => a - b);

      expect(sorted).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    });
  });
});
