window.addEventListener("load", () => {
    const endGameScreen = document.querySelector(".end-game-screen"),
        lettersCont = document.querySelector(".letter-cont"),
        inputs = document.querySelectorAll(".letter-cont > input"),
        valueCont = document.querySelector(".letter-chose"),
        shoseInput = document.querySelectorAll(".header-option > ul > li"),
        hangMan = document.querySelector(".hang-cont > .hang-img"),
        status = document.querySelector(".status"),
        newGameInput = document.querySelector(".end-game-screen > input");

    lettersCont.classList.add("wait");

    // for chosing input
    shoseInput.forEach((e) => {
        e.addEventListener("click", () => {
            if (
                e.classList.contains("disable") ||
                e.classList.contains("active")
            ) {
                return;
            } else {
                shoseInput.forEach((e) => {
                    e.classList.add("disable");
                });
                e.classList.remove("disable");
                e.classList.add("active");
                getData(e.classList[0]);
            }
        });
    });

    // get data form json file
    let lastNames = []; // my AI
    let result = ""; // the reandom data
    let trueResult = 0;
    function getData(value) {
        fetch("data/data.json")
            .then((data) => data.json())
            .then((data) => startGame(data[value]));
    }

    // start game
    function startGame(data) {
        lettersCont.classList.remove("wait");
        let randNum = Math.floor(Math.random() * data.length + 1);
        while (lastNames.includes(data[randNum].name)) {
            randNum = Math.floor(Math.random() * data.length + 1);
        }
        lastNames.push(data[randNum].name);
        result = data[randNum].name.toUpperCase();
        for (let i in result) {
            let span = document.createElement("span");
            span.className = `span${i}`;
            let p = document.createElement("p");
            valueCont.appendChild(span).appendChild(p);
        }
        hangMan.innerHTML = "";
        for (let i = 0; i < 5; i++) {
            let div = document.createElement("div");
            hangMan.appendChild(div);
        }
    }

    // handel input action

    inputs.forEach((e) => {
        e.addEventListener("click", () => {
            if (!e.classList.contains("active")) {
                if (result.includes(e.value)) {
                    e.classList.add("active");
                    for (let char in result) {
                        if (result[char] === e.value) {
                            document.querySelector(`.span${char}`).innerHTML =
                                e.value;
                            trueResult++;
                        }
                    }
                    if (trueResult === result.length) {
                        winGame(result);
                    }
                } else {
                    const div = document.createElement("div");
                    hangMan.appendChild(div);
                    if (hangMan.childElementCount === 11) {
                        loseGame(result);
                    }
                }
            }
        });
    });
    newGameInput.addEventListener("click", () => {
        endGameScreen.classList.remove("active");
    });
    function winGame(word) {
        resetGame();
        if (status.classList.contains("lose")) {
            status.classList.remove("lose");
        }
        status.classList.add("win");
        status.innerHTML = "You Win!!";
        const enterWord = document.querySelector(".enter-word");
        enterWord.innerHTML = word;
    }
    function loseGame(word) {
        resetGame();
        if (status.classList.contains("win")) {
            status.classList.remove("win");
        }
        status.classList.add("lose");
        status.innerHTML = "You lose??";
        const enterWord = document.querySelector(".enter-word");
        enterWord.innerHTML = word;
    }
    function resetGame() {
        for (let item of shoseInput) {
            item.classList.remove("active");
            item.classList.remove("disable");
        }
        endGameScreen.classList.add("active");

        valueCont.innerHTML = "";
        for (let i of inputs) {
            i.classList.remove("active");
        }
        lettersCont.classList.add("wait");
    }
});
