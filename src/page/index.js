import './index.css';

console.log('hi i am bob');
const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
const theme = urlParams.get('theme')
console.log(theme);
