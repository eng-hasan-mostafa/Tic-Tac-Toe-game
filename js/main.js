
function createUser(name){

    const getName = () => name;
    return {getName};
}

function createPlayer(name, marker){
    
    const {getName} = createUser(name);
    let  score = 0;

    const getMarker = () => marker;
    const getScore = () => score;
    const increaseScore = () => ++score;

    return {getName, getMarker, getScore, increaseScore}
}