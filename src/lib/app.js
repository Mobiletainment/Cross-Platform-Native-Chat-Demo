/**
 * Dependencies.
 */
var _ = require('underscore');
var async = require('async');
var $ = require('jquery-browserify')
var io = require('socket.io').listen(8080);

/**
 * Start app Object
 */
var app = {};

/**
 * Initialize App
 */
app.init = function() {

  $('.create-server').click(function(e) {
    app.startServer();  
  });

  $('.join-server').click(function(e) {
    var $ipInput = $('<input>', {'class': 'input-serverip'})
    $ipInput.insertAfter('.join-server').focus();

    $ipInput.on('keypress', function(e) {
      if(e.which == 13) {
        app.joinServer(e.target.value);
      }
    });
  });

};

/**
 * Starting a Server
 */
app.startServer = function() {
  console.log('creating Server');

  io.sockets.on('connection', function(socket) {

    console.log('someone connected to server');

    io.sockets.emit('this', { will: 'be received by everyone'});

    socket.on('private message', function (from, msg) {
      console.log('I received a private message by ', from, ' saying ', msg);
    });

    socket.on('disconnect', function () {
      io.sockets.emit('user disconnected');
    });

  });
};

/**
 * Joining a Server
 */
app.joinServer = function(server) {
  console.log('joining server');

  var chat = io.connect('http://' + server);

  // When the connection is open, send some data to the server
  chat.on('connect', function () {
    console.log('connected to server');
  });

};

/**
 * Start App
 */
app.init();


