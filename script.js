var titleContainer = document.getElementById("title-container");
var descriptionElements = document.getElementsByClassName("description");
var buttonsWrapper = document.getElementsByClassName("buttons-wrapper")[0];
var buttons = Array.from(document.getElementsByClassName("btn")).concat(Array.from(document.getElementsByClassName("basic-btn")));
var title = document.getElementById("title");
var answerForm = document.getElementById("answer-form");
var answerBox = document.getElementById("answer-box");
var equationDisplay = document.getElementById("equation-display");
var stopButton = document.getElementById("stop-button");
var backButton = document.getElementById("back-button");

var game = null;

if (localStorage.getItem("sfx") == null) localStorage.setItem("sfx", true);
if (localStorage.getItem("darktheme") == null) localStorage.setItem("darktheme", false);
if (localStorage.getItem("alternateoperators") == null) localStorage.setItem("alternateoperators", true);
if (localStorage.getItem("monofonts") == null) localStorage.setItem("monofonts", true);

function updateDisplaySettings() {
    if (localStorage.getItem("darktheme") == "true") {
        document.documentElement.style.setProperty("--back-colour", "#1a1a1a");
        document.documentElement.style.setProperty("--body-colour", "#f8f0f0");
    } else {
        document.documentElement.style.setProperty("--back-colour", "#f8f0f0");
        document.documentElement.style.setProperty("--body-colour", "#1a1a1a");
    }
    
    if (localStorage.getItem("monofonts") == "true") {
        document.documentElement.style.setProperty("--main-font", "'VT323', monospace");
        document.documentElement.style.setProperty("--body-font", "'Azeret Mono', monospace");
    } else {
        document.documentElement.style.setProperty("--main-font", "'Inter Tight', sans-serif");
        document.documentElement.style.setProperty("--body-font", "'Inter Tight', sans-serif");
    }
}

updateDisplaySettings();

var hoverSound = document.createElement("audio");
hoverSound.src = "https://github.com/Calinou/kenney-interface-sounds/raw/master/addons/kenney_interface_sounds/pluck_001.wav";
document.body.appendChild(hoverSound);

var clickSound = document.createElement("audio");
clickSound.src = "https://github.com/Calinou/kenney-interface-sounds/raw/master/addons/kenney_interface_sounds/switch_006.wav";
document.body.appendChild(clickSound);

var answerSound = document.createElement("audio");
answerSound.src = "https://github.com/Calinou/kenney-interface-sounds/raw/master/addons/kenney_interface_sounds/pluck_002.wav";
document.body.appendChild(answerSound);

var errorSound = document.createElement("audio");
errorSound.src = "https://github.com/Calinou/kenney-interface-sounds/raw/master/addons/kenney_interface_sounds/error_005.wav";
document.body.appendChild(errorSound);

function directTo(url, delay = 400) {
    if (url == 0) return errorSound.play();
    setTimeout(() => window.location.href = url, delay);
    document.body.style.opacity = 0;
}

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("mouseover", (e) => {
        if (localStorage.getItem("sfx") == "true" || localStorage.getItem("sfx") == null) hoverSound.play();
    });
    buttons[i].addEventListener("click", (e) => {
        if (localStorage.getItem("sfx") == "false") return;
        if (buttons[i].classList.contains("btn-inactive")) return errorSound.play(); 
        if (localStorage.getItem("sfx") == "true") clickSound.play();
    })
}

class EndlessGame {
	constructor(difficulty) {
		this.difficulty = difficulty;
		this.questions = [];
	}

	play() {
		for (let i = 0; i < descriptionElements.length; i++) {
			descriptionElements[i].innerText = "";
		}

		for (let i = 0; i < buttonsWrapper.children.length; i++) {
			buttonsWrapper.children[i].style.display = "none";
		}

        descriptionElements[0].innerText = "";

        answerForm.style.display = "";
        stopButton.style.display = "";

        answerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            this.checkAnswer();
        })

        this.askQuestion();
	}

    askQuestion() {
        if (this.difficulty == "easy") {
            var min = 2;
            var max = 12;
        } else if (this.difficulty == "normal") {
            var min = 4;
            var max = 18;
        } else {
            var min = 6;
            var max = 36;
        }

        var value1 = generateRandomInteger(min, max);
        var value2 = generateRandomInteger(min, max);
        var operator = pickOperator();

        var displayed = "";

        this.question = value1 + " " + operator + " " + value2;
        this.answer = calculate(value1, value2, operator);

        if (localStorage.getItem("alternateoperators") == "true") {
            if (operator == "*") {
                displayed = value1 + " × " + value2;
            } else {
                displayed = this.question;
            }
        } else {
           displayed = this.question; 
        }

        if (value1 == value2 && operator == "*") {
            displayed = value1 + "²";
        }

        equationDisplay.innerText = displayed;
    }

    checkAnswer() {
        if (answerBox.value == "") return errorSound.play();
        answerSound.play();
        var userAnswer = parseInt(answerBox.value);
        var correct = userAnswer == this.answer;
        
        answerBox.value = "";

        this.questions.push({
            "question": this.question,
            "answer": this.answer,
            "userAnswer": userAnswer,
            "correct": correct
        });
        console.log(correct);
        this.askQuestion();
    }
}

function startEndlessGame(difficulty) {
	game = new EndlessGame(difficulty);
	game.play();
}

function stopEndlessGame() {
    answerForm.style.display = "none";
    stopButton.style.display = "none";
    backButton.style.display = "";

    var questionsAnswered = game.questions.length;
    var correctAnswers = 0;
    for (let i = 0; i < questionsAnswered; i++) {
        if (game.questions[i].correct) {
            correctAnswers++;
        }
    }

    var percentageScore = Math.round((correctAnswers / questionsAnswered) * 100) || 0;
    equationDisplay.innerText = percentageScore + "%";
}
