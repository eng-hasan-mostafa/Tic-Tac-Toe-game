
function createUser(name){

    const getName = () => name;
    return {getName};
}

function createPlayer(name, marker){
    
    const {getName} = createUser(name);
    let score = 0;

    const getMarker = () => marker;
    const getScore = () => score;
    const increaseScore = () => ++score;

    return {getName, getMarker, getScore, increaseScore}
}

const gameBoard = (function(){
    const gameBoardGrid = [[null, null, null],
                           [null, null, null],
                           [null, null, null]];
    

    const getGameBoard = () => gameBoardGrid;

    const markCell = (xCoordinate, yCoordinate, marker) => {
        if(xCoordinate >= 3 || yCoordinate >= 3){
            throw Error('The selected cell is outside the game board range.');
        }else if(gameBoardGrid[xCoordinate][yCoordinate] !== null){
            throw Error('This cell is already marked!');
        }
        gameBoardGrid[xCoordinate][yCoordinate] = marker;
    };

    const cleanGameBoard = () => {
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                gameBoardGrid[i][j] = null;
            }
        }
    };


    return {getGameBoard, markCell, cleanGameBoard};
})();

const gameFlow = (function(){
    let player1;
    let player2;
    let playingTurn = 'player1';

    const startGame = (firstPlayerName, secondPlayerName) => {
        initialize(firstPlayerName, secondPlayerName);
        console.log(`player1 score:${player1.getScore()}`);
        console.log(`player2 score:${player2.getScore()}`);
    }

    const initialize = (firstPlayerName, secondPlayerName) => {
        player1 = createPlayer(firstPlayerName, 'X');
        player2 = createPlayer(secondPlayerName, 'O');
        gameBoard.cleanGameBoard();
        displayController.renderGameBoard();
        displayController.renderResultsBoard(player1, player2);
        displayController.renderControlBtns();
    };

    const play = (xCoordinate, yCoordinate) => {
        if(checkRoundResult() === 'non-match'){
            let marker = (playingTurn === 'player1' ? player1.getMarker() : player2.getMarker());
            gameBoard.markCell(xCoordinate, yCoordinate, marker);
    
            if(checkRoundResult() === 'match'){
                let winner = (playingTurn === 'player1'? player1 : player2);
                winner.increaseScore();
                displayController.renderResultsBoard(player1, player2);
            }else if(checkRoundResult() === 'draw'){
                console.log(`It's a DRAW!`);
            }
            displayController.renderGameBoard();
            displayController.renderResultsBoard(player1, player2);
            playingTurn = (playingTurn === 'player1' ? 'player2' : 'player1');
        }
    };

    const checkRoundResult = () => {
        let gameBoardGrid = gameBoard.getGameBoard();
        let match = false;

        if(((gameBoardGrid[0][0] === gameBoardGrid[1][1] &&
             gameBoardGrid[1][1] === gameBoardGrid[2][2])||
            (gameBoardGrid[1][1] === gameBoardGrid[2][0] &&
             gameBoardGrid[1][1] === gameBoardGrid[0][2])) &&
             gameBoardGrid[1][1] !== null){
                match =true;
        }else{
            for(let i = 0; i < 3; i++){
                let j = 0;
                if((gameBoardGrid[i][j] === gameBoardGrid[i][j+1] &&
                    gameBoardGrid[i][j+1]  === gameBoardGrid[i][j+2] &&
                    gameBoardGrid[i][j] !== null) ||
                   (gameBoardGrid[j][i] === gameBoardGrid[j+1][i] &&
                    gameBoardGrid[j+1][i] === gameBoardGrid[j+2][i] &&
                    gameBoardGrid[j][i] !== null)){
                    match = true;
                    break;
                }
            }
        }

        if(match){
            return 'match';
        }else{
            let containEmptyCell = false;
            for(let i = 0; i < 3; i++){
                for(let j = 0; j < 3; j++){
                    if(gameBoardGrid[i][j] === null){
                        containEmptyCell = true;
                        break;
                    }
                }
            }

            return (containEmptyCell? 'non-match' : 'draw');
        }
    };


    return {startGame, play};
})();

const displayController = (function(){
    
    const start = () => {
        const modal = document.querySelector('dialog');
        modal.showModal();
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.addEventListener('click', (event)=>{
            event.preventDefault();
            const firstPlayerName = document.querySelector("input[name='player1Name']").value;
            const secondPlayerName = document.querySelector("input[name='player2Name']").value;
            modal.close();
            gameFlow.startGame(firstPlayerName, secondPlayerName);
        })
    };

    const renderResultsBoard = (player1, player2) => {
        const resultsBoard = document.querySelector('.results-board');
        resultsBoard.textContent = '';
        for(let i = 0; i < 2; i++){
            let playerCard = document.createElement('div');
            playerCard.classList.add('player');

            let playerName = document.createElement('h2');
            playerName.classList.add('name');
            playerName.textContent =  (i%2 === 0 ? player1.getName() : player2.getName());
            playerCard.appendChild(playerName);

            let playerScore = document.createElement('span');
            playerScore.classList.add('score');
            playerScore.textContent =  (i%2 === 0 ? player1.getScore() : player2.getScore());
            playerCard.appendChild(playerScore);

            resultsBoard.appendChild(playerCard);
        }
    };

    const renderGameBoard = () => {
        const gameBoardGrid = gameBoard.getGameBoard();
        const gameBoardContainer = document.querySelector('.game-board');
        gameBoardContainer.textContent = '';

        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                let cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.xCoordinate = i;
                cell.dataset.yCoordinate = j;
                cell.textContent = gameBoardGrid[i][j];
                cell.addEventListener('click', (event)=>{
                    let xCoordinate = event.target.dataset.xCoordinate;
                    let yCoordinate = event.target.dataset.yCoordinate;
                    gameFlow.play(xCoordinate, yCoordinate);
                });
                gameBoardContainer.appendChild(cell);
            }
        }
    };

    const renderControlBtns = () => {
        const btnsContainer = document.querySelector('.btns');

        const newGameBtn = document.createElement('button');
        newGameBtn.classList.add('new-game-btn');
        newGameBtn.textContent = 'New game';
        btnsContainer.appendChild(newGameBtn);

        const newRoundBtn = document.createElement('button');
        newRoundBtn.classList.add('new-round-btn');
        newRoundBtn.textContent = 'New round';
        btnsContainer.appendChild(newRoundBtn);
    }

    return {start, renderResultsBoard, renderGameBoard, renderControlBtns};
})();

displayController.start();
