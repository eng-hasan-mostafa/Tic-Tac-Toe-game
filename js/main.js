
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

    const startGame = (firstPlayerName, secondPlayerName) => {
        initialize(firstPlayerName, secondPlayerName);
        startRound();
        gameBoard.cleanGameBoard();
        console.log(`player1 score:${player1.getScore()}`);
        console.log(`player2 score:${player2.getScore()}`);
    }

    const initialize = (firstPlayerName, secondPlayerName) => {
        player1 = createPlayer(firstPlayerName, 'x');
        player2 = createPlayer(secondPlayerName, 'o');
        displayController.renderResultsBoard(player1, player2);
        gameBoard.cleanGameBoard();
        displayController.renderGameBoard();
        displayController.renderControlBtns();
    };

    const startRound = () => {
        let counter = 0;    
        while(true){
            if(counter%2 == 0){
              //player1 turn
              let xCoordinate = 1;
              let yCoordinate = 2;
              gameBoard.markCell(xCoordinate, yCoordinate, player1.getMarker());
            }else{
              let xCoordinate = 1;
              let yCoordinate = 1;
              gameBoard.markCell(xCoordinate, yCoordinate, player2.getMarker());
            }
            if(checkRoundResult() === 'match'){
                let winner = (counter%2 == 0 ? player1 : player2);
                winner.increaseScore();
                console.log(`${winner.getName()} WINS! score:${winner.getScore()}`);
                break;
            }else if(checkRoundResult() === 'draw'){
                console.log(`It's a DRAW!`);
                break;
            }
            counter++;
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


    return {startGame, startRound};
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
        const mainContainer = document.querySelector('.container');
        const resultsBoard = document.createElement('div');
        resultsBoard.classList.add('results-board');
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
        mainContainer.appendChild(resultsBoard);
    };

    const renderGameBoard = () => {
        const gameBoardGrid = gameBoard.getGameBoard();
        const mainContainer = document.querySelector('.container');
        const gameBoardContainer = document.createElement('div');
        gameBoardContainer.classList.add('game-board');
        
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                let cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.xCoordinate = i;
                cell.dataset.yCoordinate = j;
                cell.textContent = gameBoardGrid[i][j];
                gameBoardContainer.appendChild(cell);
            }
        }
        mainContainer.appendChild(gameBoardContainer);
    };

    const renderControlBtns = () => {
        const mainContainer = document.querySelector('.container');
        const btnsContainer = document.createElement('div');
        btnsContainer.classList.add('btns');

        const newGameBtn = document.createElement('button');
        newGameBtn.classList.add('new-game-btn');
        newGameBtn.textContent = 'New game';
        btnsContainer.appendChild(newGameBtn);

        const newRoundBtn = document.createElement('button');
        newRoundBtn.classList.add('new-round-btn');
        newRoundBtn.textContent = 'New round';
        btnsContainer.appendChild(newRoundBtn);

        mainContainer.appendChild(btnsContainer);
    }

    return {start, renderResultsBoard, renderGameBoard, renderControlBtns};
})();

displayController.start();
