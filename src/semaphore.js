export class Semaphore {

    _maxConcurrRequests
    runningRequests = 0
    requests = []

    constructor(concurrRequests = 1) {
        this._maxConcurrRequests = concurrRequests
    }

    $call(fn, ...args) {
        return new Promise((resolve, reject) => {
            this.requests.push({
                resolve,
                reject,
                fn,
                args
            })
            this.#next()
        })
    }

    #next() {
        if (!this.requests.length) {
            return;
        }

        if (this.runningRequests < this._maxConcurrRequests) {
            let {resolve, reject, fn, args} = this.requests.shift();
            ++this.runningRequests;
            let req = fn(...args);
            req.then((res) => resolve(res))
                .catch((err) => reject(err))
                .finally(() => {
                    --this.runningRequests;
                    this.#next();
                });
        }
    }
}

