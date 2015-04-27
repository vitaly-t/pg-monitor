pg-monitor
===========

This library plugs into [pg-promise] events to display them nicely on screen.

![matrix](http://s2.postimg.org/4hgqhkzih/matrix.gif)

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
