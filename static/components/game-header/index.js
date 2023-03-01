document.addEventListener("alpine:init", async () => {
  const parser = new DOMParser();
  const resp = await fetch(import.meta.resolve("./template.html"));
  const html = await resp.text();
  const template = parser.parseFromString(html, "text/html").querySelector(
    "template",
  );
  if (!customElements.get("game-card")) {
    class Component extends HTMLElement {
      state = Alpine.reactive({});

      constructor() {
        super();

        const shadow = this.attachShadow({ mode: "open" });
        shadow.appendChild(
          template.content.cloneNode(true),
        );

        Alpine.addScopeToNode(shadow, this.state);
        Alpine.initTree(shadow);
      }
    }
    window.customElements.define("game-header", Component);
  }
});

document.addEventListener("alpine:init", () => {
  const BALANCE_ANIMATION_TIME_MS = 2000;

  class Account {
    static getAccount() {
      return Alpine.store("account");
    }

    constructor() {
      this.username = "Loading...";
      this.__balance = 0;
      this.animatedBalance = 0;
      this.__animationToken = undefined;

      const shared_worker = new SharedWorker("/workers/websocket-worker.js");
      shared_worker.port.onmessage = (ev) => {
        console.log("From worker:", ev);
      };
      shared_worker.port.start();
    }

    username;
    __balance;
    animatedBalance;
    __animationToken;

    get balance() {
      return this.__balance;
    }

    set balance(newValue) {
      this.__balance = newValue;
      const self = this;
      const startTime = performance.now();
      const startValue = this.animatedBalance;
      const toAnimate = newValue - startValue;
      function animateBalance() {
        if (self.__animationToken) {
          cancelAnimationFrame(self.__animationToken);
        }
        self.__animationToken = requestAnimationFrame((t) => {
          self.__animationToken = undefined;
          const timeDiff = t - startTime;
          if (timeDiff > BALANCE_ANIMATION_TIME_MS) {
            self.animatedBalance = startValue + toAnimate;
          } else {
            self.animatedBalance = Math.round(
              startValue + toAnimate * (timeDiff / BALANCE_ANIMATION_TIME_MS),
            );
            animateBalance();
          }
        });
      }
      animateBalance();
    }
  }
  Alpine.store("account", new Account());
});
