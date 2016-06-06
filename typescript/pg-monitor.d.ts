////////////////////////////////////////
// Requires pg-monitor v0.5.0 or later.
////////////////////////////////////////

declare module "pg-monitor" {

    interface IColorTheme {
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

    interface IEventInfo {
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

        export function setTheme(theme:string|IColorTheme):void;

        export function log(msg:string, info:IEventInfo):void;

        export var detailed:boolean;

        export function connect(client:Object, dc:any, fresh:boolean, detailed?:boolean):void;

        export function disconnect(client:Object, dc:any, detailed?:boolean):void;

        export function query(e:Object, detailed?:boolean):void;

        export function task(e:Object):void;

        export function transact(e:Object):void;

        export function error(err:any, e:Object, detailed?:boolean):void;

    }

    export = pgMonitor;
}
