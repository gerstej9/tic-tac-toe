
'use strict';

const socketio = require('socket.io');
const events = require('../index.js');

const io = socketio(3005);

const caps = io.of('/caps');

class Message{
  constructor(data){
    this.messageId = data.messageId,
    this.event = data.event,
    this.retailer = data.retailer
  }
}

const subscribers = {

}

const messageQueue = {
  sent: {},
  received: {}
}

caps.on('connection', (socket) => {
  console.log('new connection created', socket.id);

  subscribers[socket.id] = [];

  socket.on('received', payload => {
    delete messageQueue.sent[payload.messageId];
    messageQueue.received[payload.messageId];
  })

  socket.on('getAll', payload => {
    for(let key in messageQueue.sent){
      caps.emit('message', messageQueue.sent[key]);
    }
  })

  socket.on('pickup', payload => {
    events.eventPickup(payload);
    messageQueue.sent[payload.messageId] = payload;
    caps.emit('pickup', payload);
  })
  
  socket.on('in-transit', payload => {
    events.eventIntransit(payload);
  }); 
  
  
  socket.on('delivered', payload => {
    messageQueue.sent[payload.messageId].order.event = 'delivered';
    events.eventDelivered(payload);
    caps.emit('delivered', payload);
  });

  socket.on('subscriber', payload => {
    console.log(socket.id, `is subscribed to '${payload}'`)
    if(!subscribers[socket.id].includes(payload)){
      subscribers[socket.id].push(payload);
    };
    console.log(subscribers);
  })
})
