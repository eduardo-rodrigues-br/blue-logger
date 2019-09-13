import {LogLevels} from "./enum/log-levels";
import {ILogger} from "./interfaces/logger";
import {ILoggerOptions} from "./interfaces/logger-options";
import { StreamType } from "./enum/stream-type";
import { IStream } from "./interfaces/stream";

class BlueLogger implements ILogger {

    private errorMessage: string = "Provided options for blue-logger are not valid.";
    private logLevels: string[] = Object.keys(LogLevels).map((l) => l.toLowerCase());

    public install(Vue: any, options: ILoggerOptions) {
        options = Object.assign(this.getDefaultOptions(), options);

        if (this.isValidOptions(options, this.logLevels)) {
            Vue.$log = this.initLoggerInstance(options, this.logLevels);
            Vue.prototype.$log = Vue.$log;
        } else {
            throw new Error(this.errorMessage);
        }
    }

    public isValidOptions(options: ILoggerOptions, logLevels: string[]): boolean {
        if (!(options.logLevel && typeof options.logLevel === "string" && logLevels.indexOf(options.logLevel) > -1)) {
            return false;
        }
        if (options.stringifyArguments && typeof options.stringifyArguments !== "boolean") {
            return false;
        }
        if (options.showLogLevel && typeof options.showLogLevel !== "boolean") {
            return false;
        }
        if (options.showConsoleColors && typeof options.showConsoleColors !== "boolean") {
            return false;
        }
        if (options.separator && (typeof options.separator !== "string" || (typeof options.separator === "string" && options.separator.length > 3))) {
            return false;
        }
        if (typeof options.isEnabled !== "boolean") {
            return false;
        }
        return !(options.showMethodName && typeof options.showMethodName !== "boolean");
    }

    private getMethodName(): string {
        let error = {} as any;

        try {
            throw new Error("");
        } catch (e) {
            error = e;
        }
        // IE9 does not have .stack property
        if (error.stack === undefined) {
            return "";
        }
        let stackTrace = error.stack.split("\n")[3];
        if (/ /.test(stackTrace)) {
            stackTrace = stackTrace.trim().split(" ")[1];
        }
        if (stackTrace && stackTrace.indexOf(".") > -1) {
            stackTrace = stackTrace.split(".")[1];
        }
        return stackTrace;
    }

    private initLoggerInstance(options: ILoggerOptions, logLevels: string[]) {
        const logger = {};
        logLevels.forEach((logLevel) => {
                if (logLevels.indexOf(logLevel) >= logLevels.indexOf(options.logLevel) && options.isEnabled) {
                    logger[logLevel] = (...args) => {
                        const methodName = this.getMethodName();
                        const methodNamePrefix = options.showMethodName ? methodName + ` ${options.separator} ` : "";
                        const logLevelPrefix = options.showLogLevel ? logLevel + ` ${options.separator} ` : "";
                        const formattedArguments = options.stringifyArguments ? args.map((a) => JSON.stringify(a)) : args;
                        const logMessage = `${logLevelPrefix} ${methodNamePrefix}`;
                        this.shipToStreams(logLevel, logMessage, options.showConsoleColors, formattedArguments, options.streams);
                        return `${logMessage} ${formattedArguments.toString()}`;
                    };
                } else {
                    logger[logLevel] = () => undefined;
                }
            },
        );
        return logger;
    }

    private shipToStreams(logLevel: string, logMessage: string, showConsoleColors: boolean, formattedArguments: any, streams: [IStream]) {
        if(streams.length > 0){
            for (let index = 0; index < streams.length; index++) {
                const stream = streams[index];
                switch(stream.streamType){
                    case StreamType.HTTP:
                        this.sendHttpMessage(stream.client, stream.remoteUrl, logLevel, logMessage, formattedArguments)
                        break;
                }  
            }
        }
        else{
            if (showConsoleColors && (logLevel === "warn" || logLevel === "error" || logLevel === "fatal")) {
                console[logLevel === "fatal" ? "error" : logLevel](logMessage, ...formattedArguments);
            } else {
                console.log(logMessage, ...formattedArguments);
            }
        }
    }

    private sendHttpMessage(client: any, remoteUrl: string, logLevel: string, logMessage: string, formattedArguments: any) {
        const body = {
            logLevel: logLevel,
            logMessage: logMessage,
            arguments: formattedArguments
        };

        client.post(remoteUrl, body);
    }

    private getDefaultOptions(): ILoggerOptions {
        return {
            isEnabled: true,
            logLevel: LogLevels.DEBUG,
            separator: "|",
            showConsoleColors: true,
            showLogLevel: false,
            showMethodName: false,
            stringifyArguments: false,
            streams: [{
                streamType: StreamType.HTTP,
                client: null,
                remoteUrl: "http://localhost:8081"
            }]
        };
    }
}

export default new BlueLogger();
