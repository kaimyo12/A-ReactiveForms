import { ARvalidPage } from './app.po';

describe('a-rvalid App', () => {
  let page: ARvalidPage;

  beforeEach(() => {
    page = new ARvalidPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
