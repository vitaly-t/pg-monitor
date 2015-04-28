pg-monitor
===========

This library plugs into [pg-promise] events to display them nicely on screen.

[![matrix](http://s2.postimg.org/4hgqhkzih/matrix.gif)](http://s2.postimg.org/4hgqhkzih/matrix.gif)

* [Installing](#installing)
* [Using](#using)
* [API](#api)

# Installing
```
$ npm install pg-monitor
```

The library has no dependency on [pg-promise], it just sets up known event handlers,
and will work with any version 1.x or later of [pg-promise].

# Using

The quickest way to start is by using method `attach`:
```javascript
var monitor = require("pg-monitor");

var options = {
    // your pg-promise initialization options;
};

monitor.attach(options); // attach to all events at once;
```

See the API below for other options that you have.

# API

## attach(options, [events, override])

Adds event handlers to object `options` that's used when [initializing pg-promise](https://github.com/vitaly-t/pg-promise#2-initializing) library:
```javascript
var pgp = pgpLib(options);
```

#### events

Optional array of event names to which to attach. Passing `null`/`undefined` will attach
to all known events.

Example of attaching to just events `query` and `error`:
```javascript
monitor.attach(options, ['query', 'error']);
```

Query-related events supported by pg-promise: `connect`, `disconnect`, `query`, `transact`, `error`.
See [Initialization Options](https://github.com/vitaly-t/pg-promise#initialization-options).

#### override

By default, the method will the provide the derivation logic, so it will call the already configured
event handler, if you have one, and only then will call the internal implementation.

If, however, you want to override your own handlers, pass `override` = `true`.

Example of overriding all known event handlers:
```javascript
monitor.attach(options, null, true);
```


And for the time being check out the [nice themes support](https://github.com/vitaly-t/pg-monitor/wiki/Color-Themes),
or the [simple code behind](https://github.com/vitaly-t/pg-monitor/blob/master/lib/index.js).


[pg-promise]:https://github.com/vitaly-t/pg-promise
