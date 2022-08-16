const fetch = global.fetch;

interface IMockFetchOpts {
    readonly timeout?: number;
    readonly reject?: boolean;
    readonly rejectError?: Error;
    readonly manual?: boolean;

    /**
     * Allow aborting the request using AbortController.prototype.abort
     *
     * Setting this to true will make fetch reject with a new DOMException("Aborted", "AbortError")
     *
     * Default: true
     */
    readonly allowAbortOverride?: boolean;

    readonly queue?: boolean;
}

export const mockFetch = <T>(data: T, response: Partial<Response> = { status: 200 }, opts: IMockFetchOpts = {}) => {
    const {
        timeout = 0,
        reject: shouldReject = false,
        rejectError = new Error(),
        manual = false,
        allowAbortOverride = true,
    } = opts;

    let handlers: { resolve: () => void, reject: () => void } = {
        resolve: () => null,
        reject: () => null,
    };

    global.fetch = jest.fn((input: Request | string, init: RequestInit) => new Promise((resolve, reject) => {
        const mockResponse = {
            ...response,
            json: () => Promise.resolve(data),
            text: () => Promise.resolve(JSON.stringify(data)),
        };

        const requestInfo = typeof input === "string" ? init : input;
        
        handlers.resolve = () => resolve(mockResponse);
        handlers.reject = () => reject(rejectError);

        if (allowAbortOverride && requestInfo?.signal) {
            requestInfo.signal.onabort = () => reject(new DOMException("Aborted", "AbortError"));
        }

        setTimeout(() => {
            if (manual) {
                return;
            }

            if (shouldReject) {
                reject(rejectError);
            } else {
                resolve(mockResponse);
            }
        }, timeout)
    })) as jest.Mock;

    return handlers;
};

export const restoreFetch = () => {
    global.fetch = fetch;
};



const AbortController = global.AbortController;

export const mockAbortController = () => {
    const instance = new AbortController();
    global.AbortController = jest.fn(() => instance);

    return instance;
};

export const restoreAbortController = (): void => {
    global.AbortController = AbortController;
};
