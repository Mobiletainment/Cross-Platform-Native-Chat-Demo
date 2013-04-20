/**
 * Dependencies.
 */
var _ = require('underscore');
var async = require('async');
var $ = require('jquery-browserify')
var client = require('./lib/client.js');
var server = require('./lib/server.js');

/**
 * Start app Object
 */
var app = {};

/**
 * Initialize App
 */
app.init = function() {

  /*
   * Start Server
   */
  $('.create-server').one('click', function(e) {
    server.start();  
    client.join(server.getIP()[0], '8080');
  });

  /*
   * Join Server
   */
  $('.join-server').one('click', function(e) {
    $(this).addClass('disabled');
    var $ipInput = $('<input>', {'class': 'input-serverip', 'placeholder': 'Enter Server IP'})
    $ipInput.insertAfter('.join-server').focus();

    $ipInput.on('keypress', function(e) {
      if(e.which == 13) {
        var serverAddress = e.target.value.split(':');
        client.join(serverAddress[0], serverAddress[1] ? serverAddress[1] : '8080');
      }
    });
  });

};
