import * as pgMonitor from '../../typescript/pg-monitor';

const options = {};

pgMonitor.attach(options);
pgMonitor.attach(options, ['query'], true);

pgMonitor.detach();

const log = function (msg: string, info: pgMonitor.IEventInfo) {
    console.log('Custom log: ', msg, info);
};

pgMonitor.setLog(log);

const theme = 'matrix';

pgMonitor.setTheme(theme);

function colorFunction(...values: any[]) {
    return 'hello!';
}

pgMonitor.setTheme({
    time: colorFunction,
    value: colorFunction,
    cn: colorFunction,
    tx: colorFunction,
    paramTitle: colorFunction,
    errorTitle: colorFunction,
    query: colorFunction,
    special: colorFunction,
    error: colorFunction
});

pgMonitor.setDetailed(false);

pgMonitor.connect({}, 123, 0, false);
pgMonitor.disconnect({}, null, true);
pgMonitor.query({});
pgMonitor.task({});
pgMonitor.transact({});
pgMonitor.error('ops', {}, true);
pgMonitor.isAttached();
