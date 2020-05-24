class iReactive {
  constructor({ data, mounted }) {
    const dataToProxy = data();

    this.allDynamicElements = document.querySelectorAll("*[i-data]");
    this.allDynamicBinds = document.querySelectorAll("*[i-bind]");
    this.allDynamicInput = document.querySelectorAll("*[i-model]");

    this.$data = new Proxy(dataToProxy, {
      get: (target, name) => {
        return name in target ? target[name] : "";
      },
      set: (target, name, val) => {
        target[name] = val;
        this._render();
      }
    });

    this.allDynamicInput.forEach(el => {
      el.addEventListener("input", () => {
        Reflect.set(this.$data, el.getAttribute("i-model"), el.value);
      });
    });

    this._render();
    Reflect.apply(mounted, this.$data, []);
  }

  _render() {
    this.allDynamicElements.forEach(el => {
      const content = Reflect.get(this.$data, el.getAttribute("i-data"));
      el.innerText = content;
    });

    this.allDynamicBinds.forEach(el => {
      const [attr, target] = el.getAttribute("i-bind").match(/(\w+)/g);

      const content = Reflect.get(this.$data, target);
      el.setAttribute(attr, content);
    });

    this.allDynamicInput.forEach(el => {
      const content = Reflect.get(this.$data, el.getAttribute("i-model"));
      el.value = content;
    });
  }
}
