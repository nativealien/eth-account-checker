

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