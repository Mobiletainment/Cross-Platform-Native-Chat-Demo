/**
 * Module dependencies.
 */
var _ = require('underscore');
var async = require('async');
var $ = require('jquery-browserify')

/**
 * Server.
 */
var client = module.exports;

/**
 * Join Socketserver 
 * @Infos: 
 * https://developer.mozilla.org/en-US/docs/WebSockets/WebSockets_reference/WebSocket#Ready_state_constants
 */
client.join = function(server) {

  var socket = new window.WebSocket('ws://' + server);

  socket.onopen = function() {  
    client.ui();
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

/**
 * Creating Chat UI
 */
client.ui = function() {

  var chatTemplate = _.template($('script.template-chat').html());
  $('.content').html(chatTemplate);

};
