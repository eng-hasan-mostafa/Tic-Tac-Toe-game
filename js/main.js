
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

    const startGame = () => {
        initialize();
        startRound();
        gameBoard.cleanGameBoard();
        console.log(`player1 score:${player1.getScore()}`);
        console.log(`player2 score:${player2.getScore()}`);
    }

    const initialize = () => {
        let firstPlayerName = prompt('Enter first player name:');
        let firstPlayerMarker = prompt('Choose first player marker(X or O):');
        if(firstPlayerMarker.toLowerCase() !== 'x' && firstPlayerMarker.toLowerCase() !== 'o'){
            throw Error('The marker should be either x or o');
        }
        player1 = createPlayer(firstPlayerName, firstPlayerMarker.toLowerCase());
        let secondPlayerName = prompt('Enter second player name:');
        player2 = createPlayer(secondPlayerName, (firstPlayerMarker.toLowerCase() === 'x'? 'o': 'x'));

        gameBoard.cleanGameBoard();
    };

    const startRound = () => {
        let counter = 0;
        while(true){
            if(counter%2 == 0){
              //player1 turn
              let xCoordinate = prompt('Enter the x coordinate of the player1 chosen cell:');
              let yCoordinate = prompt('Enter the y coordinate of the player1 chosen cell:');
              gameBoard.markCell(xCoordinate, yCoordinate, player1.getMarker());
            }else{
              let xCoordinate = prompt('Enter the x coordinate of the player2 chosen cell:');
              let yCoordinate = prompt('Enter the y coordinate of the player2 chosen cell:');
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

gameFlow.startGame();
