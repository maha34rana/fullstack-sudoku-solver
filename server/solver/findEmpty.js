function findEmpty(board){
    //loop through each row
    for(let row = 0;row<9;row++){
        //loop through each colum
        for(let col=0;col<9;col++){
            if(board[row][col]==0){
                //return position of empty cell
                return [row,col];
            }
        }
    }
    //no empty cell found
    return null;
}

module.exports = findEmpty;