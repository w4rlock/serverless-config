[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![npm version](https://badge.fury.io/js/serverless-config.svg)](https://badge.fury.io/js/serverless-nconfig)
[![npm downloads](https://img.shields.io/npm/dt/serverless-nconfig.svg?style=flat)](https://www.npmjs.com/package/serverless-nconfig)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=278YCRJXTXLXJ)


### Installation
```bash
npm i -E serverless-nconfig
```

### Before configure your environments files.
```bash
.
├── serverless.yml
├── config
│   ├── custom-environment-variables.yaml
│   ├── default.js
│   ├── develop.js
│   ├── testing.js
│   ├── production.js

```

### Feature
```yaml
- Support all "node-config" features.
- Fetch Config from "AWS - SSM".
```

### Secret From Aws - SSM
```javascript
// file: config/default.js
const { GetSSM } = require('serverless-nconfig/src/resolvers');

const stage = process.env.SLS_STAGE;
const region = process.env.AWS_REGION;

module.exports = {
  db: {
    mysql: {
      port: 3306,
      user: admin,
      passwd: GetSSM(`/${stage}/MY_SQL_PASSWORD`, true)
    }
  },
};
```

### Secret From Vault. Option 1
```javascript
// file: config/default.js
const GetVault = require('serverless-nconfig/src/resolvers/getVault')({
  host: 'vault.corp.com',
  token: '____TOKEN___HERE___'
});


module.exports = {
  db: {
    mysql: {
      port: 3306,
      user: admin,
      passwd: GetVault('/team/service/name/mysql-password'),
    }
  },
};
```


### Secret From Vault. Option 2
```javascript
// file: config/default.js
const GetVault = require('serverless-nconfig/src/resolvers/getVault')({
  host: 'vault.corp.com',
  roleId: '____ROLE_ID___HERE___'
  secretId: '____SECRET_ID___HERE___'
});


module.exports = {
  db: {
    mysql: {
      port: 3306,
      user: admin,
      passwd: GetVault('/team/service/name/mysql', 'resp.path.to.mysql.pass')
    }
  },
};
```



### Fetch Config From: Aws - Cloud Formation Stack Outputs.
```javascript
// file: config/default.js

const { GetStackOutput } = require('serverless-nconfig/src/resolvers');

const stackName = 'my-app-service'
const stage = process.env.SLS_STAGE;

module.exports = {
  app: {
    redisUrl: GetStackOutput(`app-infra-${stage}`, 'redisUrl'),
    dynamoUrl: GetStackOutput(`app-infra-${stage}`, 'dynamoUrl'),
    cloudFrontUrl: GetStackOutput(`${stackName}-${stage}`, 'CloudFrontUrl')
  },
};
```

### Usage
```yaml
plugins:
  - serverless-nconfig

custom:
  dbPort: ${config:db.mysql.port:3306}
  prop2: ${config:path.to.required.value}
  prop2: ${config:some.path:DEFAULT_VALUE_HERE}

```


### Test - Render Serverless Config
```bash
$ serverless print --stage develop
$ serverless print --stage testing
$ serverless print --stage production
```


### Configuration References
https://github.com/lorenwest/node-config


## Donation
Donate helps me to continue adding new features or bugs fix..
If this project help you reduce time to develop, you can buy me a :beer: IPA... Every tiny cents help me a lot ... Thanks!

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=278YCRJXTXLXJ)
