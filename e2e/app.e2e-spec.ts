import { NgRomaPage } from './app.po';

describe('ng-roma App', function() {
  let page: NgRomaPage;

  beforeEach(() => {
    page = new NgRomaPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
