pg-monitor
===========

Events monitor for [pg-promise].

[![matrix](https://raw.githubusercontent.com/vitaly-t/pg-monitor/master/.github/images/matrix.png)](https://raw.githubusercontent.com/vitaly-t/pg-monitor/master/.github/images/matrix.png)

* [About](#about)
* [Installing](#installing)
* [Testing](#testing)
* [Usage](#usage)
* [API](#api)
  - [attach](#attachoptions-events-override)
  - [isAttached](#isattached)
  - [detach](#detach)
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

This library takes the flexible event system provided by [pg-promise] and outputs it on screen,
with full details available, and in the most informative way.
    
Its purpose is to give you the full picture of how the database is used in your application,
providing full details with the context, such as tasks and transactions in which queries are executed.
   
In addition, it simplifies [events logging](#log) for your application.

# Installing

```
$ npm install pg-monitor
```

The library has no direct dependency on [pg-promise].

# Testing

* Clone the repository (or download, if you prefer):

```
$ git clone https://github.com/vitaly-t/pg-monitor
```

* Install the library's DEV dependencies:

```
$ npm install
```

* To run all tests:

```
$ npm test
```

* To run all tests with coverage:

```
$ npm run coverage
```

# Usage

```js
const monitor = require('pg-monitor');

const initOptions = {
    // pg-promise initialization options;
};

const pgp = require('pg-promise')(initOptions);

// attach to all pg-promise events of the initOptions object:
monitor.attach(initOptions);

// Example of attaching to just events 'query' and 'error':
// monitor.attach(initOptions, ['query', 'error']); 
```

Method [attach](#attachoptions-events-override) is to provide the quickest way to start using the library,
by attaching to a set of events automatically.

If, however, you want to have full control over event handling, you can use the manual event forwarding.

Example of forwarding events [query] and [error] manually:

```js
const initOptions = {
    query(e) {
        /* do some of your own processing, if needed */

        monitor.query(e); // monitor the event;
    },
    error(err, e) {
        /* do some of your own processing, if needed */
        
        monitor.error(err, e); // monitor the event;
    }
};
```

See the API below for all the methods and options that you have.

Below is a safe forwarding implemented in TypeScript, for events `connect`, `disconnect` and `query`.
It works the same for all other events.

```ts
import * as monitor from 'pg-monitor';

function forward(event: monitor.LogEvent, args: IArguments) {
    // safe event forwarding into pg-monitor:
    (monitor as any)[event].apply(monitor, [...args]);
} 

const options: IInitOptions = {
    connect() {
        forward('connect', arguments);
    },
    disconnect() {
        forward('disconnect', arguments);
    },
    query() {
        forward('query', arguments);
    }
};
```

# API

## attach(options, [events], [override])
**Alternative Syntax:** `attach({options, events, override});` 

Adds event handlers to object `initOptions` that's used during [pg-promise initialization]:

```js
monitor.attach(initOptions); // mutates the options object to attach to all events
```

A repeated call (without calling [detach] first) will throw `Repeated attachments not supported, must call detach first.`

#### [events]

Optional array of event names to which to attach. Passing `null`/`undefined` will attach
to all known events.

Example of attaching to just events `query` and `error`:

```js
monitor.attach(initOptions, ['query', 'error']);
```

Query-related events supported by pg-promise: `connect`, `disconnect`, `query`, `task`, `transact` and `error`.

See also: [Initialization Options].

#### [override]

By default, the method uses derivation logic - it will call the previously configured
event handler, if you have one, and only then will it call the internal implementation.

If, however, you want to override your own handlers, pass `override` = `true`.

Example of overriding all known event handlers:

```js
monitor.attach({options: initOptions, override: true});
```

## isAttached()

Verifies if the monitor is currently attached, and returns a boolean.

## detach()

Detaches from all the events to which attached after the last successful call to [attach]. 

Calling it while not attached will throw `Event monitor not attached.`

## connect({client, dc, useCount}, [detailed])

Monitors and reports event [connect].

#### client

[Client] object passed to the event.

#### dc

Database Context.

#### useCount

Number of times the connection has been used.

#### [detailed]

Optional. When set, it reports such connection details as `user@database`.

When not set, it defaults to the value of [monitor.detailed]. 

## disconnect({client, dc}, [detailed])

Monitors and reports event [disconnect].

#### client

[Client] object passed to the event.

#### dc

Database Context.

#### [detailed]

Optional. When set, it reports such connection details as `user@database`. 

When not set, it defaults to the value of [monitor.detailed].

## query(e, [detailed])

Monitors and reports event [query].

#### e

Event context object.

#### [detailed]

Optional. When set, it reports details of the task/transaction context in which the query is executing. 

When not set, it defaults to the value of [monitor.detailed].

## task(e)

Monitors and reports event [task].

#### e

Event context object.

## transact(e)

Monitors and reports event [transact].

#### e

Event context object.

## error(err, e, [detailed])

Monitors and reports event [error].

#### err

Error message passed to the event.

#### e

Event context object.

#### [detailed]

Optional. When set, it reports details of the task/transaction context in which the error occurred. 

When not set, it defaults to the value of [monitor.detailed].

## detailed

This boolean property provides the default for every method that accepts optional parameter `detailed`.

By default, it is set to be `true`. Setting this parameter to `false` will automatically
switch off all details in events that support optional details, unless they have their own
parameter `detailed` passed in as `true`, which then overrides this global one.

Use method `setDetailed` to change the value.

## setTheme(t)

Activates either a predefined or a custom color theme.

### t

Either a predefined theme name or a custom theme object.

For details, see [Color Themes](https://github.com/vitaly-t/pg-monitor/wiki/Color-Themes). 

## log

This event is to let your application provide your own log for everything that appears on the screen.

```js
monitor.setLog((msg, info) => {
    // save the screen message into your own log;
});
```

The notification occurs for every single line of text that appears on the screen, so you can
maintain a log file with exactly the same content.

#### msg

New message line, exactly as shown on the screen, with color attributes removed.

#### info

Object with additional information about the event:

* `time` - `Date` object that was used for the screen, or `null` when it is an extra line with
the event's context details;
* `colorText` - color-coded message text, without time in front;
* `text` - message text without the time in front (color attributes removed);
* `event` - name of the event being logged.
* `ctx` - Optional, [task/transaction context] when available.

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
so you can easily see in which task/transaction context queries are executed.

Tagging a task or transaction with [pg-promise] is very easy, by taking this code:
 
```js
db.task(t => {
    // task queries; 
});
db.tx(t => {
    // transaction queries; 
});
```
 
and replacing it with this one:

```js
db.task(tag, t => {
    // task queries; 
});
db.tx(tag, t => {
    // transaction queries; 
});
```
where `tag` is any object or value. In most cases you would want `tag` to be just
a string that represents the task/transaction name, like this:

```js
db.task('MyTask', t => {
    // task queries; 
});
db.tx('MyTransaction', t => {
    // transaction queries; 
});
```

The `tag` can be anything, including your custom object, so you can use it for your own reference
when handling events. And if you want to use it as your own object, while also allowing this library
to log the task/transaction pseudo-name/alias, then have your object implement method `toString()`
that returns the tag name.

[pg-promise]:https://github.com/vitaly-t/pg-promise
[monitor.detailed]:https://github.com/vitaly-t/pg-monitor#detailed-4
[Client]:https://node-postgres.com/api/client
[attach]:https://github.com/vitaly-t/pg-monitor#attachoptions-events-override
[detach]:https://github.com/vitaly-t/pg-monitor#detach
[pg-promise initialization]:http://vitaly-t.github.io/pg-promise/module-pg-promise.html
[Initialization Options]:http://vitaly-t.github.io/pg-promise/module-pg-promise.html
[connect]:http://vitaly-t.github.io/pg-promise/global.html#event:connect
[disconnect]:http://vitaly-t.github.io/pg-promise/global.html#event:disconnect
[query]:http://vitaly-t.github.io/pg-promise/global.html#event:query
[task]:http://vitaly-t.github.io/pg-promise/global.html#event:task
[transact]:http://vitaly-t.github.io/pg-promise/global.html#event:transact
[error]:http://vitaly-t.github.io/pg-promise/global.html#event:error
[task/transaction context]:http://vitaly-t.github.io/pg-promise/global.html#TaskContext
