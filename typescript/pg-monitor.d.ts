////////////////////////////////////////
// Requires pg-monitor v0.5.0 or later.
////////////////////////////////////////

declare module "pg-monitor" {

    interface ColorTheme {
        time:Function;
        value:Function;
        cn:Function;
        tx:Function;
        paramTitle:Function;
        errorTitle:Function;
        query:Function;
        special:Function;
        error:Function;
    }

    interface EventInfo {
        time:Date;
        text:string;
        event:string;
        display:boolean;
    }

    namespace pgMonitor {

        export function attach(options:Object, events?:Array<string>, override?:boolean):void;

        export function attach(options:{
            options:Object,
            events?:Array<string>,
            override?:boolean
        }):void;

        export function detach():void;

        export function setTheme(theme:string|ColorTheme):void;

        export function log(msg:string, info:EventInfo):void;

        export var detailed:boolean;

        export function connect(client:Object, detailed?:boolean):void;

        export function disconnect(client:Object, detailed?:boolean):void;

        export function query(e:Object, detailed?:boolean):void;

        export function task(e:Object):void;

        export function transact(e:Object):void;

        export function error(err:any, e:Object, detailed?:boolean):void;

    }

    export = pgMonitor;
}
