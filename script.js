var board,
  game = new Chess(),
  statusEl = $('#status'),
  fenEl = $('#fen'),
  pgnEl = $('#pgn-moves'),
  toggleEI = $('#toggle'),
  colorsEI = $('#col1');
  //var instructions = $('#recording-instructions');
  console.log("this is new code10");
  var elem = document.getElementById('col1');
  console.log(elem.selectedIndex);
try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
}
catch(e) {
  console.error(e);
  alert('Audio move is not supported by your browser. Try in Google Chrome');
}
var text_move_map = new Map(
	[
		["N","knight"],
		["B","bishop"],
		["Q","queen"],
		["K","king"],
		["R","rook"],
		["x","takes"],
		["O-O","king side castle"],
		["O-O-O","longcastle"],
		["#","checkmate"]
	]
);
var audio_move_map = new Map(
	[
		["night", "N"], 
		["knight", "N"],
		["bishop", "B"],
		["bisup", "B"],
		["queen","Q"],
		["king","K"],
		["rook","R"],
		["ruk","R"],
		["mi","e"],
		["takes","x"],
		["shortcastle","O-O"],
		["longcastle","O-O-O"],
		["83","a3"],
		["bp","b5"],
		["dp","d5"],
		["depot","d4"],
		["before","b4"],
		["befur","b4"],
		["text","takes"],
		["the","d"],
		["intex","Kx"],
		["apple","a"],
		["ball","b"],
		["cat","c"],
		["dog","d"],
		["elephant","e"],
		["fish","f"],
		["grapes","g"],
		["hen","h"],
		["beeffry","Bf5"],
		["take","takes"],
		["ate","8"],
		["de","d"],
		["file","5"]
	]
);
console.log("audio_move_map"); 
console.log(audio_move_map); 
audio_keys = Array.from( audio_move_map.keys() );
console.log(audio_keys); 
txt = "NIGHT F3"
mv = txt.toLowerCase().replace(/\s/g, '');
console.log("=== " + mv);



var arrayLength = audio_keys.length;
mv1 = mv
for (var i = 0; i < arrayLength; i++) {
    if (mv1.includes(audio_keys[i])) {
		mv = mv.replace(audio_keys[i],audio_move_map.get(audio_keys[i]))
	}
    //Do something
}
console.log("finally -- " + mv)
move = "Nxf7"
for (var i = 0; i < move.length; i++) {
		txt = text_move_map.get(move[i])
		if (txt === null) {
			txt = move[i]
		}
		console.log(txt)
	}
	
// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses. 
recognition.continuous = true;

// This block is called every time the Speech APi captures a line. 
recognition.onresult = function(event) {

  // event is a SpeechRecognitionEvent object.
  // It holds all the lines we have captured so far. 
  // We only need the current one.
  var current = event.resultIndex;

  // Get a transcript of what was said.
  var transcript = event.results[current][0].transcript;

  // Add the current transcript to the contents of our Note.
  // There is a weird bug on mobile, where everything is repeated twice.
  // There is no official solution so far so we have to handle an edge case.
	var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

  if(!mobileRepeatBug) {
	mv = transcript.toLowerCase().replace(/\s/g, '');
	var ret = game.move(mv)
	//console.log(ret)
	if (ret === null) {
		var arrayLength = audio_keys.length;
		mv1 = mv
		for (var i = 0; i < arrayLength; i++) {
			if (mv1.includes(audio_keys[i])) {
				mv = mv.replace(audio_keys[i],audio_move_map.get(audio_keys[i]))
			}
			
		}
		var ret = game.move(mv)
		if (ret === null) {
			alert("Illegal move! We heard you as " + transcript + " and interpreted as " + mv);
			return
		}
	}
	updateStatus();
	//instructions.text("We heard you as " + transcript + " and interpreted as " + mv);
	//getResponseMove();
	getMove()

  }
};	
//recognition.onstart = function() { 
//  instructions.text('Voice recognition activated. Try speaking into the microphone.');
//}

//recognition.onspeechend = function() {
//  instructions.text('You were quiet for a while so voice recognition turned itself off.');
//}

//recognition.onerror = function(event) {
//  if(event.error == 'no-speech') {
//    instructions.text('No speech was detected. Try again.');  
//  };
//}



/*-----------------------------
      App buttons and input 
------------------------------*/

$('#start-record-btn').on('click', function(e) {
  recognition.start();
});
/*-----------------------------
      Speech Synthesis 
------------------------------*/

function readOutLoud(message) {
	var speech = new SpeechSynthesisUtterance();

  // Set the text and voice attributes.
	speech.text = message;
	speech.volume = 1;
	speech.rate = 1;
	speech.pitch = 1;
  
	window.speechSynthesis.speak(speech);
}
//document.getElementById("status").innerHTML = "this is new code";

// do not pick up pieces if the game is over
// only pick up pieces for the side to move

var minimaxRoot =function(depth, game, isMaximisingPlayer) {

    var newGameMoves = game.ugly_moves();
    var bestMove = -9999;
    var bestMoveFound;

    for(var i = 0; i < newGameMoves.length; i++) {
        var newGameMove = newGameMoves[i]
        game.ugly_move(newGameMove);
        var value = minimax(depth - 1, game, -10000, 10000, !isMaximisingPlayer);
        game.undo();
        if(value >= bestMove) {
            bestMove = value;
            bestMoveFound = newGameMove;
        }
    }
    return bestMoveFound;
};

var minimax = function (depth, game, alpha, beta, isMaximisingPlayer) {
    positionCount++;
    if (depth === 0) {
        return -evaluateBoard(game.board());
    }

    var newGameMoves = game.ugly_moves();

    if (isMaximisingPlayer) {
        var bestMove = -9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.max(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            alpha = Math.max(alpha, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    } else {
        var bestMove = 9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.min(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            beta = Math.min(beta, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    }
};

var evaluateBoard = function (board) {
    var totalEvaluation = 0;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i ,j);
        }
    }
    return totalEvaluation;
};

var reverseArray = function(array) {
    return array.slice().reverse();
};

var pawnEvalWhite =
    [
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
        [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
        [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
        [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
        [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
        [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
        [0.5,  1.0, 1.0,  -2.0, -2.0,  1.0,  1.0,  0.5],
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
    ];

var pawnEvalBlack = reverseArray(pawnEvalWhite);

var knightEval =
    [
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
        [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
        [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
        [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
        [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
        [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
        [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
    ];

var bishopEvalWhite = [
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
    [ -1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
    [ -1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
    [ -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
    [ -1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

var bishopEvalBlack = reverseArray(bishopEvalWhite);

var rookEvalWhite = [
    [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
    [  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
];

var rookEvalBlack = reverseArray(rookEvalWhite);

var evalQueen = [
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [  0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [ -1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

var kingEvalWhite = [

    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [  2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0 ],
    [  2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0 ]
];

var kingEvalBlack = reverseArray(kingEvalWhite);




var getPieceValue = function (piece, x, y) {
    if (piece === null) {
        return 0;
    }
    var getAbsoluteValue = function (piece, isWhite, x ,y) {
        if (piece.type === 'p') {
            return 10 + ( isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x] );
        } else if (piece.type === 'r') {
            return 50 + ( isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x] );
        } else if (piece.type === 'n') {
            return 30 + knightEval[y][x];
        } else if (piece.type === 'b') {
            return 30 + ( isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x] );
        } else if (piece.type === 'q') {
            return 90 + evalQueen[y][x];
        } else if (piece.type === 'k') {
            return 900 + ( isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x] );
        }
        throw "Unknown piece type: " + piece.type;
    };

    var absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x ,y);
    return piece.color === 'w' ? absoluteValue : -absoluteValue;
};

var getMove = function () {
	//renderMoveHistory(game.history());
    window.setTimeout(makeBestMove, 250);
};
var onDragStart = function(source, piece, position, orientation) {
  if (game.game_over() === true ||
      (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
};

var onDrop = function(source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return 'snapback';

  updateStatus();
  //getResponseMove();
  //renderMoveHistory(game.history());
    window.setTimeout(makeBestMove, 250);
};
var makeWhiteFirstRandomMove = function () {
    var moves = game.moves();
	var move = moves[Math.floor(Math.random() * moves.length)];
	game.move(move);
    board.position(game.fen());
	updateStatus();
   // renderMoveHistory(game.history());
    if (game.game_over()) {
        alert('Game over');
    }
};
var makeBestMove = function () {
    var bestMove = getBestMove(game);
	
	
    game.ugly_move(bestMove);
    board.position(game.fen());
	updateStatus();
	var pgn = game.pgn().split(" ");
    var move = pgn[pgn.length - 1];
	console.log(move)
	for (var i = 0; i < move.length; i++) {
		txt = text_move_map.get(move[i])
		if (txt == null) {
			txt = move[i]
		}
		readOutLoud(txt);
	}
	for (var i = 0; i < move.length; i++) {
		
		
	}
   // renderMoveHistory(game.history());
    if (game.game_over()) {
        alert('Game over');
    }
};
var positionCount;
var getBestMove = function (game) {
    if (game.game_over()) {
        alert('Game over');
    }

    positionCount = 0;
    //var depth = parseInt($('#search-depth').find(':selected').text());
	var e = document.getElementById("sel1");
	var depth = e.options[e.selectedIndex].value;
    var d = new Date().getTime();
    var bestMove = minimaxRoot(depth, game, true);
    var d2 = new Date().getTime();
    var moveTime = (d2 - d);
    var positionsPerS = ( positionCount * 1000 / moveTime);

    $('#position-count').text(positionCount);
    $('#time').text(moveTime/1000 + 's');
    $('#positions-per-s').text(positionsPerS);
    return bestMove;
};
var renderMoveHistory = function (moves) {
    var historyElement = $('#move-history').empty();
    historyElement.empty();
    for (var i = 0; i < moves.length; i = i + 2) {
        historyElement.append('<span>' + moves[i] + ' ' + ( moves[i + 1] ? moves[i + 1] : ' ') + '</span><br>')
    }
    historyElement.scrollTop(historyElement[0].scrollHeight);

};
// update the board position after the piece snap
// for castling, en passant, pawn promotion
var onSnapEnd = function() {
    board.position(game.fen());
};

var updateStatus = function() {
  var status = '';

  var moveColor = 'White';
  if (game.turn() === 'b') {
    moveColor = 'Black';
  }

  // checkmate?
  if (game.in_checkmate() === true) {
    status = 'Game over, ' + moveColor + ' is in checkmate.';
  }

  // draw?
  else if (game.in_draw() === true) {
    status = 'Game over, drawn position';
  }

  // game still on
  else {
    status = moveColor + ' to move';

    // check?
    if (game.in_check() === true) {
      status += ', ' + moveColor + ' is in check';
    }
  }

  setStatus(status);
  getLastCapture();
  //createTable();
  //updateScroll();

  statusEl.html(status);
  fenEl.html(game.fen());
  pgnEl.html(game.pgn());
};

var cfg = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  orientation: elem.options[elem.selectedIndex].value
};

var randomResponse = function() {
    fen = game.fen()
    $.get($SCRIPT_ROOT + "/move/" + fen, function(data) {
        game.move(data, {sloppy: true});
//        board.position(game.fen());
        updateStatus();
    })
}

var getResponseMove = function() {
    var e = document.getElementById("sel1");
    var depth = e.options[e.selectedIndex].value;
    fen = game.fen()
    //console.log($SCRIPT_ROOT + "/move/" + depth + "/" + fen)
    $.get($SCRIPT_ROOT + "/move/" + depth + "/" + fen, function(data) {
        game.move(data, {sloppy: true});
        updateStatus();
        // This is terrible and I should feel bad. Find some way to fix this properly.
        // The animations would stutter when moves were returned too quick, so I added a 100ms delay before the animation
        setTimeout(function(){ board.position(game.fen()); }, 100);
    })
}


// did this based on a stackoverflow answer
// http://stackoverflow.com/questions/29493624/cant-display-board-whereas-the-id-is-same-when-i-use-chessboard-js
setTimeout(function() {

    board = ChessBoard('board', cfg);
//    updateStatus();
}, 0);


var setPGN = function() {
  var table = document.getElementById("pgn");

  var pgn = game.pgn().split(" ");
    var move = pgn[pgn.length - 1];
}

var createTable = function() {

    var pgn = game.pgn().split(" ");

    var data = [];

    for (i = 0; i < pgn.length; i += 3) {
        var index = i / 3;
        data[index] = {};
        for (j = 0; j < 3; j++) {
            var label = "";
            if (j === 0) {
                label = "moveNumber";
            } else if (j === 1) {
                label = "whiteMove";
            } else if (j === 2) {
                label = "blackMove";
            }
            if (pgn.length > i + j) {
                data[index][label] = pgn[i + j];
            } else {
                data[index][label] = "";
            }
        }
    }
    //console.log(data)
    $('#pgn tr').not(':first').remove();
    var html = '';
    for (var i = 0; i < data.length; i++) {
                html += '<tr><td>' + data[i].moveNumber + '</td><td>'
                + data[i].whiteMove + '</td><td>'
                + data[i].blackMove + '</td></tr>';
    }
    //console.log(html)
    $('#pgn tr').first().after(html);
}

var updateScroll = function() {
    $('#moveTable').scrollTop($('#moveTable')[0].scrollHeight);
}

var setStatus = function(status) {
  //document.getElementById("status").innerHTML = status;
}



var takeBack = function() {
    game.undo();
    if (game.turn() != "w") {
        game.undo();
    }
    board.position(game.fen());
    updateStatus();
}

var newGame = function() {
    game.reset();
    var cfg = {
      draggable: true,
      position: 'start',
      onDragStart: onDragStart,
      onDrop: onDrop,
      onSnapEnd: onSnapEnd,
      orientation: elem.options[elem.selectedIndex].value
    };
    board = ChessBoard('board', cfg);
    updateStatus();
}

var getCapturedPieces = function() {
    var history = game.history({ verbose: true });
    for (var i = 0; i < history.length; i++) {
        if ("captured" in history[i]) {
            if (history[index] === null) {
                continue;
            }
            console.log(history[i]["captured"]);
        }
    }
}

var getLastCapture = function() {
    var history = game.history({ verbose: true });
    var index = history.length - 1;
    if (history[index] === undefined) {
        return;
    }
    if ("captured" in history[index]) {
        console.log(history[index]["captured"]);
    }
}




