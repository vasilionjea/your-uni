export const $ = (selector: string) => document.querySelector(selector);

export const isString = (val: unknown) => typeof val === 'string';

export function debounce(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (...args: any[]) => void,
  ms = 0,
  context?: object
) {
  let timer: number | null = null;
  return (...args: unknown[]) => {
    timer && window.clearTimeout(timer);
    timer = window.setTimeout(() => callback?.apply(context, args), ms);
  };
}
