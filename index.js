/**
 * Expose `Pool`.
 */

module.exports = Pool;

/**
 * Redis pub `sub` pool.
 *
 * @param {Redis} sub
 * @return {Pool}
 * @api public
 */

function Pool(sub){
  if (!(this instanceof Pool)) return new Pool(sub);
  this.sub = sub;
  this.subs = {};
  this.psubs = {};
}

/**
 * Subscribe `fn` to `channel`.
 *
 * @param {String} pattern
 * @param {Function} fn
 * @return {Function} unbind
 * @api public
 */

Pool.prototype.on = function(channel, fn){
  var self = this;
  if (!self.subs[channel]) self.sub.subscribe(channel);
  self.subs[channel] = (self.subs[channel] || 0) + 1;
  self.sub.on('message', onmessage);
  function onmessage(_channel, message){
    if (channel == _channel) fn(message);
  }
  return function unbind(){
    self.sub.removeListener('message', onmessage);
    if (!--self.subs[channel]) {
      delete self.subs[channel];
      self.sub.unsubscribe(channel);
    }
  };
};

/**
 * Subscribe `fn` to `pattern`.
 *
 * @param {String} pattern
 * @param {Function} fn
 * @return {Function} unbind
 * @api public
 */

Pool.prototype.pon = function(pattern, fn){
  var self = this;
  if (!self.psubs[pattern]) self.sub.psubscribe(pattern);
  self.psubs[pattern] = (self.psubs[pattern] || 0) + 1;
  self.sub.on('pmessage', onmessage);
  function onmessage(_pattern, channel, message){
    if (pattern == _pattern) fn(message);
  }
  return function unbind(){
    self.sub.removeListener('pmessage', onmessage);
    if (!--self.psubs[pattern]) {
      delete self.psubs[pattern];
      self.sub.punsubscribe(pattern);
    }
  };
};