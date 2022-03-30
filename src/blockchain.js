import {Block} from './block';
import {Observer} from './observer';
import {Semaphore} from './semaphore';

export class BlockChain extends Observer {

    #chain = []
    queueOfBlocksToAdd = []
    t = null
    semaphor
    difficulty

    constructor({initalBlockValue = null, difficulty}) {
        super([])
        this.difficulty = difficulty
        this.semaphor = new Semaphore()
        this.$add = this.$add.bind(this)
        this.#init(initalBlockValue)
    }

    async #init(initalBlockValue) {
        await this.add(new Block(initalBlockValue, true))
    }

    /**
     * @return {Block | Promise<null>}
     * */
    get last() {
        /**
         * @var {number}
         * */
        const lastIndex = this.#chain.length - 1
        if (lastIndex >= 0)
            return this.#chain[lastIndex]
        return null
    }

    async #validateChain() {
        let i = 0
        for await (let block of this.#chain) {
            if (i >= 1) {
                const currentBlock = this.#chain[i];
                const prevBlock = this.#chain[i - 1];
                const currBlockPrevHash = await Promise.resolve(currentBlock.prevHash)
                const prevBlockHash = await Promise.resolve(prevBlock.getHash())
                const currHash = await Promise.resolve(currentBlock.getHash())
                const generatedHash = await currentBlock.generateHash()
                if (currBlockPrevHash !== prevBlockHash && currHash === generatedHash) {
                    throw new Error('The chain is broken')
                }
            }
            i++
        }

        return true;
    }

    async add(...args) {
        this.semaphor.$call(this.$add, ...args)
    }

    /**
     * @param {Block} block
     * */
    async $add(block) {
        if (!block instanceof Block) {
            throw new Error('block is not Block instance')
        }

        if (!this.last) {
            this.#chain.push(block)
            const hash = await block.getHash()
            return
        }

        block.prevHash = await this.last.getHash()
        block.hash = await block.mine(this.difficulty);
        Object.freeze(block)
        this.#chain.push(block)
        this.#validateChain()
        this.next(this.#chain)

    }

}
