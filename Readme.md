
# redis-pubsub-pool

Handles many subscriptions with one client and knows when it's save to unsubscribe.

## Example

```js
var redis = require('redis');
var Pool = require('redis-pubsub-pool');

var pub = redis.createClient();
var sub = redis.createClient();
var pool = Pool(sub);

var unbind = pool.on('foo', function(msg){
  console.log('got %s', msg);
});

// ...

pub.publish('foo', 'bar');

// ...

unbind();
```

## API

### Pool(subscriber)

### pool.on(channel, fn)

Subscribe `fn` to updates on `channel`. Returns an `unbind` function that unbinds *immediately*.

### pool.pon(pattern, fn)

Subscribe `fn` to updates on `pattern`. Returns an `unbind` function that unbinds *immediately*.

**TODO** this name sucks

## Installation

```bash
$ npm install redis-pubsubs-pool
```

## License

MIT