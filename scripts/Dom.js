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
        document.addEventListener('click', e => {
            const accKeys = document.querySelector('.account-bar .div-mm')
            this.removeChildren(accKeys, '.input-key')
        })
        const mmBtns = document.querySelectorAll('.button-mm')
        const goBtns = document.querySelectorAll('.button-go')

        mmBtns.forEach( btn => { btn.addEventListener('click', e => { this.eventMm(e) } ) })
        // goBtns.forEach( btn => { btn.addEventListener('click', this.eventMm()) })
    }

    async eventMm(event){
        const parent = event.target.parentNode
        const inputKey = parent.querySelector(`.input-key`)
        const target = parent.querySelector(`.div-mm`)
        const keys = await this.wallet.getAccounts()

        this.removeChildren(target, '.input-key')

        keys.forEach( key => {
            const input = inputKey.cloneNode(true)
            input.type = 'submit'
            input.value = key
            input.style.cursor = 'pointer'
            this.eventInputMm(input, target)
            target.appendChild(input)
        })
    }

    eventInputMm(input, target){
        // this.removeChildren(target, '.input-key')
        input.addEventListener('click', async () => {
            const balance = await this.wallet.checkBalance(input.value)
            console.log(balance)
        })
    }

    // Tools...
    removeChildren(parent, className){
        const children = parent.querySelectorAll(className)
        children.forEach( child => {
            parent.removeChild(child)
        })
    }

}

