### TypeScript for pg-monitor

Complete TypeScript ambient declarations for [pg-monitor] version 0.5.0 or later.

#### Inclusion

Since all TypeScript files are distributed with the library, you can reference it like this: 

```ts
/// <reference path='../node_modules/pg-monitor/typescript/pg-monitor' />
```

Starting with version 0.5.5, the library includes file [typings.json] for integration with [Typings].

Add the library to your _typings.json_ file (commit hash example is for 0.5.5 release):
```js
{
  "globalDependencies": {
    "pg-monitor": "github:vitaly-t/pg-monitor#f68711a4264e743ac24a832cf9646e34eda5909c"
  }
}
```

After running `typings install` you will be able to rely on the generic reference:

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
