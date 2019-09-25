import {LogLevels} from "../enum/log-levels";
import { IStream } from "./stream";

export interface ILoggerOptions {
    isEnabled: boolean;
    logLevel: LogLevels;
    separator: string;
    showConsoleColors: boolean;
    showLogLevel: boolean;
    showMethodName: boolean;
    stringifyArguments: boolean;
    streams: [IStream];
    sessionId: string;
}
