const moment = require('moment');

const date = moment();
// date.add(100, 'year');

console.log(date.format('MMM Do, YYYY'));
console.log(date.format('hh:mm A'));
