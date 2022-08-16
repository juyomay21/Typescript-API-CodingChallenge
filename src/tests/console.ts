const console = global.console;

export const mockConsole = () => {
    // TODO: Mock the rest of the console methods when needed
    global.console = {
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    } as unknown as Console;
};

export const restoreConsole = () => {
    global.console = console;
};

