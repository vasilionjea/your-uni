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
  const s = (t) => document.querySelector(t),
    r = /\r?\n/,
    n = /,/;
  class i {
    constructor(t, e) {
      this.attrs = new Map(t.map((t, s) => [t, e[s]]));
    }
    get(t) {
      return this.attrs.get(t);
    }
    has() {}
    set() {}
    toJSON() {
      return Object.fromEntries(this.attrs);
    }
  }
  class l {
    constructor(t) {
      const { headers: e, rows: s } = (function (t) {
        const e = t.split(r).filter(Boolean);
        return {
          headers: e[0].toLowerCase().split(n),
          rows: e.slice(1).map((t) => t.split(n)),
        };
      })(t);
      (this.headers = e), (this.rows = s);
    }
    createRecords(t) {
      return t.map((t) => new i(this.headers, t));
    }
    getAll() {
      return this.createRecords(this.rows);
    }
    parseQuery(t) {
      return t.trim().toLowerCase().split(/\s+/g);
    }
    search(t = '') {
      const e = this.parseQuery(t),
        s = this.rows.filter((t) => {
          const s = t.join(' ').toLowerCase();
          return e.every((t) => s.includes(t));
        });
      return this.createRecords(s);
    }
    toJSON() {
      return {
        headers: structuredClone(this.headers),
        rows: structuredClone(this.rows),
      };
    }
  }
  class a extends e {
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
  class u extends a {
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
      const t = 'searchLabel',
        e = 'searchInput';
      return `\n      <label id="${t}" for="${e}" class="visuallyhidden">Search for universities</label>\n      <input type="search" id="${e}" placeholder="Search..." aria-labelledby="${t}">\n    `;
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
  const o = /^https?:/;
  class h extends a {
    template() {
      const { resultList: t } = this.props;
      return t ? (t.length ? this.resultsHtml(t) : this.noResultsHtml()) : '';
    }
    recordHtml(t) {
      const { instnm: e, city: s, stabbr: r, insturl: n } = t.toJSON(),
        i = (function (t) {
          let e = t.trim();
          return o.test(e) || (e = `http://${t}`), new URL(e);
        })(n),
        l = (function (t) {
          let { hostname: e, pathname: s } = t;
          return (
            (e = e.replace(/^www./, '')), (s = s.replace(/\/$/, '')), `${e}${s}`
          );
        })(i);
      return `\n      <article>\n        <p class="address">${s} &bull; ${r}</p>\n        <h3 class="name">${e}</h3>\n        <a href="${i.toString()}" target="_blank" rel="noreferrer">${l}</a>\n      </article>\n    `;
    }
    resultsHtml(t) {
      return null == t
        ? void 0
        : t.reduce((t, e) => t + this.recordHtml(e), '');
    }
    noResultsHtml() {
      return '<p>No results found.</p>';
    }
  }
  new (class extends e {
    constructor() {
      super(),
        (this.inputElement = s('search-input')),
        (this.resultsElement = s('search-results')),
        (this.debouncedSearch = (function (t, e = 0, s) {
          let r = null;
          return (...n) => {
            r && window.clearTimeout(r),
              (r = window.setTimeout(
                () => (null == t ? void 0 : t.apply(s, n)),
                e
              ));
          };
        })(this.search, 100, this)),
        (this.inputComponent = new u(this.inputElement, {
          onInputValue: (t) => this.debouncedSearch(t),
          onInputClear: () =>
            this.setState({ resultList: this.dataTable.getAll() }),
        })),
        this.addEventListener('statechange', () => this.renderResults());
    }
    async start() {
      try {
        const t = await fetch('data.csv');
        (this.dataTable = new l(await t.text())),
          this.setState({ resultList: this.dataTable.getAll() });
      } catch (t) {
        console.error(t);
      }
    }
    search(t) {
      const e = this.dataTable.search(t);
      this.setState({ resultList: e });
    }
    renderResults() {
      var t, e;
      const { resultList: s } = this.getState();
      null ===
        (e =
          null === (t = this.resultsComponent) || void 0 === t
            ? void 0
            : t.destroy) ||
        void 0 === e ||
        e.call(t),
        s &&
          (this.resultsComponent = new h(this.resultsElement, {
            resultList: s,
          }));
    }
  })()
    .start()
    .catch(console.error);
})();
