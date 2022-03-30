export class Observer {
    _value

    constructor(initialValue) {
        this._value = initialValue
        this._subscriptions = []
    }

    get value() {
        return this._value
    }

    next(value) {
        this._value = value
        this._subscriptions.forEach((fn) => {
            fn(value)
        })
    }

    subscribe(fn) {
        if (typeof fn !== 'function')
            throw new Error('Observer: subscribe param is not a function')
        this._subscriptions.push(fn)

    }

    unsubscribe(fn) {
        const i = this._subscriptions.indexOf(fn)
        if (i >= 0) {
            this._subscriptions.splice(i, 1)
        }
    }

}
