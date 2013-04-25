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
 * @See: 
 * https://developer.mozilla.org/en-US/docs/WebSockets/WebSockets_reference/WebSocket#Ready_state_constants
 */
client.join = function(serverIP, port) {

  var socket = new window.WebSocket('ws://' + serverIP + ':' + port);

  this.server.ip = serverIP;
  this.server.port = port;
  this.server.socket = socket;

  socket.onopen = function() {  
    client.buildUI();
    console.log('Client Socket Status: ' + socket.readyState + '(open)');
  }; 
  
  socket.onmessage = function(msgEvent) {  
    console.log('Client message received: ' + msgEvent.data)
    var data = JSON.parse(msgEvent.data);
    if(data.type === 'msg') {
      client.newMessage(data.data);
    } else  if(data.type === 'name') {
      $el = $('[data-id='+data.data.id+']'); 
      $el.find('span').text(data.data.name);
      $el.attr('data-model', JSON.stringify(data.data));
    } else  if(data.type === 'color') {
      $el = $('[data-id='+data.data.id+']'); 
      $el.find('span').css('color', data.data.color);
      $el.attr('data-model', JSON.stringify(data.data));
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
client.buildUI = function() {

  // display the server ip and port we're connected to
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
      } else if(client.singleMessage) {
        msg.type = 'single';
        msg.receiver = client.singleMessage.id;
        client.singleMessage = false;
      }

      client.server.socket.send(JSON.stringify(msg));
      $(this).val('');
      $(this).attr('placeholder', 'type in your message');
      $(this).parent().css('border', 'none');
      e.preventDefault();
    }
  });

  $('.message-name').live('click', function() {
    if($(this).parent().hasClass('history')) return null;
    var $el = $('.messenger');
    var data = $(this).parent().data('model');
    client.singleMessage = data;
    $el.css('border', 'solid 4px '+data.color);
    $el.find('input').attr('placeholder', 'message to '+data.name+' :').focus();
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
    $msgItem.attr('data-model', JSON.stringify(data));
    $nameItem.css('color', data.color)
  }
  $messages.append($msgItem.prepend($nameItem));
  $messages.scrollTop($messages[0].scrollHeight);
};

/**
 * Build chat server history
 */
client.addChatHistory = function(msgs) {
  console.log(msgs);
  for(msg in msgs) {
    client.newMessage(msgs[msg], true);
  }
}
