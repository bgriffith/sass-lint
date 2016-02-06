'use strict';

var lint = require('./_lint');

//////////////////////////////
// SCSS syntax tests
//////////////////////////////
describe('focus with hover - scss', function () {
  var file = lint.file('focus-with-hover.scss');

  it('[default]', function (done) {
    lint.test(file, {
      'focus-with-hover': 1
    }, function (data) {
      lint.assert.equal(3, data.warningCount);
      done();
    });
  });
});

//////////////////////////////
// Sass syntax tests
//////////////////////////////
describe('focus with hover - sass', function () {
  var file = lint.file('focus-with-hover.sass');

  it('[default]', function (done) {
    lint.test(file, {
      'focus-with-hover': 1
    }, function (data) {
      lint.assert.equal(3, data.warningCount);
      done();
    });
  });
});
