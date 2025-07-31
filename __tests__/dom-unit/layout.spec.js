const { renderDOM } = require('../helpers');

let dom;
let document;

describe('teachers.html', () => {
  beforeEach(async () => {
    dom = await renderDOM('./website/teachers.html');
    document = dom.window.document;
  });

  it('adds new class to the list', () => {
    const input = document.getElementById('new-class');
    const form = document.getElementById('add-class-form');
    const classList = document.getElementById('class-list');

    input.value = 'History';
    form.dispatchEvent(new dom.window.Event('submit'));

    const listItems = classList.querySelectorAll('li');
    const lastItem = listItems[listItems.length - 1];
    expect(lastItem.textContent).toBe('History');
  });

  it('shows top 10 students', () => {
    const topStudents = document.getElementById('top-students');
    expect(topStudents).toBeTruthy();
    const listItems = topStudents.querySelectorAll('li');
    expect(listItems.length).toBeLessThanOrEqual(10);
  });
});
