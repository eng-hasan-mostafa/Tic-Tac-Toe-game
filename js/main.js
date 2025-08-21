
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
            throw Error('The selected cell is outside the game board range.')
        }
        gameBoardGrid[xCoordinate][yCoordinate] = marker;
    }

    const cleanGameBoard = () => {
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                gameBoardGrid[i][j] = null;
            }
        }
    }


    return {getGameBoard, markCell, cleanGameBoard};
})();