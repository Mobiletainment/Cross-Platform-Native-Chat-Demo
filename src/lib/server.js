/**
 * Module dependencies.
 */
var _ = require('underscore');
var async = require('async');
var WebSocketServer = require('websocket').server;
var http = require('http');

/**
 * Server.
 */
var server = module.exports;

/**
 * Start Socketserver
 */
server.start = function() {

  var server = http.createServer(function(req, res) {
    console.log((new Date()) + ' Received request for ' + request.url);
  });

  server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
  })

  wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
  });

  wsServer.on('request', function(request) {

    var connection = request.accept(null, request.origin);

    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', function(message) {
      if(message.type === 'utf8') {
        console.log('Received Message: ' + message.utf8Data);
        connection.sendUTF(message.utf8Data);
      }
    });

    connection.on('close', function(reasonCode, description) {
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });

  });
};


