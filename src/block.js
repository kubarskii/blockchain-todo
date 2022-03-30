export class Block {
    _data
    _hash
    _prevHash
    _timestamp
    isHashCalculating = false
    _nonce = 0

    /**
     * @param {any} data
     * @param {boolean} isGeneric default is false
     * */
    constructor(data, isGeneric = false) {
        this._data = data
        this.hash = new Promise(() => {})
        if (isGeneric) {
            this.hash = this.generateHash()
                .then(data => this.hash = data)
        }
        this._prevHash = null
        this._timestamp = Date.now().toString()

    }

    get data() {
        return this._data
    }

    set hash(value) {
        this._hash = value
    }

    set prevHash(value) {
        this._prevHash = value
    }

    get prevHash() {
        return this._prevHash
    }

    async getHash() {
        return await this._hash
    }

    /**
     * TODO: Put into worker
     * */
    async generateHash() {
        /**
         * @var {string}
         * */
        let stringData = ''
        switch (typeof this.data) {
            case "number":
                stringData = this._data.toString();
                break;
            case "object":
                stringData = JSON.stringify(this._data);
                break;
            case "string":
                stringData = this._data
                break
            case "symbol":
                stringData = this.data.description
                break
            case "undefined":
                stringData = this._data.toString()
                break
            case "bigint":
                stringData = this._data.toString();
                break
            case "function":
                stringData = this._data.toString()
                break
            default:
                ""
        }

        const tArr = new TextEncoder().encode(stringData + this._nonce)
        const hashBuffer = await crypto.subtle.digest("SHA-256", tArr)
        const hashArr = Array.from(new Uint8Array(hashBuffer))
        const hash = hashArr.map(byte => byte.toString(16).padStart(2, '0')).join('')

        return hash
    }

    async mine(difficulty = 2) {
        if (difficulty <= 0) {
            difficulty = 2
        }
        const startString = new Array(difficulty).fill(0).join('')

        const genHash = async (resolve, reject) => {
            const hash = await this.generateHash()
            this._nonce = this._nonce + 1
            if (hash.startsWith(startString)) {
                resolve(hash)
            } else {
                genHash(resolve)
            }
        }

        return new Promise(async (resolve, reject) => {
            genHash(resolve, reject)
        })
    }
}
