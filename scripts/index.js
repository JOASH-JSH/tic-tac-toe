"use strict";

// render character options card in players info form
(function () {
    const playerOneCharacterOptions = ["naruto", "gara", "kakashi", "minato"];
    const playerTwoCharacterOptions = ["itachi", "madara-six-paths", "obito", "pain"];

    let playerOneCharacterCardHTML = "";
    let playerTwoCharacterCardHTML = "";

    playerOneCharacterOptions.forEach((character) => {
        playerOneCharacterCardHTML += `
            <label class="character-option-label">
                <input type="radio" name="playerOneCharacterName" value="${character}"/>
                <img class="character-image" src="assets/images/${character}.webp" alt="image ${character}"/>
            </label>
        `;
    });

    playerTwoCharacterOptions.forEach((character) => {
        playerTwoCharacterCardHTML += `
            <label class="character-option-label">
                <input type="radio" name="playerTwoCharacterName" value="${character}"/>
                <img class="character-image" src="assets/images/${character}.webp" alt="image ${character}"/>
            </label>
        `;
    });

    document.querySelector(".player-character-options-container-1").innerHTML = playerOneCharacterCardHTML;
    document.querySelector(".player-character-options-container-2").innerHTML = playerTwoCharacterCardHTML;
})();

// To create player object
function createPlayer(name, number, character) {
    function getName() {
        return name;
    } 

    function getNumber() {
        return number;
    } 

    function getCharacterName() {
        return character;
    }

    function getCharacterImage() {
        return `assets/images/${character}.webp`;
    } 

    return { getName, getNumber, getCharacterName, getCharacterImage };
}

// To handle player form manipulation
const playersInfoForm = (function () {
    let isCharacterSelectionEventHandlerAdded = false;
    const form = document.getElementById("players-info-form");

    function getForm() {
        return form;
    } 

    function getFormData() {
        return Object.fromEntries(new FormData(form));
    } 

    function updateFormInput(
        playerOneName, playerOneCharacterName, 
        playerTwoName, playerTwoCharacterName
    ) {
        document.getElementById("player-one-name-input").value = playerOneName || "PLAYER-1";
        document.getElementById("player-two-name-input").value = playerTwoName || "PLAYER-2";

        const characterOptionsContainer1 = 
            document.querySelector(".player-character-options-container-1");
        const characterOptionsContainer2 = 
            document.querySelector(".player-character-options-container-2");

        const playerOnePrevSelectedRadioButton = 
            characterOptionsContainer1.querySelector("input[type='radio'][checked]");
        const playerTwoPrevSelectedRadioButton = 
            characterOptionsContainer2.querySelector("input[type='radio'][checked]");

        if (
            playerOnePrevSelectedRadioButton && 
            playerTwoPrevSelectedRadioButton
        ) {
            playerOnePrevSelectedRadioButton.removeAttribute("checked");
            playerTwoPrevSelectedRadioButton.removeAttribute("checked");
            playerOnePrevSelectedRadioButton.parentElement.classList.remove("selected");
            playerTwoPrevSelectedRadioButton.parentElement.classList.remove("selected");
        }

        if (playerOneCharacterName && playerTwoCharacterName) {
            const playerOneCurSelectedRadioButton = 
                characterOptionsContainer1.querySelector(`input[type='radio'][value=${playerOneCharacterName}]`);
            const playerTwoCurSelectedRadioButton = 
                characterOptionsContainer2.querySelector(`input[type='radio'][value=${playerTwoCharacterName}]`);

            playerOneCurSelectedRadioButton.setAttribute("checked", "");
            playerTwoCurSelectedRadioButton.setAttribute("checked", "");

            playerOneCurSelectedRadioButton.parentElement.classList.add("selected");
            playerTwoCurSelectedRadioButton.parentElement.classList.add("selected");
        } else {
            const playerOneCurSelectedRadioButton = 
                characterOptionsContainer1.querySelector("input[type='radio']");
            const playerTwoCurSelectedRadioButton = 
                characterOptionsContainer2.querySelector("input[type='radio']");

            playerOneCurSelectedRadioButton.setAttribute("checked", "");
            playerTwoCurSelectedRadioButton.setAttribute("checked", "");
            
            playerOneCurSelectedRadioButton.parentElement.classList.add("selected");
            playerTwoCurSelectedRadioButton.parentElement.classList.add("selected");
        }

        if (!isCharacterSelectionEventHandlerAdded) {   
            characterOptionsContainer1.addEventListener(
                "click", setupCharacterSelectionEventHandler(characterOptionsContainer1));
            
            characterOptionsContainer2.addEventListener(
                "click", setupCharacterSelectionEventHandler(characterOptionsContainer2));

            isCharacterSelectionEventHandlerAdded = true;
        }
    }

    // Add event listener for character selection
    function setupCharacterSelectionEventHandler(characterOptionsContainer) {
        return function (event) {
            const target = event.target;
            
            if (target.closest("input[type='radio']")) {
                const prevCheckedRadioButton = 
                characterOptionsContainer.querySelector("input[type='radio'][checked]");

                if (prevCheckedRadioButton) {
                    prevCheckedRadioButton.removeAttribute("checked");
                    prevCheckedRadioButton.parentElement.classList.remove("selected");
                }
               
                target.setAttribute("checked", "");
                target.parentElement.classList.add("selected");
            }
        }
    }

    return { getForm, getFormData, updateFormInput};
})();

// Game board
const gameBoard = (function () {
    const ROWS = 3;
    const COLS = 3;

    const board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];

    let totalSquareCount = ROWS * COLS;
    let totalFilledSquareCount = 0;

    function setPlayerPosition(index, playerNumber) {
        if (index < 0 || index > 9) {
            return false;
        }

        const [rowIndex, colIndex] = convertIndexTo2DIndex(index);

        board[rowIndex][colIndex] = playerNumber;
        totalFilledSquareCount++;

        return true;
    }

    function convertIndexTo2DIndex(index) {
        let rowIndex = 0;
        let colIndex = 0;

        while (index > ROWS) {
            rowIndex++;
            index = index - ROWS;
        }

        colIndex = index - 1;

        return [rowIndex, colIndex];
    }

    function getGameBoard() {
        return board;
    }

    function getTotalRowsCols() {
        return [ROWS, COLS];
    }

    function getTotalSquareCount() {
        return totalSquareCount;
    }

    function getTotalFilledSquareCount() {
        return totalFilledSquareCount;
    }

    function resetGameBoard() {
        for (let i = 0; i < ROWS; i++) {
            board[i] = [0, 0, 0];
        }
        totalFilledSquareCount = 0;
    }

    return {
        setPlayerPosition,
        getGameBoard,
        getTotalRowsCols,
        getTotalSquareCount,
        getTotalFilledSquareCount,
        resetGameBoard,
    };
})();

// render game ui
const renderUI = (function () {
    const gameContentMain = document.querySelector(".game-content-main");

    function gameContent(player1, player2, playerWhosTurn) {
        const generateSquares = function() {
            let squares = "";

            for (let i = 0; i < gameBoard.getTotalSquareCount(); i++) {
                squares += `<div class="square" data-index="${i + 1}"></div>`
            }

            return squares;
        }

        gameContentMain.innerHTML = `
            <div class="game-content-sub-main game-content-sub-main-left">
                <p class="player-name player-one-name">${player1.getName()}</p>
                <div class="player-image">
                    <img 
                        src="${player1.getCharacterImage()}" 
                        alt="player character image"
                    />
                </div>
            </div>
            <div class="game-content-sub-main game-content-sub-main-middle">
                <p id="whos-turn">${playerWhosTurn.getName()}'s turn</p>
                <div class="game-board-squares-container">
                    ${generateSquares()}
                </div>
                <div class="reset-restart-buttons-container">
                    <button type="button" class="common-button" id="clear-button">clear</button>
                    <button type="button" class="common-button" id="restart-button">restart</button>
                </div>
            </div>
            <div class="game-content-sub-main game-content-sub-main-right">
                <p class="player-name player-two-name">${player2.getName()}</p>
                <div class="player-image">
                    <img 
                        src="${player2.getCharacterImage()}" 
                        alt="player character image" 
                    />
                </div>
            </div>
        `;
    }

    function clearGameContent() {
        gameContentMain.innerHTML = "";
    }

    function playerTurn(player) {
        document.getElementById("whos-turn").innerText = `${player.getName()}'s turn`;
    }

    function updatedGameBoard(player1, player2) {
        let squaresHTMLString = "";
        const gameBoardSquaresContainer = document.querySelector(".game-board-squares-container");

        const board = gameBoard.getGameBoard();
        const [rows, cols] = gameBoard.getTotalRowsCols();

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const playerNumber = board[i][j];

                let index = i + j;

                if (i === 0) {
                    index += 1;
                } else if (i === 1) {
                    index += 3;
                } else if (i === 2) {
                    index += 5;
                }

                if (playerNumber === 1 || playerNumber === 2) {
                    const player = playerNumber === 1 ? player1 : player2;
    
                    squaresHTMLString += `
                        <div class="square filled" data-index="${index}">
                            <img src="${player.getCharacterImage()}" /> 
                        </div>
                    `;
                } else {
                    squaresHTMLString += `<div class="square" data-index="${index}"></div>`;
                }
            }
        }

        gameBoardSquaresContainer.innerHTML = squaresHTMLString;
    }

    return { gameContent, playerTurn, clearGameContent, updatedGameBoard };
})();

// game logic
const game = (function () {
    const playersFormDialogBox = document.getElementById("players-form-dialog-box");
    const showResultDialogBox = document.getElementById("show-result-dialog-box");

    let player1 = null;
    let player2 = null;
    let playerWhosTurn = null;
    let opponentPlayer = null; 

    const winPositions = [
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[2, 0], [1, 1], [0, 2]],
    ];

    function start() {
        playersInfoForm.updateFormInput(
            player1?.getName(), 
            player1?.getCharacterName(),
            player2?.getName(), 
            player2?.getCharacterName()
        );

        playersFormDialogBox.showModal();
        
        const form = playersInfoForm.getForm();

        form.addEventListener("submit", (event) => {
            const formData = playersInfoForm.getFormData();
            
            player1 = createPlayer(formData.playerOneName, 1, formData.playerOneCharacterName);
            player2 = createPlayer(formData.playerTwoName, 2, formData.playerTwoCharacterName);
            playerWhosTurn = player1;
            opponentPlayer = player2;
            
            playersFormDialogBox.close();

            renderUI.gameContent(player1, player2, playerWhosTurn);
            
            setupClickSquareEventHandler();
            setupClearGameBoardEventHandler();
            setupRestartGameEventHandler();
            setupPlayAgainEventHandler();
        });
    }

    // square click event handler
    function setupClickSquareEventHandler() {
        document.querySelector(".game-board-squares-container")
            .addEventListener("click", (event) => {
                const target = event.target;

                if (target.classList.contains("square") && !target.classList.contains("filled")) {
                    const squareIndex = parseInt(target.dataset.index);
                    const playerNumber = playerWhosTurn.getNumber();

                    gameBoard.setPlayerPosition(squareIndex, playerNumber);
                    renderUI.updatedGameBoard(player1, player2);

                    if (checkIsPlayerWon(playerWhosTurn)) {
                        document.getElementById("show-result").innerText = `🎊 ${playerWhosTurn.getName()} won 🎊`;
                        showResultDialogBox.showModal();
                    } else if (gameBoard.getTotalFilledSquareCount() === gameBoard.getTotalSquareCount()) {
                        document.getElementById("show-result").innerText = "Tie";
                        showResultDialogBox.showModal();
                    }

                    playerWhosTurn = playerNumber !== 1 ? player1 : player2;
                    opponentPlayer = playerNumber === 1 ? player1 : player2;

                    renderUI.playerTurn(playerWhosTurn);
                }
            }
        );
    }

    // clear game board event handler
    function setupClearGameBoardEventHandler() {
        document.getElementById("clear-button")
            .addEventListener("click", (event) => {
                gameBoard.resetGameBoard();
                playerWhosTurn = player1;
                opponentPlayer = player2;
                renderUI.playerTurn(playerWhosTurn);
                renderUI.updatedGameBoard();
            }
        );
    }

    // restart game event handler
    function setupRestartGameEventHandler() {
        document.getElementById("restart-button")
            .addEventListener("click", (event) => {
                gameBoard.resetGameBoard();
                renderUI.clearGameContent()
                start();
            }
        );
    }

    // play again event handler
    function setupPlayAgainEventHandler() {
        document.getElementById("play-again-button")
            .addEventListener("click", (event) => {
                gameBoard.resetGameBoard();
                playerWhosTurn = player1;
                opponentPlayer = player2;
                showResultDialogBox.close();
                renderUI.playerTurn(playerWhosTurn);
                renderUI.updatedGameBoard(player1, player2);
            }
        );
    }

    // check winner
    function checkIsPlayerWon(player) {
        const board = gameBoard.getGameBoard();
        const playerNumber = player.getNumber();
        
        for (let position of winPositions) {
            let positionsMatched = 0;

            for (let [rowIndex, colIndex] of position) {
                if (board[rowIndex][colIndex] === playerNumber) {
                    positionsMatched++;
                }
            }

            if (positionsMatched === 3) {
                return true;
            }
        }

        return false;
    }

    return { start };
})();

game.start();