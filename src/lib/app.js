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

  $('.create-server').one('click', function(e) {
    server.start();  
    client.join('localhost:8080');
  });

  $('.join-server').one('click', function(e) {
    $(this).addClass('disabled');
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


