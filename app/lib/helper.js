/**
 * Module dependencies.
 */
var os = require('os');

/**
 * Returns external IP Addresses
 */
exports.getIPs = function() {
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


