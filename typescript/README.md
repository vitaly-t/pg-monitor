### TypeScript for pg-monitor

Complete TypeScript ambient declarations for [pg-monitor] version 0.5.0 or later.

#### Usage

```ts
/// <reference path="node_modules/pg-monitor/typescript/pg-monitor" />

import * as pgMonitor from "pg-monitor";

var pgOptions = {
    // Initialization Options object that's used for initializing pg-promise
};

pgMonitor.attach(pgOptions);

// optionally, changing the default theme:
pgMonitor.setTheme('matrix');
```

[pg-monitor]:https://github.com/vitaly-t/pg-monitor
