import Explorer from "./Explorer.js"
import Wallet from "./Wallet.js"


export default class Dom{
    
    #account = document.querySelector('.account')
    #valueBar = document.querySelector('.value-bar')
    #receive = document.querySelector('.receive-bar')

    #value = document.querySelector('#value')
    #msg = document.querySelector('#msg')

    #loggedAcc = false;
    #keyArr;
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
        goBtns.forEach( btn => { btn.addEventListener('click', e => { this.eventGo(e) })})

        const buttonClose = document.querySelector('.button-close')
        buttonClose.addEventListener('click', () => {this.loggAccount(false)} )
    }

    async eventMm(event){
        if(!this.wallet.status){
            
            event.target.style.backgroundColor = 'red';
        }
        const parent = event.target.parentNode
        const inputKey = parent.querySelector(`.input-key`)
        const target = parent.querySelector(`.div-mm`)
        const keys = await this.wallet.getAccounts()
        this.#keyArr = keys
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
            this.#msg.textContent = 'You dont seem too have Metamask... '
        }
    }

    async eventGo(e){
        if(e.target.parentNode.className === 'account-bar'){
            this.#accKey = e.target.parentNode.querySelector('.input-key').value
            const balance = await this.wallet.checkBalance(this.#accKey)
            if(typeof balance === 'number'){
                this.#value.textContent = `Account balance: ${balance} ETH`
                this.loggAccount(false)
                setTimeout(() => {
                    this.loggAccount(true)
                }, 500)
            }else{
                const newBalance = await this.explorer.checkBalance(this.#accKey)
                if(newBalance){
                    this.#value.textContent = newBalance
                    this.loggAccount(false)
                    setTimeout(() => {
                    this.loggAccount(true)
                }, 500)
                }else{
                    this.#msg.textContent = 'Something wrong with that key... '
                }
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

    eventClose(){
        const buttonClose = document.querySelector('.button-close')
        buttonClose.addEventListener('click', () => {
            this.loggAccount(false)
            this.resetInputs()} )
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
    // 0xF7A31Ec08ABE12B9FF4B250e168E3E90d8549Fd3
    loggAccount(check){
        console.log(check)
        if(check){
            if(this.wallet.status === true && typeof this.#keyArr === 'object'){
                let test = false;
                this.#keyArr.forEach( key => {
                    if(key === this.#accKey){
                        test = true
                    }
                })
                if(test){
                    this.#account.style.height = "96px";
                    this.#valueBar.style.top = '60px';
                    this.#receive.style.top = '30px';
                }else{
                    this.#account.style.height = "66px";
                    this.#receive.style.top = '0px';
                    this.#valueBar.style.top = '30px';
                }
            }else{
                this.#account.style.height = "66px";
                this.#valueBar.style.top = '30px';
            }
           
        }else{
            this.#account.style.height = "36px";
            this.#receive.style.top = '0px';
            this.#valueBar.style.top = '0px';
        }
    }

    // Tools...
    removeChildren(parent, className){
        const children = parent.querySelectorAll(className)
        children.forEach( child => {
            parent.removeChild(child)
        })
    }

    resetInputs(){
        const inputs = document.querySelectorAll('input')
        console.log("HALLÅ!!!!!")
        inputs.forEach( input => {
            input.value = ''
        })
    }

}

