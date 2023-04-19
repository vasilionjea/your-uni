export type CsvHeaders = string[];
export type CsvRows = string[][];
export type ParserResult = {
  headers: CsvHeaders;
  rows: CsvRows;
};

const ROW_SPLITTER = /\r?\n/;
const VALUE_DELIMITER = /,/;

/**
 * Naive CSV Parser
 */
export function csvParse(csvContents: string): ParserResult {
  const data = csvContents.split(ROW_SPLITTER).filter(Boolean);
  const headers = data[0].toLowerCase().split(VALUE_DELIMITER);
  const rows = data.slice(1).map(row => row.split(VALUE_DELIMITER));
  return { headers, rows };
}

/**
 * CSV Record
 */
export class CsvRecord {
  private attrs: Map<string, string>;

  constructor(headers: string[], data: string[]) {
    this.attrs = new Map(headers.map((name, i) => [name, data[i]]));
  }

  get(key: string) {
    return this.attrs.get(key);
  }

  has() { /* TODO */ }
  set() { /* TODO */ }

  /**
   * Allows record to be stringified using `JSON.stringify(record)`
   * for either localStorage or transmission.
   */
  toJSON() {
    return Object.fromEntries(this.attrs);
  }
}

/**
 * CSV Table
 */
export class CsvTable {
  private headers: CsvHeaders;
  private rows: CsvRows;

  constructor(csvContents: string) {
    const { headers, rows } = csvParse(csvContents);
    this.headers = headers;
    this.rows = rows;
  }

  createRecords(rows: CsvRows): CsvRecord[] {
    return rows.map(data => new CsvRecord(this.headers, data));
  }

  getAll() {
    return this.createRecords(this.rows);
  }

  /**
   * TODO: strip bad chars.
   */
  parseQuery(rawQuery: string) {
    const query = rawQuery.trim().toLowerCase();
    return query.split(/\s+/g);
  }

  /**
   * Performs a naive AND fuzzy search.
   * Returns the csv records that contain all query terms.
   *
   * TODO: sort/rank results. Ignore stopwords like "the", "of", etc.
   */
  search(rawQuery = ''): CsvRecord[] {
    const queryTerms = this.parseQuery(rawQuery);
    const result = this.rows.filter(row => {
      const content = row.join(' ').toLowerCase();
      return queryTerms.every(term => content.includes(term));
    });

    return this.createRecords(result);
  }

  /**
   * Allows table to be stringified using `JSON.stringify(table)`
   * for either localStorage or transmission.
   */
  toJSON() {
    return {
      headers: structuredClone(this.headers),
      rows: structuredClone(this.rows),
    };
  }
}
