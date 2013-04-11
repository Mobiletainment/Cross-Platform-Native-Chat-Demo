/**
 * Module dependencies.
 */
var _ = require('underscore');
var async = require('async');

/**
 * Server.
 */
var client = module.exports;

/**
 * Join Socketserver 
 */
client.join = function(server) {

  var socket = new window.WebSocket('ws://' + server);

  socket.onopen = function() {  
    console.log('Socket Status: ' + socket.readyState + '(open)');
    socket.send('Ping');
  }; 
  
  socket.onmessage = function(msg) {  
    console.log('Server: ' + msg.data)
  }; 

  socket.onerror = function(error) {
    console.log('Websocket Error ' + error);
  };
  
  socket.onclose = function() {  
    console.log('Socket Status: ' + socket.readyState + '(close)');
  };

};
