Cross-Platform-Web-App
======================

What is it?
------------
A client-server-chat based on node-webkit for cross platform distribution.

Requirements
------------
 * [node-webkit](https://github.com/rogerwang/node-webkit)
 * [npm](https://npmjs.org/)
 * 3rd party modules (installed via npm): [WebSocket](https://github.com/Worlize/WebSocket-Node), [jquery-browserify](https://github.com/jmars/jquery-browserify), [async](https://github.com/caolan/async/), [underscore](https://github.com/documentcloud/underscore)

How to build?
------------
 1. Install: 
 	* ```cd app```
 	* ```npm install```
 2. Start app
    * ```npm start```
 3. Build package:
    * ```npm run-script package```

References:
------------
* [Javascript on Desktop](http://de.slideshare.net/domenicdenicola/javascript-on-the-desktop "Javascript on the desktop")
* [Websockets](http://lucumr.pocoo.org/2012/9/24/websockets-101/ "Websockets 101")
* =>https://github.com/Worlize/WebSocket-Node, https://github.com/bodokaiser/node-websockets, http://socket.io