import Explorer from "./Explorer.js";
import Wallet from "./Wallet.js";

export default class Dom {
  #account = document.querySelector(".account");
  #valueBar = document.querySelector(".value-bar");
  #receive = document.querySelector(".receive-bar");

  #blocks = document.querySelector("#blocks");
  #value = document.querySelector("#value");
  #msg = document.querySelector("#msg");

  #keyArr;
  #accKey;
  #resKey;
  #trxHash;

  constructor() {
    this.explorer = new Explorer();
    this.wallet = new Wallet();
    this.initDom();
  }

  initDom() {
    document.addEventListener("click", (e) => {
      document.querySelectorAll(".div-mm").forEach((div) => {
        this.removeChildren(div, ".input-key");
      });
    });
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

    const buttonClose = document.querySelector(".button-close");
    buttonClose.addEventListener("click", () => {
      this.loggAccount(false);
    });
  }

  async eventMm(event) {
    const keys = await this.wallet.getAccounts();

    if (!this.wallet.status) {
      this.#msg.textContent = "You dont seem too have Metamask... ";
      event.target.style.backgroundColor = "red";
    } else if (typeof keys === "object") {
      const parent = event.target.parentNode;
      const inputKey = parent.querySelector(`.input-key`);
      const target = parent.querySelector(`.div-mm`);
      const keys = await this.wallet.getAccounts();
      this.removeChildren(target, ".input-key");

      keys.forEach((key) => {
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
      this.#msg.textContent = "You already have a pending request in Metamask.";
    }
    this.#keyArr = keys;
  }

  async eventGo(e) {
    if (e.target.parentNode.className === "account-bar") {
      this.#accKey =
        e.target.parentNode.querySelector(".input-key").value !== ""
          ? e.target.parentNode.querySelector(".input-key").value
          : false;
      console.log(this.#accKey);
      if (this.#accKey !== false) {
        await this.balanceDisplay();
      } else {
        this.#msg.textContent = "The key field is empty...";
      }
    } else {
      this.#resKey = e.target.parentNode.querySelector(".input-key").value;
      const value = parseFloat(document.querySelector(".input-value").value);

      if (this.#accKey === this.#resKey) {
        this.#msg.textContent = "You can't send funds to the same key...";
      } else if (this.#resKey.trim() === "") {
        this.#msg.textContent =
          "Write a receiving adress in the input field...";
      } else if (!isFinite(value) || value <= 0) {
        this.#msg.textContent = "You have to put in a valid amount of ETH.";
      } else {
        this.#trxHash = await this.wallet.sendTransaction(
          this.#accKey,
          this.#resKey,
          value
        );
        if (typeof this.#trxHash === "string") {
          this.#msg.textContent =
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
    const balance = await this.wallet.checkBalance(this.#accKey);
    if (typeof balance === "number") {
      // Assuming balance can be truthy for valid cases
      this.#value.textContent = `Account balance: ${balance} ETH`;
      this.loggInAccountDelay(true);
    } else {
      const newBalance = await this.explorer.checkBalance(this.#accKey);
      if (isFinite(newBalance) && newBalance !== false) {
        this.#value.textContent = `Account balance: ${newBalance} ETH`;
        this.loggInAccountDelay(true);
      } else {
        this.#msg.textContent = "Something wrong with that key...";
      }
    }
  };

  eventClose() {
    const buttonClose = document.querySelector(".button-close");
    buttonClose.addEventListener("click", () => {
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
      this.#msg.textContent =
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
      if (this.wallet.status && Array.isArray(this.#keyArr)) {
        if (this.#keyArr.includes(this.#accKey)) {
          accountHeight = "96px";
          valueBarTop = "60px";
          receiveTop = "30px";
        } else {
          accountHeight = "66px";
          receiveTop = "0px";
          valueBarTop = "30px";
        }
      } else {
        accountHeight = "66px";
        valueBarTop = "30px";
      }
    }
    this.#account.style.height = accountHeight;
    this.#receive.style.top = receiveTop;
    this.#valueBar.style.top = valueBarTop;
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
    console.log("HALLÅ!!!!!");
    inputs.forEach((input) => {
      input.value = "";
    });
  }
}
