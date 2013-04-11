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

  $('.create-server').click(function(e) {
    server.start();  
  });

  $('.join-server').click(function(e) {
    var $ipInput = $('<input>', {'class': 'input-serverip'})
    $ipInput.insertAfter('.join-server').focus();

    $ipInput.on('keypress', function(e) {
      if(e.which == 13) {
        client.join(e.target.value);
      }
    });
  });

};

/**
 * Start App
 */
app.init();


