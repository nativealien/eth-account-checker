import { Account, Balance, Transaction } from "./transactions.js"


export default class Explorer extends Web3{

    constructor(provider){
        super(provider)

        this.ether = window.ethereum
        this.status = this.ether ? true : false
    }

    // -----------------------------------------------
    // Web3.js Methods
    async getTotalBlocks(){
        return parseInt(await this.eth.getBlockNumber())
    }

    async getTopTen(){
        const latest = await this.getTotalBlocks()
        for(let i = 0; i < 15; i++){
            const block = await this.eth.getBlock(latest - i)
            listTopTen(block)
        }
    }

    async balanceExplore(key){
        console.log('CHECK INIT')
        try {
            console.log('CHECK TRY')
            const balance = await this.eth.getBalance(key)
            console.log(balance)
            const balanceEth = await this.utils.fromWei(balance, 'ether')
            return balanceEth
        } catch (error) {
            console.log('CHECK CATCH')
            return false
        }
    }

     // -----------------------------------------------
     // Metamask Methods
     async getAccounts(){
        if(this.status){
            try {
                const acc = new Account()
                const accounts = await this.ether.request(acc.result)
                console.log(typeof accounts)
                return accounts
            } catch (error) {
                return false
            }
        }
    }

    // Checks balance
    async balanceAccount(accountKey){
        console.log(accountKey)
        try {
            const bal = new Balance(accountKey, 'latest')
            const balance = await this.ether.request(bal.result)
            const parsedBalance = parseInt(balance) / Math.pow(10, 18)
            return parsedBalance
        } catch (error) {
            return error
        }
    }

    // Sends a transaction...
    async sendTransaction(sender, reciever, amount){
        try {
            const trx = new Transaction(sender, reciever, amount)
            // const params = [{
            //     from: sender,
            //     to: reciever,
            //     value: (amount * 1e18).toString(16),
            //     gas: Number(21000).toString(16),
            //     gasPrice: Number(25000000).toString(16)
            // }]
            // const recipe = await this.ether.request({ 
            //     method: 'eth_sendTransaction',
            //     params: params });
            const recipe = await this.ether.request(trx.result);
            
            return recipe
        } catch (error) {
            return error
        }
    }
}