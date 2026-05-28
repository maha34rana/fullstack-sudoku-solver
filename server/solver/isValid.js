function isValid(board,num,row,col){

    //check row
    for(let x=0;x<9;x++){
        
        if(board[row][x]==num){
            return false;
        }
    }

    //check column
    for(let x=0;x<9;x++){

        if(board[x][col]==num){
            return false;
        }
    }

    const startRow = Math.floor(row/3)*3;
    const startCol = Math.floor(col/3)*3;




//check 3x3 box

for(let i=startRow;i<startRow+3;i++){
    for(let j=startCol;j<startCol+3;j++){
        if(board[i][j]==num){
            return false;
        }
    }
}

return true;
}

module.exports = isValid;