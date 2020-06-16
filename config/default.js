const defer = require('config/defer').deferConfig;
const Utils = require('./utils');
const { GetSSM } = require('../src/resolvers');
const GetStackOutput = require('../src/resolvers/getStackOutput');
const GetVault = require('../src/resolvers/getVault')({
  host: 'vault.corp.com',
  token: '<<<<<<<<<_______TOKEN___HERE___>>>>>>>>>>>>>>>>>>>',
});

const stage = process.env.SLS_STAGE;
// const region = process.env.SLS_INSTANCE_REGION;

module.exports = {
  app: {
    port: 2114,
    file: 'default.js',
    Defaultjs: 'loaded',
    s3Name: defer((cfg) => `data-bucket-app-${cfg.stage}-${cfg.region}`),
    testDefer: defer((cfg) => `${cfg.app.s3Name}-adasdas`),
    xx: Utils.fromTest('adasdasdadad'),

    Key: GetSSM(`/${stage}/CLOUDFLARE_SECRET`, true),
    // stack: GetStackOutput('stackName-develop', 'CloudFrontUrl'),
    // scenarios
    // mysql: GetVault('mysql-develop', 'creds.password'),
    // khatu: GetVault('mysql-develop'),
    // khatu: GetVault('mysql-develop', 'ws.wrong.path'),
  },
};
