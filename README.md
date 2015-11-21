pg-monitor
===========

[![Build Status](https://travis-ci.org/vitaly-t/pg-monitor.svg?branch=master)](https://travis-ci.org/vitaly-t/pg-monitor)
[![Coverage Status](https://coveralls.io/repos/vitaly-t/pg-monitor/badge.svg?branch=master)](https://coveralls.io/r/vitaly-t/pg-monitor?branch=master)

Event monitor for [pg-promise].

[![matrix](http://s2.postimg.org/4hgqhkzih/matrix.gif)](http://s2.postimg.org/4hgqhkzih/matrix.gif)

* [About](#about)
* [Installing](#installing)
* [Testing](#testing)
* [Usage](#usage)
* [API](#api)
  - [attach](#attachoptions-events-override)
  - [connect](#connectclient-detailed)
  - [disconnect](#disconnectclient-detailed)
  - [query](#querye-detailed)
  - [task](#task)  
  - [transact](#transact)  
  - [error](#errorerr-e-detailed)
  - [detailed](#detailed-4) 
  - [setTheme](#setthemet)
  - [log](#log)
* [Themes](#themes)
* [Useful Tips](#useful-tips)
 
# About
   
   This library takes the flexible event system provided by [pg-promise],
   and outputs it on screen, with full details available, and in the most informative way.
    
   It is to give you the full picture of how the database is used in your application,
   providing full details with the context, such as tasks and transactions, in which
   queries are executed.
   
   In addition, it simplifies [event logging](#log) for your application.
      
# Installing
```
$ npm install pg-monitor
```

The library has no direct dependency on [pg-promise], and will work with any of its versions.

# Testing

```
$ npm test
```

Testing with coverage:
```
$ npm run coverage
```

# Usage

```javascript
var monitor = require("pg-monitor");

var options = {
    // your pg-promise initialization options;
};

monitor.attach(options); // attach to all events at once;
```

Method [attach](#attachoptions-events-override) is to provide the quickest way to start using the library,
by attaching to a set of events automatically.

If, however, you want to have full control over event handling, then use the manual event forwarding instead.

Example of forwarding events [query](https://github.com/vitaly-t/pg-promise#query) and [error](https://github.com/vitaly-t/pg-promise#error) manually:

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

Query-related events supported by pg-promise: `connect`, `disconnect`, `query`, `task`, `transact` and `error`.
See [Initialization Options](https://github.com/vitaly-t/pg-promise#initialization-options).

#### override

By default, the method uses derivation logic - it will call the previously configured
event handler, if you have one, and only then it will call the internal implementation.

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

When not set, it defaults to the value of [monitor.detailed]. 

## disconnect(client, [detailed])
Monitors and reports event [disconnect](https://github.com/vitaly-t/pg-promise#disconnect).

#### client
Connection object passed to the event.

#### detailed
Optional. When set, it reports such connection details as user@database. 

When not set, it defaults to the value of [monitor.detailed].

## query(e, [detailed])
Monitors and reports event [query](https://github.com/vitaly-t/pg-promise#query).

#### e
Context object passed to the event.

#### detailed
Optional. When set, it reports details of the task/transaction context in which the query is executing. 

When not set, it defaults to the value of [monitor.detailed].

## task(e)
Monitors and reports event [task](https://github.com/vitaly-t/pg-promise#task).

#### e
Context object passed to the event.

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
Optional. When set, it reports details of the task/transaction context in which the error occurred. 

When not set, it defaults to the value of [monitor.detailed].

## detailed

This boolean property provides the default for every method that accepts parameter `detailed`.

By default, it is set to be `true`. Setting this parameter to `false` will automatically
switch off all details in events that support optional details, unless they have their own
parameter `detailed` set to be `true`, which then overrides this global one.

## setTheme(t)

Activates either a predefined or a custom color theme.

### t

Either a predefined theme name or a custom theme object.

For details, see [Color Themes](https://github.com/vitaly-t/pg-monitor/wiki/Color-Themes). 

## log

This optional event is to let your application save everything that appears on screen
into your log file:

```javascript
monitor.log = function(msg, info){
    // save the screen message into your own log file;
};
```

The notification occurs for every single line of text that appears on the screen, so you can
maintain a log file with exactly the same content.

#### msg
New message line, exactly as shown on the screen, with color attributes removed.

#### info

Object with additional information about the event:

* `time` - Date object that was used for the screen, or `null` when it is an extra line with
the event's context details;
* `text` - message text without the time in front of it (color attributes removed);
* `event` - name of the event being logged.

If your intent is only to log events, while suppressing any screen output, you can
do so on per-event basis, as shown below:
```js
info.display = false; // suppress screen output for the event;
```

# Themes

The library provides a flexible theme support to choose any color palette that you like,
with a few of them predefined for your convenience.

For details, see [Color Themes](https://github.com/vitaly-t/pg-monitor/wiki/Color-Themes). 

# Useful Tips

If your application uses more than one task or transaction, it is a good idea to tag them,
so they provide informative context for every query event that's being logged, i.e.
so your can easily see in which task/transaction context queries are executed.

Tagging a task or transaction with [pg-promise] is very easy, by taking this code: 
```javascript
db.task(function (t) {
    // task queries; 
});
db.tx(function (t) {
    // transaction queries; 
});
``` 
and replacing it with this one:
```javascript
db.task(tag, function (t) {
    // task queries; 
});
db.tx(tag, function (t) {
    // transaction queries; 
});
```
where `tag` is any object or value. In most cases you would want `tag` to be just
a string that represents the task/transaction name, like this:
```javascript
db.task("MyTask", function (t) {
    // task queries; 
});
db.tx("TX-1", function (t) {
    // transaction queries; 
});
```
But `tag` can be anything, including an object, so you can use it for your own reference
when handling events. And if you want to use it that way, while also allowing this library
to log the task/transaction pseudo-name/alias, then make sure your tag object implements its
own function `toString()` to return such name, which this library will then call to report
the name along with the task/transaction.

[pg-promise]:https://github.com/vitaly-t/pg-promise
[monitor.detailed]:https://github.com/vitaly-t/pg-monitor#detailed-4
