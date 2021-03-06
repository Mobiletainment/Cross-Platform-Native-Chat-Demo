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

  // DBStorage is used to save and restore chat history
  var db = new DBStorage();

  var connectionIDCounter = 0;

  wsServer.on('request', function(request) {

    var connection = request.accept(null, request.origin);

    // Store a reference to the connection using a connection ID
    connection.id = ++connectionIDCounter
    // Give connection a name
    connection.name = 'guest';
    // Give connection a color
    connection.color = '#d5d5d5';
    // Give connection an ID
    server.connections[connection.id] = connection;

    console.log((new Date()) + 'Server Connection ID ' + connection.id + ' accepted.');

    // Send chat history to client
    server.sendData(connection, db.storage, 'history');

    /*
     * On receiving a message from client
     * Format:
     * {
     *  type: 'String',
     *  data: 'String'
     * }
     */
    connection.on('message', function(message) {
      if(message.type === 'utf8') {
        msg = JSON.parse(message.utf8Data);
        console.log('Server Received Message: ' + msg.type);
        var data = {
          msg: msg.data,
          name: connection.name,
          color: connection.color,
          id: connection.id,
        };
        if(msg.type === 'color') {
          connection.color = msg.data;
          data.color = msg.data;
          server.broadcast(data, 'color');
        } else if(msg.type === 'name') {
          connection.name = msg.data;
          data.name = msg.data;
          server.broadcast(data, 'name');
        } else if(msg.type === 'single') {
          server.sendToConnectionId(msg.receiver, data);
        } else {
          server.broadcast(data);
          db.newChatEntry(data);
        } 
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
server.broadcast = function(data, type) {
  Object.keys(server.connections).forEach(function(key) {
    var connection = server.connections[key];
    if (connection.connected) {
        server.sendData(connection, data, type);
    }
  });
};

/**
 * Send message to a connection by its connectionID
 */
server.sendToConnectionId = function(connectionID, data) {
  var connection = this.connections[connectionID];
  if (connection && connection.connected) {
      server.sendData(connection, data);
  }
};
