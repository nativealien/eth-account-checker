

export default class Wallet{
    #eth = window.ethereum

    constructor(){
        this.status = this.#eth ? true : false

        this.initWallet()
    }

    initWallet(){
        console.log(this.status)
    }

    async getAccounts(){
        if(this.status){
            try {
                const accounts = await this.#eth.request({
                    method: 'eth_requestAccounts'
                })
                console.log(accounts)
                return accounts
            } catch (error) {
                return false
            }
        }
    }

    async checkBalance(accountKey){
        const balance = await this.#eth.request({
            method: 'eth_getBalance',
            params: [
                accountKey,
                'latest'
            ]
        })

        const parsedBalance = parseInt(balance) / Math.pow(10, 18)

        return parsedBalance
    }

    // Sends a transaction...
    async sendTransaction(sender, reciever, amount){
        const params = [{
            from: sender,
            to: reciever,
            value: amount,
            gas: Number(21000).toString(16),
            gasPrice: Number(25000000).toString(16)
        }]

        const blockHex = await ethereum.request({ 
            method: "eth_blockNumber", 
            params: params });
    }
}