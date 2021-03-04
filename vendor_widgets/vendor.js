'use strict';

const io = require('socket.io-client');
const faker = require('faker');
const events = require('../index.js');

const hostURL = 'http://localhost:3005/caps';
const socket = io.connect(hostURL);

const store = 'Acme Widgets'

socket.emit('getAll');

socket.on('message', payload => {
  if(payload.order.retailer === store && payload.order.event === 'delivered'){
    console.log(payload);
    events.vendorDelivered(payload);
    socket.emit('received', payload);
    socket.emit('subscriber', 'messages');
  }
  
})

setInterval(() => {
  socket.emit('pickup', {messageId: faker.random.uuid(), order: {retailer: store, event: 'pickup', orderId: faker.random.uuid(),customerName: `${faker.name.firstName()} ${faker.name.lastName()}`, address: `${faker.address.streetAddress()}, ${faker.address.city()}`}})
}, 5000);

socket.on('delivered', payload => {
  if(payload.order.retailer === store){
    events.vendorDelivered(payload);
    socket.emit('received', payload);
    socket.emit('subscriber', 'delivered');
  }
});

