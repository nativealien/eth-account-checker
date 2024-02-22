import Explorer from "./Explorer.js"
import Wallet from "./Wallet.js"


export default class Dom{
    #account = document.querySelector('.account')
    #accountDetails = document.querySelector('.account-info')
    #transaction = document.querySelector('.receive-bar')
    #content = document.querySelector('.content-info')

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
            document.querySelectorAll('.div-mm').forEach( div => {
                this.removeChildren(div, '.input-key')
            })
            this.eventGo()
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
            this.eventInputMm(parent, input, key, inputKey)
            target.appendChild(input)
        })
    }

    eventInputMm(parent, input, key, inputKey){
        input.addEventListener('click', async () => {
            inputKey.placeholder = key
            console.log(parent)
            if(parent === 'account'){
                const balance = await this.wallet.checkBalance(input.value)
                this.loggAccount(balance)
            }
        })
    }

    eventGo(){
        const go = document.querySelector('.receive-bar .button-go')
        go.addEventListener('click', e => {
            const baloon = document.getElementById('popup')
            baloon.style.bottom = '200px'
            // baloon.style.right = '100px'
            setTimeout(()=>{
                baloon.style.bottom = '-10px'
            },30000)
        })
    }

    loggAccount(balance){
        this.#accountDetails.style.top = '35px'
        this.#transaction.style.top = '33px'
        console.log(balance)
        const valueSpan = document.querySelector('#account-balance')
        valueSpan.textContent = balance

    }

    // Tools...
    removeChildren(parent, className){
        const children = parent.querySelectorAll(className)
        children.forEach( child => {
            parent.removeChild(child)
        })
    }

}

