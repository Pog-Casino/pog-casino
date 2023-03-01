document.addEventListener("alpine:init", () => {
  /*
   * Access the parent web component from an element
   * It only works for custon elements using ShadowDOM
   */
  Alpine.magic("wc", (el) => {
    return el.getRootNode()?.host;
  });

  Alpine.magic("wca", (el) => {
    const e = el.getRootNode()?.host.attributes;
    const map = {};
    for (let o of Object.keys(e)) {
      const v = e[o];
      map[v.name] = v.value;
    }
    console.log(map);
    return map;
  });
});
