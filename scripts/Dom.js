import Explorer from "./Explorer.js";
// import Wallet from "./Wallet.js";

export default class Dom {
  #keysArr
  #accKey;
  #resKey;
  #trxHash;

  constructor() {
    this.account = document.querySelector(".account");
    this.valueBar = document.querySelector(".value-bar");
    this.receive = document.querySelector(".receive-bar");

    this.blocks = document.querySelector("#blocks");
    this.value = document.querySelector("#value");
    this.msg = document.querySelector("#msg");

    this.explorer = new Explorer('https://sepolia.infura.io/v3/d5fd8992e2eb410992c4324f20fa3895');
    this.initDom();
  }

  async initDom() {
    document.addEventListener("click", (e) => {
      document.querySelectorAll(".div-mm").forEach((div) => {
        this.removeChildren(div, ".input-key");
      });
    });

    this.blocks.textContent = await this.explorer.getTotalBlocks()

    const mmBtns = document.querySelectorAll(".button-mm");
    const goBtns = document.querySelectorAll(".button-go");

    mmBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.eventMm(e);
      });
    });
    goBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.eventGo(e);
      });
    });

    this.eventClose()
  }

  async eventMm(event) {
    this.#keysArr = await this.explorer.getAccounts();

    if (!this.explorer.status) {
      this.msg.textContent = "You dont seem too have Metamask... ";
      event.target.style.backgroundColor = "red";
    } else if (typeof this.#keysArr === "object") {
      this.msg.textContent = "Grate, you have Metamask! ";
      const parent = event.target.parentNode;
      const inputKey = parent.querySelector(`.input-key`);
      const target = parent.querySelector(`.div-mm`);
      this.#keysArr = await this.explorer.getAccounts();
      this.removeChildren(target, ".input-key");

      this.#keysArr.forEach((key) => {
        const input = inputKey.cloneNode(true);
        input.type = "submit";
        input.value = key;
        input.style.cursor = "pointer";
        input.addEventListener("click", () => {
          inputKey.value = key;
        });
        target.appendChild(input);
      });
    } else {
      this.msg.textContent = "You already have a pending request in Metamask.";
    }
  }

  async eventGo(e) {
    if (e.target.parentNode.className === "account-bar") {
      this.#accKey =
        e.target.parentNode.querySelector(".input-key").value !== ""
          ? e.target.parentNode.querySelector(".input-key").value
          : false;
      if (this.#accKey !== false) {
        await this.balanceDisplay();
      } else {
        this.msg.textContent = "The key field is empty...";
      }
    } else {
      this.#resKey = e.target.parentNode.querySelector(".input-key").value;
      const value = parseFloat(document.querySelector(".input-value").value);

      if (this.#accKey === this.#resKey) {
        this.msg.textContent = "You can't send funds to the same key...";
      } else if (this.#resKey.trim() === "") {
        this.msg.textContent =
          "Write a receiving adress in the input field...";
      } else if (!isFinite(value) || value <= 0) {
        this.msg.textContent = "You have to put in a valid amount of ETH.";
      } else {
        this.#trxHash = await this.explorer.sendTransaction(
          this.#accKey,
          this.#resKey,
          value
        );
        if (typeof this.#trxHash === "string") {
          this.msg.textContent =
            "Off he goes! Hope the network isn't too busy...";
          this.liftBaloon();
        }
      }
    }
  }

  loggInAccountDelay = () => {
    this.loggAccount(false);
    setTimeout(() => this.loggAccount(true), 500);
  };

  balanceDisplay = async () => {
    const balance = await this.explorer.balanceAccount(this.#accKey);
    if (typeof balance === "number") {
      this.value.textContent = `Account balance: ${balance} ETH`;
      this.loggInAccountDelay(true);
    } else {
      const newBalance = await this.explorer.balanceExplore(this.#accKey);
      if (isFinite(newBalance) && newBalance !== false) {
        this.value.textContent = `Account balance: ${newBalance} ETH`;
        this.loggInAccountDelay(true);
      } else {
        this.msg.textContent = "Something wrong with that key...";
      }
    }
  };

  eventClose() {
    const buttonClose = document.querySelector(".button-close");
    buttonClose.addEventListener("click", () => {
      this.msg.textContent = "Closing account, feel free to enter a new key! Doesnt have to be with Metamask.";
      this.loggAccount(false);
      this.resetInputs();
    });
  }

  liftBaloon() {
    const baloon = document.getElementById("baloon-wrap");
    const eth = document.querySelector("#eth");
    if ((baloon.style.bottom = "-30px")) {
      eth.style.display = "block";
      baloon.style.bottom = "250px";
    }
    setTimeout(() => {
      this.msg.textContent =
        "Hey! Hes comming back now, thats got to be a good sign...";
      eth.style.display = "none";
      baloon.style.bottom = "-30px";
    }, 20000);
  }

  loggAccount(check) {
    let accountHeight = "36px";
    let receiveTop = "0px";
    let valueBarTop = "0px";

    if (check) {
      if (this.explorer.status && Array.isArray(this.#keysArr)) {
        if (this.#keysArr.includes(this.#accKey)) {
          this.msg.textContent = "Account loaded with Metamask. You can send transactions. ";
          accountHeight = "96px";
          valueBarTop = "60px";
          receiveTop = "30px";
        } else {
          this.msg.textContent = "Account loaded without Metamask. No transactions can be made. ";
          accountHeight = "66px";
          receiveTop = "0px";
          valueBarTop = "30px";
        }
      } else {
        accountHeight = "66px";
        valueBarTop = "30px";
      }
    }
    this.account.style.height = accountHeight;
    this.receive.style.top = receiveTop;
    this.valueBar.style.top = valueBarTop;
  }

  // Tools...
  removeChildren(parent, className) {
    const children = parent.querySelectorAll(className);
    children.forEach((child) => {
      parent.removeChild(child);
    });
  }

  resetInputs() {
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
      input.value = "";
    });
  }
}
