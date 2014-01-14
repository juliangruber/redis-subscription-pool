var redis = require('redis');
var Pool = require('./');

var pub = redis.createClient();
var sub = redis.createClient();
var pool = Pool(sub);
var unbind1 = pool.on('foo', function(msg){
  console.log('got %s', msg);
});

var unbind2 = pool.on('foo', function(msg){
  console.log('got %s', msg);
});

setTimeout(function(){
  pub.publish('foo', 'bar');
  
  setTimeout(function(){
    unbind1();
    
    setTimeout(function(){
      pub.publish('foo', 'baz');
      
      setTimeout(function(){
        pub.end();
        sub.end();
      }, 500);
    }, 500);
  }, 500);
}, 1000);
