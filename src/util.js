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

const toRadians = function (degrees) {
  return degrees * Math.PI / 180;
};

const angleBetween = function (v0, v1) {
  const p = v0[0] * v1[0] + v0[1] * v1[1];
  const n = Math.sqrt((Math.pow(v0[0], 2) + Math.pow(v0[1], 2)) * (Math.pow(v1[0], 2) + Math.pow(v1[1], 2)));
  return (v0[0] * v1[1] - v0[1] * v1[0] < 0 ? -1 : 1) * Math.acos(p / n);
};

const maxFloatingNumbers = function (numbers, min, max) {
  if (!min) {
    min = 1;
  } else {
    min = Math.max(1, min);
  }
  if (!max) {
    max = 3;
  }
  max = Math.max(min, max);
  let response = min, _nString;
  for (let n = 0; n < numbers.length; n++) {
    _nString = parseFloat(numbers[n]).toString();
    if (_nString.indexOf('.') === -1) {
      continue;
    }
    response = Math.max(_nString.replace(/\d+\./, '').length, response);
  }
  return Math.min(response, max);
};

module.exports = {
  pathNumbers,
  toRadians,
  angleBetween,
  maxFloatingNumbers,
};
