import { pgMonitor } from "../../typescript/pg-monitor";

var options = {};

pgMonitor.attach(options, ['query'], true);

pgMonitor.attach({
    options: options,
    events: [],
    override: true
});

pgMonitor.detach();

pgMonitor.log = function (msg, info) {
    info.display = false;
};

pgMonitor.setTheme('matrix');

pgMonitor.setTheme({
    time: null,
    value: null,
    cn: null,
    tx: null,
    paramTitle: null,
    errorTitle: null,
    query: ()=>{},
    special: null,
    error: null
});

pgMonitor.detailed = false;

pgMonitor.connect({}, 123, true, false);
pgMonitor.disconnect({}, null, true);
pgMonitor.query({});
pgMonitor.task({});
pgMonitor.transact({});
pgMonitor.error('ops', {}, true);
