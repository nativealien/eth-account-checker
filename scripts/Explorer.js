

export default class Explorer{

    constructor(){
        this.net = 'sepolia'
        this.url = 'https://sepolia.infura.io/v3/d5fd8992e2eb410992c4324f20fa3895'

        this.web3 = new Web3(this.url)

        this.initExplorer()
    }

    initExplorer(){
        // console.log(this.web3)
    }

    async checkBalance(key){
        try {
            const balance = await this.web3.eth.getBalance(key)
            const balanceEth = await this.web3.utils.fromWei(balance, 'ether')
            return balanceEth
        } catch (error) {
            return false
        }
    }

    async getTotalBlocks(){
        return parseInt(await this.web3.eth.getBlockNumber())
    }

    async getTopTen(){
        const latest = await this.getTotalBlocks()
        for(let i = 0; i < 15; i++){
            const block = await this.web3.eth.getBlock(latest - i)
            listTopTen(block)
        }
    }
}