(() => {
  'use strict';
  class t extends Event {
    constructor(t) {
      super('statechange'), (this.state = t);
    }
  }
  class e extends EventTarget {
    constructor(t = {}) {
      super(), (this.state = t);
    }
    setState(e) {
      e !== this.state && ((this.state = e), this.dispatchEvent(new t(e)));
    }
    getState() {
      return Object.assign({}, this.state);
    }
  }
  const s = (t) => document.querySelector(t);
  class n extends e {
    constructor(t, e = {}) {
      var s;
      super(),
        (this.element = t),
        (this.props = e),
        null === (s = this.init) || void 0 === s || s.call(this),
        this.render();
    }
    template() {
      return '';
    }
    render() {
      var t;
      (this.element.innerHTML = this.template()),
        null === (t = this.didMount) || void 0 === t || t.call(this);
    }
    destroy() {
      var t;
      (this.element.innerHTML = ''),
        null === (t = this.didUnmount) || void 0 === t || t.call(this),
        (this.props = {});
    }
  }
  class i extends n {
    init() {
      this.handleInput = this.onInputChange.bind(this);
    }
    didMount() {
      (this.input = this.element.querySelector('input')),
        this.input.addEventListener('input', this.handleInput);
    }
    onInputChange() {
      const { value: t } = this.input,
        { onInputValue: e, onInputClear: s } = this.props;
      t ? null == e || e(t) : null == s || s();
    }
    setValue(t) {
      (this.input.value = t), this.onInputChange();
    }
    reset() {
      var t;
      this.setValue(''), null === (t = this.input) || void 0 === t || t.focus();
    }
    template() {
      const t = 'search-label';
      return `\n      <label id="${t}" for="search" class="visuallyhidden">Search for universities</label>\n      <input type="search" id="search" placeholder="Search..." aria-labelledby="${t}">\n    `;
    }
    destroy() {
      var t;
      null === (t = this.input) ||
        void 0 === t ||
        t.removeEventListener('input', this.handleInput),
        (this.input = null),
        super.destroy();
    }
  }
  new (class extends e {
    constructor() {
      super(),
        (this.inputElement = s('search-input')),
        (this.resultsElement = s('search-results')),
        (this.debouncedSearch = (function (t, e = 0, s) {
          let n = null;
          return (...i) => {
            n && window.clearTimeout(n),
              (n = window.setTimeout(
                () => (null == t ? void 0 : t.apply(s, i)),
                e
              ));
          };
        })(this.search, 100, this)),
        (this.inputComponent = new i(this.inputElement, {
          onInputValue: (t) => this.debouncedSearch(t),
          onInputClear: () => this.setState({ resultList: null }),
        }));
    }
    async start() {}
    search(t) {
      console.log(t);
    }
  })()
    .start()
    .catch(console.error);
})();
