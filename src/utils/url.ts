const HTTP = 'http:';
const PROTOCOL_REGEX = /^https?:/;

export const isUrlObject = (val: unknown) => val instanceof URL;

/**
 * Constructs and returns a URL object from a string.
 */
export function getUrlObject(urlString: string) {
  let result = urlString.trim();

  if (!PROTOCOL_REGEX.test(result)) {
    result = `${HTTP}//${urlString}`;
  }

  return new URL(result);
}

/**
 * Strips 'www' and any trailing slashes for cleaner display
 */
export function getDisplayUrl(urlObject: URL) {
  let { hostname, pathname } = urlObject;

  hostname = hostname.replace(/^www./, '');
  pathname = pathname.replace(/\/$/, '');

  return `${hostname}${pathname}`;
}
