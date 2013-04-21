/**
* Module dependencies.
*/


/**
* Expose `Storage`.
*/
exports = module.exports = DBStorage;

/**
 * Initialize a new 'Storage'
 */
function DBStorage() {
  this.storage = JSON.parse(window.localStorage.getItem('messages') || null);
};

/**
 * Storage for messages history
 */
DBStorage.prototype.storage = null;

/**
 * Adds new message entry to storage
 *
 * Saves data in form of:
 * {
 *    msg: 'String',
 *    name: 'String
 * }
 */
DBStorage.prototype.newChatEntry = function(name, msg) {
  this.storage || (this.storage = []);
  this.storage.push({
    msg: msg,
    name: name
  });
  window.localStorage.setItem('messages', JSON.stringify(this.storage));
}


