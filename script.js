var titleContainer = document.getElementById("title-container");
var descriptionElements = document.getElementsByClassName("description");
var buttonsWrapper = document.getElementsByClassName("buttons-wrapper")[0];
var title = document.getElementById("title");
var answerForm = document.getElementById("answer-form");
var answerBox = document.getElementById("answer-box");
var equationDisplay = document.getElementById("equation-display");
var stopButton = document.getElementById("stop-button");
var backButton = document.getElementById("back-button");
var buttons = Array.from(document.getElementsByClassName("btn")).concat(
	Array.from(document.getElementsByClassName("basic-btn"))
);

var game = null;

anim = document.body.style.animation;
document.body.style.animation = null;
document.body.style.animation = anim;

if (localStorage.getItem("sfx") == null) localStorage.setItem("sfx", true);
if (localStorage.getItem("darktheme") == null)
	localStorage.setItem("darktheme", false);
if (localStorage.getItem("alternateoperators") == null)
	localStorage.setItem("alternateoperators", true);
if (localStorage.getItem("monofonts") == null)
	localStorage.setItem("monofonts", true);

function updateDisplaySettings() {
	if (localStorage.getItem("darktheme") == "true") {
		document.documentElement.style.setProperty("--back-colour", "#1a1a1a");
		document.documentElement.style.setProperty("--body-colour", "#f8f0f0");
	} else {
		document.documentElement.style.setProperty("--back-colour", "#f8f0f0");
		document.documentElement.style.setProperty("--body-colour", "#1a1a1a");
	}

	if (localStorage.getItem("monofonts") == "true") {
		document.documentElement.style.setProperty(
			"--main-font",
			"'VT323', monospace"
		);
		document.documentElement.style.setProperty(
			"--body-font",
			"'Azeret Mono', monospace"
		);
	} else {
		document.documentElement.style.setProperty(
			"--main-font",
			"'Inter Tight', sans-serif"
		);
		document.documentElement.style.setProperty(
			"--body-font",
			"'Inter Tight', sans-serif"
		);
	}
}

updateDisplaySettings();

createjs.Sound.registerSound("https://boxkat.github.io/assets/sfx/bass_01.wav", "buttonHover");
createjs.Sound.registerSound("https://boxkat.github.io/assets/sfx/bass_02.wav", "buttonClick");
createjs.Sound.registerSound("https://boxkat.github.io/assets/sfx/hit_03.wav", "answer");
createjs.Sound.registerSound("https://boxkat.github.io/assets/sfx/thud_04.wav", "error");

function directTo(url, delay = 400, new_tab = false) {
	if (url == 0) return createjs.Sound.play("error");
	setTimeout(() => {
		if (new_tab) window.open(url, "_blank");
		else window.location.href = url;
	}, delay);
	document.body.style.opacity = 0;
}

for (let i = 0; i < buttons.length; i++) {
	buttons[i].addEventListener("mouseover", (e) => {
		if (
			localStorage.getItem("sfx") == "true" ||
			localStorage.getItem("sfx") == null
		)
            createjs.Sound.play("buttonHover");
	});
	buttons[i].addEventListener("click", (e) => {
		if (localStorage.getItem("sfx") == "false") return;
		if (buttons[i].classList.contains("btn-inactive")) return createjs.Sound.play("error");
		if (localStorage.getItem("sfx") == "true") createjs.Sound.play("buttonClick");
	});
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
		});

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
		if (answerBox.value == "") return createjs.Sound.play("error");
		createjs.Sound.play("answer");
		var userAnswer = parseInt(answerBox.value);
		var correct = userAnswer == this.answer;

		answerBox.value = "";

		this.questions.push({
			question: this.question,
			answer: this.answer,
			userAnswer: userAnswer,
			correct: correct,
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

	var percentageScore =
		Math.round((correctAnswers / questionsAnswered) * 100) || 0;
	equationDisplay.innerText = percentageScore + "%";
}
