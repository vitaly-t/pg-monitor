pg-monitor
===========

This library plugs into [pg-promise] events to display them nicely on screen.

[![matrix](http://s2.postimg.org/4hgqhkzih/matrix.gif)](http://s2.postimg.org/4hgqhkzih/matrix.gif)

* [Installing](#installing)
* [Using](#using)
* [API](#api)
 - [attach](#attachoptions-events-override)
 - [connect](#connectclient-detailed)
 - [disconnect](#disconnectclient-detailed)
 - [query](#querye-detailed)
 - [error](#error-detailed)
  
# Installing
```
$ npm install pg-monitor
```

The library has no dependency on [pg-promise], it just sets up the known event handlers,
and will work with any version (1.x or later) of [pg-promise].

# Using

```javascript
var monitor = require("pg-monitor");

var options = {
    // your pg-promise initialization options;
};

monitor.attach(options); // attach to all events at once;
```

Method `attach` is to provide the quickest way to start using the library,
by attaching to a set of events automatically.

If, however, you want to have full control over event handling,
then use the manual event forwarding instead.

Example of forwarding events `query` and `error` manually:

```javascript
var options = {
    query: function (e) {
        /* do some of your own processing, if needed */

        monitor.query(e); // monitor the event;
    },
    error: function (err, e) {
        /* do some of your own processing, if needed */
        
        monitor.error(err, e); // monitor the event;
    }
};
```

See the API below for all the methods and options that you have.

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

Query-related events supported by pg-promise: `connect`, `disconnect`, `query`, `transact` and `error`.
See [Initialization Options](https://github.com/vitaly-t/pg-promise#initialization-options).

#### override

By default, the method will the provide the derivation logic, so it will call the already configured
event handler, if you have one, and only then will call the internal implementation.

If, however, you want to override your own handlers, pass `override` = `true`.

Example of overriding all known event handlers:
```javascript
monitor.attach(options, null, true);
```

## connect(client, [detailed])
Monitors and reports event [connect](https://github.com/vitaly-t/pg-promise#connect).

#### client
Connection object passed to the event.

#### detailed
Optional. When set, it reports such connection details as user@database. 

## disconnect(client, [detailed])
Monitors and reports event [disconnect](https://github.com/vitaly-t/pg-promise#disconnect).

#### client
Connection object passed to the event.

#### detailed
Optional. When set, it reports such connection details as user@database. 

## query(e, [detailed])
Monitors and reports event [query](https://github.com/vitaly-t/pg-promise#query).

#### e
Context object passed to the event.

#### detailed
Optional. When set, it reports available transaction context details. 

## transact(e)
Monitors and reports event [transact](https://github.com/vitaly-t/pg-promise#transact).

#### e
Context object passed to the event.

## error(err, e, [detailed])
Monitors and reports event [error](https://github.com/vitaly-t/pg-promise#error).

#### err
Error message passed to the event.

#### e
Error context passed to the event.

#### detailed
Optional. When set, it reports available transaction context details. 


## Themes

And for the time being check out the [nice themes support](https://github.com/vitaly-t/pg-monitor/wiki/Color-Themes),
or the [simple code behind](https://github.com/vitaly-t/pg-monitor/blob/master/lib/index.js).


[pg-promise]:https://github.com/vitaly-t/pg-promise
