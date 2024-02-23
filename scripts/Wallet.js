

export default class Wallet{
    #eth = window.ethereum

    constructor(){
        this.status = this.#eth ? true : false

        this.initWallet()
    }

    initWallet(){
        console.log(this.status)
    }

    // Gets Metamask public keys
    async getAccounts(){
        if(this.status){
            try {
                const accounts = await this.#eth.request({
                    method: 'eth_requestAccounts'
                })
                console.log(typeof accounts)
                return accounts
            } catch (error) {
                return false
            }
        }
    }

    // Checks balance
    async checkBalance(accountKey){

        try {
            const balance = await this.#eth.request({
                method: 'eth_getBalance',
                params: [
                    accountKey,
                    'latest'
                ]
            })
            const parsedBalance = parseInt(balance) / Math.pow(10, 18)
            return parsedBalance
        } catch (error) {
            return error
        }
    }

    // Sends a transaction...
    async sendTransaction(sender, reciever, amount){
        try {
            const params = [{
                from: sender,
                to: reciever,
                value: (amount * 1e18).toString(16),
                gas: Number(21000).toString(16),
                gasPrice: Number(25000000).toString(16)
            }]
            const recipe = await this.#eth.request({ 
                // method: "eth_blockNumber", 
                method: 'eth_sendTransaction',
                params: params });
            
            return recipe
        } catch (error) {
            return error
        }
    }
}