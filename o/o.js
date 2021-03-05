'use strict';

const io = require('socket.io-client');

const {prompt} = require ('enquirer');

const hostURL = 'http://localhost:3005/game';
const socket = io.connect(hostURL);

const player = 'O';


socket.emit('signin-o');

socket.on('startgame-o', payload => {
  console.log(payload.displayBoard);
  console.log(payload.message);


});

socket.on('badmove', payload => {
  console.log(payload.message);

  prompt({
    type: 'input',
    name: 'move',
    message: 'Please enter a number (1-9).'
  })
   .then(answer => {
     payload = { 
       player: player, 
       move: Number(answer.move) 
    }
     socket.emit('move', payload)
     
  }).catch(err => console.error(err));

})

socket.on('goodmove', payload => {
  console.log(payload.displayBoard);
  console.log(payload.message);
})

socket.on('nextmove', payload => {
  console.log(payload.displayBoard);
  console.log(payload.message);

  prompt({
    type: 'input',
    name: 'move',
    message: 'Please enter a number (1-9).'
  }).then(answer => {
     payload = { 
       player: player, 
       move: Number(answer.move) 
    }
     socket.emit('move', payload)
  }).catch(err => console.error(err));
})

socket.on('gameover', payload => {
  console.log(payload.displayBoard);
  console.log(payload.message);
})