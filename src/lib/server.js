/**
 * Module dependencies.
 */
var _ = require('underscore');
var async = require('async');
var WebSocketServer = require('websocket').server;
var http = require('http');
var os = require('os');

/**
 * Server.
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

  var connectionIDCounter = 0;

  wsServer.on('request', function(request) {

    var connection = request.accept(null, request.origin);

    // Store a reference to the connection using a connection ID
    connection.id = connectionIDCounter++;
    server.connections[connection.id] = connection;

    console.log((new Date()) + 'Server Connection ID ' + connection.id + ' accepted.');

    connection.on('message', function(message) {
      if(message.type === 'utf8') {
        console.log('Server Received Message: ' + message.utf8Data);
        server.broadcast(message.utf8Data, connection.id);
      }
    });

    connection.on('close', function(reasonCode, description) {
      console.log((new Date()) + 'Server Peer ' + connection.remoteAddress + ' disconnected.');

      // Make sure to remove closed connections from the global pool
      delete server.connections[connection.id];
    });

  });
};

/**
 * Broadcast to all open connections
 */
server.broadcast = function(data, excludeID) {
  Object.keys(server.connections).forEach(function(key) {
    var connection = server.connections[key];
    if (connection.connected && connection.id != excludeID) {
        connection.send(data);
    }
  });
};

/**
 * Send message to a coonnection by its connectionID
 */
server.sendToConnectionId = function(connectionID, data) {
  var connection = this.connections[connectionID];
  if (connection && connection.connected) {
      connection.send(data);
  }
};

/*
 * Get Server IP
 */
server.getIP = function() {
  var interfaces = os.networkInterfaces();
  var addresses = [];
  for (k in interfaces) {
      for (k2 in interfaces[k]) {
          var address = interfaces[k][k2];
          if (address.family == 'IPv4' && !address.internal) {
              addresses.push(address.address)
          }
      }
  }
  return addresses;
};


