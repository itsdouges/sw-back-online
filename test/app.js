import * as sw from '../dist/index.js';

console.log(sw);

const form = document.getElementById('form');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = document.getElementById('name').value;
  sw.post({ data });
});
