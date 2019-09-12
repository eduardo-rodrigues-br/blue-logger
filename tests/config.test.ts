import {strict, strictEqual} from "assert";
import BlueLogger from "../src";
import {LogLevels} from "../src/blue-logger/enum/log-levels";

describe("isValidOptions()", () => {

    const logLevels = Object.keys(LogLevels).map((l) => l.toLowerCase());

    test("isValidOptions() should pass with correct options.", () => {
        const input = BlueLogger.isValidOptions({
            isEnabled: true,
            logLevel: "debug",
            stringifyArguments: false,
            showLogLevel: false,
            showMethodName: true,
            separator: "|",
            showConsoleColors: false,
        } as any, logLevels);
        strictEqual(input, true);
    });

    test("isValidOptions() should fail with incorrect options.", () => {

        strictEqual(BlueLogger.isValidOptions({
            isEnabled: true,
            logLevel: "debug",
            stringifyArguments: false,
            showLogLevel: false,
            showMethodName: true,
            separator: "|||||",
            showConsoleColors: false,
        } as any, logLevels), false);

        strictEqual(BlueLogger.isValidOptions({
            isEnabled: true,
            logLevel: "debug",
            stringifyArguments: false,
            showLogLevel: false,
            showMethodName: true,
            separator: "|",
            showConsoleColors: "FOO",
        } as any, logLevels), false);

        strictEqual(BlueLogger.isValidOptions({
            isEnabled: true,
            logLevel: "debug",
            stringifyArguments: false,
            showLogLevel: false,
            showMethodName: "TEST",
            separator: "|",
            showConsoleColors: false,
        } as any, logLevels), false);

        strictEqual(BlueLogger.isValidOptions({
            isEnabled: true,
            logLevel: "debug",
            stringifyArguments: "TEST",
            showLogLevel: false,
            showMethodName: false,
            separator: "|",
            showConsoleColors: false,
        } as any, logLevels), false);

        strictEqual(BlueLogger.isValidOptions({
            isEnabled: true,
            logLevel: "debug",
            stringifyArguments: false,
            showLogLevel: "TEST",
            showMethodName: false,
            separator: "|",
            showConsoleColors: false,
        } as any, logLevels), false);

        strictEqual(BlueLogger.isValidOptions({
            isEnabled: true,
            logLevel: "TEST",
            stringifyArguments: false,
            showLogLevel: false,
            showMethodName: false,
            separator: "|",
            showConsoleColors: false,
        } as any, logLevels), false);

        strictEqual(BlueLogger.isValidOptions({
            logLevel: "debug",
            isEnabled: true,
        } as any, logLevels), true);

        strictEqual(BlueLogger.isValidOptions({
            isEnabled: "",
            logLevel: "debug",
            separator: "1234",
        } as any, logLevels), false);

        strictEqual(BlueLogger.isValidOptions({
            isEnabled: true,
            logLevel: "debug",
            stringifyArguments: false,
            showLogLevel: false,
            showMethodName: false,
            separator: "|",
            showConsoleColors: false,
        } as any, logLevels), true);

        strictEqual(BlueLogger.isValidOptions({
            isEnabled: false,
            logLevel: "debug",
            stringifyArguments: false,
            showLogLevel: false,
            showMethodName: false,
            separator: "|",
            showConsoleColors: false,
        } as any, logLevels), true);

        strictEqual(BlueLogger.isValidOptions({
            isEnabled: "",
            logLevel: "debug",
            stringifyArguments: false,
            showLogLevel: false,
            showMethodName: false,
            separator: "|",
            showConsoleColors: false,
        } as any, logLevels), false);

        strictEqual(BlueLogger.isValidOptions({
            isEnabled: null,
            logLevel: "debug",
            stringifyArguments: false,
            showLogLevel: false,
            showMethodName: false,
            separator: "|",
            showConsoleColors: false,
        } as any, logLevels), false);
    });
});
