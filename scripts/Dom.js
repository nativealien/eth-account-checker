import Explorer from "./Explorer.js"
import Wallet from "./Wallet.js"


export default class Dom{
    #accountBar = document.querySelector('.account-bar')
    #accountDetails = document.querySelector('.account-details')
    #receiveBar = document.querySelector('.receive-bar')
    #contentInfo = document.querySelector('.content-info')

    constructor(){
        this.explorer = new Explorer()
        this.wallet = new Wallet()


        this.initDom()
    }

    initDom(){
        this.initButtons()
    }

    // Handle buttons
    initButtons(){
        const mmBtns = document.querySelectorAll('.button-mm')
        const goBtns = document.querySelectorAll('.button-go')

        mmBtns.forEach( btn => { btn.addEventListener('click', e => { this.eventMm(e) } ) })
        // goBtns.forEach( btn => { btn.addEventListener('click', this.eventMm()) })
    }

    async eventMm(event){
        const parent = event.target.parentNode
        const keys = await this.wallet.getAccounts()

        keys.forEach( key => {
            const test = parent.querySelector(`.input-key`).cloneNode(true)
            test.type = 'submit'
            test.value = key
            test.style.cursor = 'pointer'
            parent.appendChild(test)
        })

        console.log(test)
    }

}

