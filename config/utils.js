const { asyncConfig } = require('config/async');

function test() {
  return asyncConfig(() => {
    return new Promise((res) => {
      setTimeout(() => {
        res(122222);
      }, 5000);
    });
  });
}
module.exports = {
  fromTest: test
};
