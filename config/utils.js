const { asyncConfig } = require('config/async');

function test(options) {
  return asyncConfig(() => {
    return new Promise((res) => {
      setTimeout(() => {
        console.log(options);
        res(122222);
      }, 5000);
    });
  });
}
module.exports = {
  fromTest: test
};
