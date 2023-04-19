import State from './core/state';
import { debounce, $ } from './utils/common';
import { CsvTable } from './utils/csv';
import SearchInput from './components/search-input';
import SearchResults from './components/search-results';

const DEBOUNCE_MS = 100;

export default class App extends State {
  private dataTable!: CsvTable;

  private readonly inputElement = $('search-input')!;
  private readonly resultsElement = $('search-results')!;

  private inputComponent!: SearchInput;
  private resultsComponent!: SearchResults;

  private debouncedSearch: (...args: unknown[]) => void;

  constructor() {
    super();

    this.debouncedSearch = debounce(this.search, DEBOUNCE_MS, this);

    this.inputComponent = new SearchInput(this.inputElement, {
      onInputValue: (value: string) => this.debouncedSearch(value),
      onInputClear: () =>
        this.setState({ resultList: this.dataTable.getAll() }),
    });

    this.addEventListener('statechange', () => this.renderResults());
  }

  async start() {
    try {
      const response = await fetch('data.csv');
      this.dataTable = new CsvTable(await response.text());
      this.setState({ resultList: this.dataTable.getAll() });
    } catch (err) {
      console.error(err);
    }
  }

  search(queryText: string) {
    const resultList = this.dataTable.search(queryText);
    this.setState({ resultList });
  }

  private renderResults() {
    const { resultList } = this.getState();

    this.resultsComponent?.destroy?.();
    if (!resultList) return;

    this.resultsComponent = new SearchResults(this.resultsElement, {
      resultList,
    });
  }
}
