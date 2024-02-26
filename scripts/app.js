import Dom from "./Dom.js";
import { Account, Balance, Transaction } from "./transactions.js";

// There just has to be an initApp =)
const initApp = () => {
    new Dom()

    const account = new Account()
    const balance = new Balance('0x38f2df4b849b663442c0003581ea58f276015e13', 'latest')
    const trx = new Transaction('0x38f2df4b849b663442c0003581ea58f276015e13', '0x02638bf7c78e805f9ec1bd36d10d4c7e0c700138', 0.00001)

    console.log(account)
    

}

document.addEventListener('DOMContentLoaded', initApp)