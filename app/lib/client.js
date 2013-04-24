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
    console.log(data.data);
    if(data.type === 'msg') {
      client.newMessage(data.data);
    } else  if(data.type === 'name') {
      $('[data-id='+data.data.id+']').find('span').text(data.data.name);
    } else  if(data.type === 'color') {
      $('[data-id='+data.data.id+']').css('color', data.data.color);
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
  var $serverIP = $('<span>', {'class': 'server-ip', 'html': this.server.ip + ':' + this.server.port});
  $('h1').append($serverIP);

  var chatTemplate = _.template($('script.template-chat').html());
  $('.content').html(chatTemplate);

  $('.messenger input').focus().on('keypress', function(e) {
    if(e.which == 13) {
      var value = $(this).val();
      var command = value.split(' ')[0];
      var commandValue = value.split(' ')[1];

      var msg = {
        type: 'msg',
        data: value
      };

      if(command === ':name') {
          msg.type = 'name';
          msg.data = commandValue;
      } else if(command === ':color') {
          msg.type = 'color';
          msg.data = commandValue;
      } 

      client.server.socket.send(JSON.stringify(msg));
      $(this).val('');
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
  var $messages = $('.messages');
  if(isHistory) {
    $msgItem.addClass('history');
  } else {
    $msgItem.attr('data-id', data.id);
    $msgItem.css('color', data.color)
  }
  $messages.append($msgItem.prepend($nameItem));
  $messages.scrollTop($messages[0].scrollHeight);
};

/**
 * Build chat server history
 */
client.addChatHistory = function(msgs) {
  for(msg in msgs) {
    client.newMessage(msgs[msg], true);
  }
}
