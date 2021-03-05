
'use strict';

const socketio = require('socket.io');

const io = socketio(3005);

const game = io.of('/game');



const messageQueue = {
  sent: {},
  received: {}
}

const players = {

}

let board = {

  1: ' ',
  2: ' ',
  3: ' ',
  4: ' ',
  5: ' ',
  6: ' ',
  7: ' ',
  8: ' ',
  9: ' '

};

let startingBoard = {

  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9'

};

const winners = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7],
[2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];

function verifyWin(board) {
  let xArray = [];
  let oArray = [];
  for (let key in board) {
    if (board[key] === 'X') {
      xArray.push(key);
    }
    if (board[key] === 'O') {
      oArray.push(key);
    }
  }
  for (let i = 0; i < winners.length; i++) {
    if (winners[i] === xArray) {
      return 'X';
    }
    else if (winners[i] === oArray) {
      return 'O';
    }
  }
  return null;
}

function displayBoard(board) {
  return '\n' +
    ' ' + board[1] + ' | ' + board[2] + ' | ' + board[3] + '\n' +
    ' ---------\n' +
    ' ' + board[4] + ' | ' + board[5] + ' | ' + board[6] + '\n' +
    ' ---------\n' +
    ' ' + board[7] + ' | ' + board[8] + ' | ' + board[9] + '\n'
}



game.on('connection', (socket) => {
  console.log('New Player has joined the game on socket: ', socket.id);


  socket.on('signin', () => {

    const payload = { displayBoard: displayBoard(startingBoard), message: 'Welcome to Tic-Tac-Toe! You are player X! Please enter a number between 1 and 9 to place an X on the board.' }
    socket.emit('startgame', payload);
  })

  socket.on('signin-o', () => {

    const payload = { displayBoard: displayBoard(startingBoard), message: 'Welcome to Tic-Tac-Toe! You are player O! Please enter a number between 1 and 9 to place an O on the board. Please wait until player X has moved.' }
    socket.emit('startgame-o', payload);
  })

  socket.on('move', payload => {
    console.log(payload);

    if (board[payload.move] !== ' ' || !board[payload.move] || payload.move === null) {
      let outboundPayload = {
        player: payload.player,
        message: 'Already played or invalid number. Please try again.'
      }
      socket.emit('badmove', outboundPayload);

    } else {
      board[payload.move] = payload.player;
      console.log(board[payload.move]);

      if (verifyWin(board) === 'X' || verifyWin(board) === 'O') {

        let winner = verifyWin(board);
        let winnerPayload = { displayBoard: displayBoard(board), message: `Player ${winner} wins!` }

        game.emit('gameover', winnerPayload)
      }

      let outboundPayload = { displayBoard: displayBoard(board), message: 'Nice move! Heres the current board. Awaiting opponent move.' }
      socket.emit('goodmove', outboundPayload)

      let nextMovePayload = { displayBoard: displayBoard(board), message: `Player ${payload.player} has moved. Please enter a number between 1 and 9 to place your marker on the board. ` }
      socket.broadcast.emit('nextmove', nextMovePayload);
    }



    /*     delete messageQueue.sent[payload.messageId];
        messageQueue.received[payload.messageId]; */
  })

  /*   socket.on('getAll', payload => {
      for(let key in messageQueue.sent){
        game.emit('message', messageQueue.sent[key]);
      }
    })
  
    socket.on('pickup', payload => {
      events.eventPickup(payload);
      messageQueue.sent[payload.messageId] = payload;
      game.emit('pickup', payload);
    })
    
    socket.on('in-transit', payload => {
      events.eventIntransit(payload);
    }); 
    
    
    socket.on('delivered', payload => {
      messageQueue.sent[payload.messageId].order.event = 'delivered';
      events.eventDelivered(payload);
      game.emit('delivered', payload);
    });
  
    socket.on('subscriber', payload => {
      console.log(socket.id, `is subscribed to '${payload}'`)
      if(!subscribers[socket.id].includes(payload)){
        subscribers[socket.id].push(payload);
      };
      console.log(subscribers);
    }) */
})
