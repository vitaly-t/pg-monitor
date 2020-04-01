import { IEventContext } from './types';
export declare function formatTime(t: Date): string;
export declare function formatDuration(d: number): string;
export declare function removeColors(text: string): string;
export declare function padZeros(value: number, n: number): string;
export declare function hasOwnProperty(obj: object, propName: string): boolean;
export declare function getTagName(e: IEventContext): string | undefined;
export declare function isNull(value: any): boolean;
export declare function toJson(data: any): string | undefined;
