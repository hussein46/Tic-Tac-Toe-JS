
//Java script portion to create tic tac toe game
const xPlayer=-1;
const oPlayer=1;
const openSpot=0;
var board; //represents the board
var turn;  //hold current turn
var humanPlayer; 
var computerPlayer;
var gameEnd; //store game termination 

// window.onload = function(){ //start game up as soon as page loads
// 	createChoosingMenu();  
// }
function createChoosingMenu(){
	document.getElementById("choosingMenu").innerHTML=
	`Choose either X or O to start game  
	<button onClick="setPlayer(xPlayer)">X</button>
    <button onClick="setPlayer(oPlayer)">O</button> 
    `;
}

//create blank table at the start of a new game
function createTable(){ 
	var tableText = "<table>";
	var num=0;
	board =[];
	for (var i = 0; i <3; i++) {
		 tableText += "<tr>";
		for (var j = 0; j <3; j++){  
			num =i*3+j;
			tableText += "<td id='box"+num+"' onClick='humanMove("+num+")'></td>";		
			board.push(openSpot);
		}
		tableText += "</tr>";
	}
	tableText += "</table>";
	document.getElementById("gameBoard").innerHTML = tableText;
}

function getWinner(lboard){
	for (var i = 0; i <3; i++) {
		//horizontal win
		if(lboard[i*3]!=openSpot &&lboard[i*3]===lboard[i*3+1] && lboard[i*3+1]===lboard[i*3+2]) 
			return lboard[i*3];		
		//vertical win	
		if(lboard[i]!=openSpot && lboard[i]===lboard[i+3] && lboard[i+3]===lboard[i+6]) 
			return lboard[i];
	}
	//diagonal win
	if((lboard[4] !== openSpot) && (lboard[0]===lboard[4] && lboard[4]===lboard[8] || lboard[2]===lboard[4] && lboard[4]===lboard[6]))
		return lboard[4]; //diagonal always win through middle
	return openSpot;
}

function createGame() {
	createTable();	
	turn =xPlayer; //x player always start
	computerPlayer =(humanPlayer===oPlayer)?xPlayer:oPlayer;
	document.getElementById("hint").innerHTML="";
	gameEnd =false;
}

//Function handles the even where the human makes a move by clicking a tile
function humanMove(boardNum){
	if(gameEnd) //don't let player move after game ended
		return;
	if(humanPlayer === turn ){
		if(board[boardNum]===openSpot) //if board open then set box
			setTile(humanPlayer,boardNum);
		else
			document.getElementById("hint").innerHTML="That place is not open";
	}
	else
		document.getElementById("hint").innerHTML="It is not your turn";
}

function setTile(playerNum,boardNum){
	var tile = document.getElementById("box"+boardNum);
	board[boardNum] = playerNum;
	tile.innerText= (playerNum===xPlayer)?'X':'O';
	var winner=getWinner(board);
	if(movesDone(board)===9 || winner!=openSpot) //if tie or have winner then terminate
		showWinner(winner);
	else{
		turn = (turn===xPlayer)?oPlayer:xPlayer; //switch turn
		if(turn === computerPlayer) //if computer turn the computer will move
			computerMove();
	}
}

//handle ai movement
function computerMove(){
	var move = findBestMove(board,movesDone(board),computerPlayer);
	setTile(computerPlayer,move.index);	
}

function movesDone(gameBoard){
	var num=0;
	for(var i=0;i<9;i++){
		if(gameBoard[i]===openSpot) 
			num++;
	}
	return 9-num;
}

function showWinner(winner){
	if(winner===openSpot)
		document.getElementById("hint").innerHTML="Tie game";
	if(winner===humanPlayer)
		document.getElementById("hint").innerHTML="You won!";
	if(winner===computerPlayer)
		document.getElementById("hint").innerHTML="You lose:(";
	gameEnd=true;
}

function setPlayer(playerNum){ //choose your player
	humanPlayer=playerNum;
	//remove ability to choose and add ability to play and replay
	document.getElementById("choosingMenu").innerHTML=`
	<button onClick="createChoosingMenu()">Replay</button>
	<div id='gameBoard'></div>	
	<div id="hint"></div>`;
	createGame();
	if(computerPlayer==xPlayer) //player who is playing 'X' always goes first
		computerMove();
}

//Use alpha-beta algorithm to determine winner of game
function findBestMove(gameBoard, depth, playerNum,alpha, beta) {
	var winner = getWinner(gameBoard)*30; 
	if(winner !== openSpot)
		return {score: (winner+(playerNum*depth))};
	if(depth === 9)
		return {score: 0};
	var move={};
	var bestMove={}; //find best move
	bestMove.score= (playerNum === oPlayer)?-10000:10000;
	if (alpha==undefined){ //set alpha and beta for pruning
		alpha = -10000;
		beta  =  10000;
	}
	for (var i = 0; i < 9; i++) {
		if(gameBoard[i]===openSpot){
			var localBoard = JSON.parse(JSON.stringify(gameBoard)); //deep copy array
			localBoard[i] = playerNum;
			move = findBestMove(localBoard,depth+1, -playerNum,alpha,beta);
			move.index=i;
			if(move.score >bestMove.score && playerNum === oPlayer){
				bestMove =move;
				alpha = Math.max(alpha,bestMove.score);
			}
			if (move.score <bestMove.score && playerNum === xPlayer)  {
				bestMove =move;
				beta = Math.min(beta,bestMove.score);
			}
			if(beta<alpha)
				break;
		}
	}	
	return bestMove;
}

