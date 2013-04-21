/**
 * Module dependencies.
 */
var _ = require('underscore');
var async = require('async');
var WebSocketServer = require('websocket').server;
var http = require('http');
var DBStorage = require('./dbStorage');

/**
 * Expose 'Server'.
 */
var server = module.exports;

/**
 * Connections
 */
server.connections = {};

/**
 * Start Socketserver
 */
server.start = function() {

  var httpServer = http.createServer(function(req, res) {
    console.log((new Date()) + ' Received request for ' + request.url);
  });

  httpServer.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
  })

  wsServer = new WebSocketServer({
    httpServer: httpServer,
    autoAcceptConnections: false
  });

  // Create new Storage
  var db = new DBStorage();

  var connectionIDCounter = 0;

  wsServer.on('request', function(request) {

    var connection = request.accept(null, request.origin);

    // Store a reference to the connection using a connection ID
    connection.id = connectionIDCounter++;
    // Give connection a name
    connection.name = 'guest';
    // Give connection an ID
    server.connections[connection.id] = connection;

    console.log((new Date()) + 'Server Connection ID ' + connection.id + ' accepted.');

    // Send chat history to client
    server.sendData(connection, db.storage, 'history');

    // On receiving a message from client
    connection.on('message', function(message) {
      if(message.type === 'utf8') {
        console.log('Server Received Message: ' + message.utf8Data);
        server.broadcast(connection, message.utf8Data);
        db.newChatEntry(connection.name, message.utf8Data);
      }
    });

    // On client leaving the chat
    connection.on('close', function(reasonCode, description) {
      console.log((new Date()) + 'Server Peer ' + connection.remoteAddress + ' disconnected.');

      // Make sure to remove closed connections from the global pool
      delete server.connections[connection.id];
    });

  });
};

/**
 * Sends formated data to client
 *
 * Server sends data objects in format of:
 * {
 *    type: 'msg|history',
 *    data: 'String|Array|Object' 
 * }
 */
server.sendData = function(connection, data, type) {
  connection.send(JSON.stringify({
    type: type || 'msg',
    data: data
  }));
};

/**
 * Broadcast to all open connections
 *
 * Sends data objects in format of:
 * {
 *    msg: 'String',
 *    name: 'String'
 * }
 */
server.broadcast = function(fromConnection, msg) {
  Object.keys(server.connections).forEach(function(key) {
    var connection = server.connections[key];
    if (connection.connected) {
        server.sendData(connection, {
          msg: msg,
          name: fromConnection.name
        });
    }
  });
};

/**
 * Send message to a connection by its connectionID
 */
server.sendToConnectionId = function(connectionID, fromConnection, msg) {
  var connection = this.connections[connectionID];
  if (connection && connection.connected) {
      server.sendData(connection, {
        msg: msg,
        name: fromConnection.name
      });
  }
};
