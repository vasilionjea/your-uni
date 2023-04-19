import App from '../src/app';

let app: App;

beforeEach(() => {
  app = new App();
  app.start();
});

test('it is expected TODO', () => {
  expect(true).toBe(true);
});
