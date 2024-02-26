

class Account {
    #method = 'eth_requestAccounts'

    constructor(overrideMethod){
        this.result = {
            method: overrideMethod || this.#method
        }
        this.init()
    }
    init(){
        return this.result
    }
}

class Balance extends Account{
    #method = 'eth_getBalance'

    constructor(from, to){
        super()
        this.from = from,
        this.to = to,
        this.result = {
            method: this.#method,
            params: [
                this.from,
                this.to
            ]
        }
        this.init()
    }
    init(){
        return this.result
    }
}

class Transaction extends Balance{
    #method = 'eth_sendTransaction'

    constructor(from, to, amount){
        super(from, to)
        this.amount = amount,
        this.result = {
            method: this.#method,
            params: [{
                from: this.from,
                to: this.to,
                value: (this.amount * 1e18).toString(16),
                gas: Number(21000).toString(16),
                gasPrice: Number(25000000).toString(16)
            }]
        }
        this.init()
    }
    init(){
        return this.result
    }
}

export {Account, Balance, Transaction}