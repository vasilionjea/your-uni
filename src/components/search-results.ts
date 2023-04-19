import Component from '../core/component';
import { CsvRecord } from '../utils/csv';
import { getUrlObject, getDisplayUrl } from '../utils/url';

type Props = {
  resultList: CsvRecord[];
};

/**
 * SearchResults component
 */
export default class SearchResults extends Component {
  template(): string {
    const { resultList } = this.props as Props;
    if (!resultList) return '';

    return resultList.length ?
      this.resultsHtml(resultList) :
      this.noResultsHtml();
  }

  private recordHtml(record: CsvRecord) {
    const { instnm, city, stabbr, insturl } = record.toJSON();
    const urlObject = getUrlObject(insturl);
    const urlDisplay = getDisplayUrl(urlObject);
    return `
      <article>
        <p class="address">${city} &bull; ${stabbr}</p>
        <h3 class="name">${instnm}</h3>
        <a href="${urlObject.toString()}" target="_blank" rel="noreferrer">${urlDisplay}</a>
      </article>
    `;
  }

  private resultsHtml(resultList: CsvRecord[]): string {
    return resultList?.reduce((html: string, record: CsvRecord) => {
      return html + this.recordHtml(record);
    }, '');
  }

  private noResultsHtml() {
    return `<p>No results found.</p>`;
  }
}
