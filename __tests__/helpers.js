const fs = require('fs');
const path = require('path');

const renderDOM = async (filename) => {
  const filepath = path.join(process.cwd(), filename);
  const html = fs.readFileSync(filepath, 'utf8');
  
  // Use the jsdom environment that Jest provides
  document.body.innerHTML = html;
  
  // Trigger DOMContentLoaded if needed
  const event = new Event('DOMContentLoaded');
  document.dispatchEvent(event);
};

module.exports = {
  renderDOM
};

// Dummy test for helper file  
test('dummy test', () => {
  expect(true).toBe(true);
});