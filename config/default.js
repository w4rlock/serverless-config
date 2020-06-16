const defer = require('config/defer').deferConfig;
const Utils = require('./utils');
const { GetFromSSM } = require('../src/resolvers');
const GetFromStackOuput = require('../src/resolvers/stackOutput');
// const GetFromVault = require('../src/resolvers/vault')({
// host: 'vault.corp.com',
// token: '<<<<<<<<<_______TOKEN___HERE___>>>>>>>>>>>>>>>>>>>',
// });

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

    Key: GetFromSSM(`/${stage}/CLOUDFLARE_AUTH_TOKEN`, true),
    stack: GetFromStackOuput('front-web-develop', 'CloudFrontUrl'),
    // scenarios
    // mysql: GetFromVault('mysql-develop', 'creds.password'),
    // khatu: GetFromVault('mysql-develop'),
    // khatu: GetFromVault('mysql-develop', 'ws.wrong.path'),
  },
};
