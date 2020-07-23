'use strict';

const pathNumbers = function (d) {
  const dSimp = d.replace(/[^\de.-]|,/g, ' '), response = [];
  let currentNumber = '';

  for (let c = 0; c < dSimp.length; c++) {
    if ([' ', '-', '.'].indexOf(dSimp[c]) === -1) {
      currentNumber += dSimp[c];
    } else if (dSimp[c] === '.') {
      if (currentNumber.indexOf('.') > -1 && currentNumber !== '') {
        response.push(parseFloat(currentNumber));
        currentNumber = '';
      }
      currentNumber += dSimp[c];
    } else if (dSimp[c] === '-') {
      if (currentNumber !== '') {
        response.push(parseFloat(currentNumber));
        currentNumber = '';
      }
      currentNumber += dSimp[c];
    } else {
      if (currentNumber !== '') {
        response.push(parseFloat(currentNumber));
      }
      currentNumber = '';
    }
    if (c === dSimp.length - 1 && currentNumber !== '') {
      response.push(parseFloat(currentNumber));
    }
  }
  return response;
};

const maxFloatingNumbers = function (numbers, min, max) {
  min = !min ? 0 : Math.max(0, min);
  max = !max ? Infinity : Math.max(min, max);
  let response = min, _nString;
  for (let n = 0; n < numbers.length; n++) {
    _nString = parseFloat(numbers[n]).toString();
    if (_nString.indexOf('.') === -1) {
      continue;
    }
    response = Math.max(_nString.replace(/[0-9-]+\./, '').length, response);
  }
  return Math.min(response, max);
};

module.exports = {
  pathNumbers,
  maxFloatingNumbers,
};
