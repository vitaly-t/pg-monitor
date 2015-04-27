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

# Using

```javascript
var monitor = require("pg-monitor");

var options = {
    // your pg-promise initialization options;
};

monitor.attach(options); // attach to all events at once;
```

[pg-promise]:https://github.com/vitaly-t/pg-promise

# API

*Documentation is being written.*

And for the time being check out the [nice themes support](https://github.com/vitaly-t/pg-monitor/wiki/Color-Themes),
or the [simple code behind](https://github.com/vitaly-t/pg-monitor/blob/master/lib/index.js).
