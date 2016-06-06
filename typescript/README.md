### TypeScript for pg-monitor

Complete TypeScript ambient declarations for [pg-monitor] version 0.5.7 or later.

#### Inclusion

Since all TypeScript files are distributed with the library, you can reference it like this: 

```ts
/// <reference path='../node_modules/pg-monitor/typescript/pg-monitor' />
```

Version 0.5.5 and later supports [Typings], and can be added to your project with this command:

```
 typings install --save --global  github:vitaly-t/pg-monitor
```

Then you can use the generic reference:

```ts
/// <reference path='../typings/index' />
```

#### Usage

```ts
/// <reference path="../typings/index" />

import * as pgMonitor from "pg-monitor";

var pgOptions = {
    // Initialization Options object that's used for initializing pg-promise
};

pgMonitor.attach(pgOptions);

// optionally, changing the default theme:
pgMonitor.setTheme('matrix');
```

[typings.json]:https://github.com/vitaly-t/pg-monitor/blob/master/typings.json
[Typings]:https://github.com/typings/typings
[pg-monitor]:https://github.com/vitaly-t/pg-monitor
