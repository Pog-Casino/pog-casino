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

      connectedCallback() {
        const shadow = this.shadowRoot;
        const comingSoon = this.getAttribute("comingSoon") == "true";
        const span = shadow.querySelector("a > span");
        if (!comingSoon) {
          span.remove();
        }
      }
    }
    window.customElements.define("game-card", Component);
  }
});
