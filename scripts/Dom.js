import Explorer from "./Explorer.js"
import Wallet from "./Wallet.js"


export default class Dom{
    #account = document.querySelector('.account')
    #accountDetails = document.querySelector('.account-info')
    #transaction = document.querySelector('.receive-bar')
    #content = document.querySelector('.content-info')
    #msg = document.querySelector('#msg')

    #accKey;
    #resKey;
    #trxHash;

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
        if(typeof keys === 'object'){
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
        }else{
            console.log('Something is wrong..')
            this.#msg.textContent = 'You dont seem too have Metamask... '
        }
    }

    async eventGo(e){
        if(e.target.parentNode.className === 'account-bar'){
            this.#accKey = e.target.parentNode.querySelector('.input-key').value
            const balance = await this.wallet.checkBalance(this.#accKey)
            if(typeof balance === 'number'){
                this.loggAccount(balance)
            }else{
                console.log(balance.message)
            }
        }else{
            this.#resKey = e.target.parentNode.querySelector('.input-key').value
            const value = parseFloat(document.querySelector('.input-value').value)
            console.log(value === typeof Number)
            if(this.#accKey === this.#resKey){
                this.#msg.textContent = 'You cant send funds to same key...'
            }else if(!isFinite(value)){
                this.#msg.textContent = 'You have to put in amount ETH. Your not the brightest unit around, are you?'
            }else{
                // this.liftBaloon()
                this.#trxHash = await this.wallet.sendTransaction(this.#accKey, this.#resKey, value)
                if(typeof this.#trxHash === typeof ''){
                    this.#msg.textContent = 'Of he goes! Hope the network isnt too busy...'
                    this.liftBaloon()
                }
            }
        }
    }

    liftBaloon(){
        const baloon = document.getElementById('popup-wrap')
        const eth = document.querySelector('#eth-div')
        if(baloon.style.bottom = '-30px'){
            eth.style.display = "block"
            baloon.style.bottom = '250px'
        }
        setTimeout(()=>{
            this.#msg.textContent = 'Hey! Hes comming back now, thats got to be a good sign...'
            eth.style.display = "none";
            baloon.style.bottom = '-30px'
        },20000)
    }

    loggAccount(balance){
        console.log(this.wallet.status)

        const receiveBar = document.querySelector('.receive-bar')
        receiveBar.style.top = '40px'
        this.#content.innerHTML = `
            <h2>Account value: ${balance}</h2>
        `
    }

    // Tools...
    removeChildren(parent, className){
        const children = parent.querySelectorAll(className)
        children.forEach( child => {
            parent.removeChild(child)
        })
    }

}

