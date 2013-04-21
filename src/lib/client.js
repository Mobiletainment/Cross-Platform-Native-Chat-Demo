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
  
  socket.onmessage = function(msgEvent) {  
    console.log('Client message received: ' + msgEvent.data)
    var data = JSON.parse(msgEvent.data);
    if(data.type === 'msg') {
      client.newMessage(data.data);
    } else {
      client.addChatHistory(data.data); 
    }
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
      client.server.socket.send($(this).val());
      e.preventDefault();
    }
  });
};

/**
 * Client sends message to server
 *
 * Receives data object in format of:
 * {
 *    msg: 'String',
 *    name: 'String'
 * }
 */
client.newMessage = function(data, isHistory) {
  // add message to UI
  var $msgItem = $('<li>', {'class': 'message', 'html': data.msg});
  var $nameItem = $('<span>', {'class': 'message-name', 'html': data.name});
  if(isHistory) {
    $msgItem.addClass('history');
  }
  $('.messages').append($msgItem.prepend($nameItem));
};

/**
 * Build chat server history
 */
client.addChatHistory = function(msgs) {
  for(msg in msgs) {
    client.newMessage(msgs[msg], true);
  }
}
