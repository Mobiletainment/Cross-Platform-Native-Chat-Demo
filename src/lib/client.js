/**
 * Module dependencies.
 */
var _ = require('underscore');
var async = require('async');
var $ = require('jquery-browserify')

/**
 * Client
 */
var client = module.exports;

/**
 * server properties
 */
client.server = {};

/**
 * Join Socketserver 
 * @Infos: 
 * https://developer.mozilla.org/en-US/docs/WebSockets/WebSockets_reference/WebSocket#Ready_state_constants
 */
client.join = function(serverIP, port) {

  var socket = new window.WebSocket('ws://' + serverIP + ':' + port);

  this.server.ip = serverIP;
  this.server.port = port;
  this.server.socket = socket;

  socket.onopen = function() {  
    client.buildIU();
    console.log('Client Socket Status: ' + socket.readyState + '(open)');
  }; 
  
  socket.onmessage = function(msg) {  
    console.log('Client message received: ' + msg.data)
    client.newMessage(msg.data, true);
  }; 

  socket.onerror = function(error) {
    console.log('Client Websocket Error ' + error);
  };
  
  socket.onclose = function() {  
    console.log('Client Socket Status: ' + socket.readyState + '(close)');
  };

};

/**
 * Building Chat UI
 */
client.buildIU = function() {

  // add server ip
  var $serverIP = $('<span>', {'class': 'serverip', 'html': this.server.ip + ':' + this.server.port});
  $('h1').after($serverIP);

  var chatTemplate = _.template($('script.template-chat').html());
  $('.content').html(chatTemplate);

  $('.messenger input').on('keypress', function(e) {
    if(e.which == 13) {
      client.newMessage($(this).val());
      e.preventDefault();
    }
  });
};

/**
 * Client sends message to server
 */
client.newMessage = function(msg, fromServer) {
  var socket = this.server.socket;
  if(!fromServer) {
    socket.send(msg);
  }

  // add message to UI
  var $msgItem = $('<li>', {'class': 'message', 'html': msg});
  $('.messages').append($msgItem);
};

