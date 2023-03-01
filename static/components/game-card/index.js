if (!customElements.get("game-card")) {
  const parser = new DOMParser();
  const resp = await fetch(import.meta.resolve("./template.html"));
  const html = await resp.text();
  console.log(html);
  const template = parser.parseFromString(html, "text/html").querySelector(
    "template",
  );

  class GameCard extends HTMLElement {
    constructor() {
      super();

      this.attachShadow({ mode: "open" }).appendChild(
        template.content.cloneNode(true),
      );
    }

    connectedCallback() {
      const shadow = this.shadowRoot;
      const a = shadow.querySelector("a");
      a.href = this.getAttribute("url");
      const comingSoon = this.getAttribute("comingSoon") == "true";
      a.style = comingSoon ? "pointer-events: none" : "";
      const span = a.querySelector("span");
      if (!comingSoon) {
        span.remove();
      }
      a.querySelector("img").src = this.getAttribute("image");
      a.querySelector("h3").innerText = this.getAttribute("title");
    }
  }
  window.customElements.define("game-card", GameCard);
}
