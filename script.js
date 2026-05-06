const texts = [
    "JavaScript is a powerful language used for building interactive web applications. It allows developers to create dynamic content and improve user experience.",

    "Frontend development involves working with HTML, CSS, and JavaScript. It focuses on building the part of the application users interact with directly.",

    "Typing speed tests measure how fast and accurately a user can type. They calculate WPM, accuracy, and error rate based on real-time input.",

    "React is a popular JavaScript library for building user interfaces. It helps developers create reusable components and manage application state efficiently."
];

const WORD_LENGTH = 5;
const GAME_STATE = {
    IDLE: "idle",
    RUNNING: "running",
    FINISHED: "finished"
};

let timeLeft = 30;
let timer = null;
let gameState = GAME_STATE.IDLE;

const textDisplay = document.getElementById("textDisplay");
const input = document.getElementById("input");
const timerEl = document.getElementById("timer");

const progressBar = document.getElementById("progressBar");
const wpmEl = document.getElementById("wpm");
const charsEl = document.getElementById("chars");
const accuracyEl = document.getElementById("accuracy");
const errorsEl = document.getElementById("errors");

const resetBtn = document.getElementById("resetBtn");
const timeSelect = document.getElementById("timeSelect");
const typeHere = document.querySelector(".type-here-div");

const modal = document.getElementById("resultModal");
const finalWpm = document.getElementById("finalWpm");
const finalAccuracy = document.getElementById("finalAccuracy");
const tryAgainBtn = document.getElementById("tryAgainBtn");

function showResultModal() {
    finalWpm.textContent = wpmEl.textContent;
    finalAccuracy.textContent = accuracyEl.textContent;

    modal.classList.add("show");
}

tryAgainBtn.addEventListener("click", () => {
    modal.classList.remove("show");
    resetBtn.click();
});

// 🟢 Load random text
function loadText() {
    const text = texts[Math.floor(Math.random() * texts.length)];

    textDisplay.innerHTML = text
        .split("")
        .map(char => `<span>${char}</span>`)
        .join("");
}

loadText();

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function updateProgress() {
    const total = Number(timeSelect.value);
    const passed = total - timeLeft;
    const percent = (passed / total) * 100;
    progressBar.style.width = percent + "%";
}

// 🟢 Start game
function startGame() {
    if (gameState !== GAME_STATE.IDLE) return;

    timeLeft = Number(timeSelect.value);
    timerEl.textContent = formatTime(timeLeft);

    gameState = GAME_STATE.RUNNING;
    timeSelect.disabled = true;

    timer = setInterval(() => {
        timeLeft--;

        timerEl.textContent = formatTime(timeLeft);
        updateProgress();

        if (timeLeft <= 0) endGame();

    }, 1000);
}

timeSelect.addEventListener("change", () => {
    if (gameState !== GAME_STATE.IDLE) return;

        timeLeft = Number(timeSelect.value);
        timerEl.textContent = formatTime(timeLeft);
        updateProgress(); 
});

// 🟢 Reset
resetBtn.addEventListener("click", () => {
    clearInterval(timer);

   gameState = GAME_STATE.IDLE;
   
    timeLeft = Number(timeSelect.value);
    timerEl.textContent = formatTime(timeLeft);

    input.value = "";
    input.disabled = false;
    input.focus();

    timeSelect.disabled = false;

   typeHere.classList.remove("type-here-hidden");

    wpmEl.textContent = 0;
    charsEl.textContent = 0;
    accuracyEl.textContent = "0%";
    errorsEl.textContent = 0;

    progressBar.style.width = "0%";

    loadText();
});

// 🟢 Typing logic
input.addEventListener("input", () => {

    if (gameState === GAME_STATE.IDLE) {
        startGame();
    }

    const typed = input.value;
    const spans = textDisplay.querySelectorAll("span");

    let errors = 0;

    typeHere.classList.add("type-here-hidden");

    spans.forEach((span, i) => {
        const char = typed[i];

        span.classList.remove("active");

        if (i === typed.length) {
            span.classList.add("active");
        }

        if (char == null) {
            span.classList.remove("correct", "incorrect");
        } else if (char === span.innerText) {
            span.classList.add("correct");
            span.classList.remove("incorrect");
        } else {
            span.classList.add("incorrect");
            span.classList.remove("correct");
            errors++;
        }
    });

    const correctChars = typed.length - errors;

    const timePassed = (Number(timeSelect.value) - timeLeft) / 60;

    const wpm = timePassed > 0 ? Math.round((correctChars / WORD_LENGTH) / timePassed) : 0;

    const accuracy = typed.length === 0 ? 0 : Math.round((correctChars / typed.length) * 100);

    wpmEl.textContent = wpm;
    charsEl.textContent = typed.length;
    accuracyEl.textContent = accuracy;
    errorsEl.textContent = errors;
});



// 🟢 End game
function endGame() {
    gameState = GAME_STATE.FINISHED;
    clearInterval(timer);
    input.disabled = true;

    showResultModal();
}