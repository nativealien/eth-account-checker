import Explorer from "./Explorer.js"
import Wallet from "./Wallet.js"


export default class Dom{
    #account = document.querySelector('.account')
    #accountDetails = document.querySelector('.account-info')
    #transaction = document.querySelector('.receive-bar')
    #content = document.querySelector('.content-info')

    #accKey;
    #resKey;

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
        })
        const mmBtns = document.querySelectorAll('.button-mm')
        const goBtns = document.querySelectorAll('.button-go')

        mmBtns.forEach( btn => { btn.addEventListener('click', e => { this.eventMm(e) })})
        goBtns.forEach( btn => { btn.addEventListener('click', e => { this.eventGo(e) })} )
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
            input.addEventListener('click', async () => {
                inputKey.value = key
            })
            target.appendChild(input)
        })
    }

    async eventGo(e){
        if(e.target.parentNode.className === 'account-bar'){
            this.#accKey = e.target.parentNode.querySelector('.input-key').value
            const balance = await this.wallet.checkBalance(this.#accKey)
            if(this.#accKey !== '' && balance){
                console.log('SANT!')
                const receiveBar = document.querySelector('.receive-bar')
                receiveBar.style.top = '33px'
                this.#content.innerHTML = `
                    <h2>${this.#accKey}</h2>
                    <p>Account value: ${balance}</p>
                `
            }
        }else{
            this.#resKey = e.target.parentNode.querySelector('.input-key').value
            if(this.#accKey === this.#resKey){
                console.log('You cant send funds to same key...')
            }else{
                const baloon = document.getElementById('popup')
                if(baloon.style.bottom = '-10px'){
                    baloon.style.bottom = '200px'
                }
                setTimeout(()=>{
                    baloon.style.bottom = '-10px'
                },20000)
            }
        }
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

