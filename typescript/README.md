## TypeScript for pg-monitor

Complete TypeScript 3.x (`strict` mode) declarations for [pg-monitor].

### Inclusion

Typescript should be able to pick up the definitions without any manual configuration.
 
### Usage

```ts
import * as pgMonitor from 'pg-monitor';

const pgOptions = {
    // Initialization Options object that's used for initializing pg-promise
};

pgMonitor.attach(pgOptions);

// optionally, changing the default theme:
pgMonitor.setTheme('matrix');
```

[pg-monitor]:https://github.com/vitaly-t/pg-monitor
