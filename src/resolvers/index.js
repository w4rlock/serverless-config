const GetFromSSM = require('./ssm.js');
const GetFromVault = require('./vault.js');
const GetFromStackOutput = require('./stackOutput.js');

module.exports = {
  GetFromSSM,
  GetFromStackOutput,
  GetFromVault,
};
