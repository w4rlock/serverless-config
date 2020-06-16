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
- Fetch Config from Aws CloudFormation Stack Outputs.
- Fetch Secret from VAULT.
- Fetch Config from AWS - SSM.
```

### Fetch Secret From Aws - SSM
```javascript
// file: config/default.js
const { GetFromSSM } = require('serverless-nconfig/src/resolvers');

const stage = process.env.SLS_STAGE;
const region = process.env.AWS_REGION;

module.exports = {
  db: {
    mysql: {
      port: 3306,
      user: admin,
      passwd: GetFromSSM(`/${stage}/MY_SQL_PASSWORD`, true)
    }
  },
};
```

### Fetch Secret From Vault. Option 1
```javascript
// file: config/default.js
const GetFromVault = require('serverless-nconfig/src/resolvers/vault')({
  host: 'vault.corp.com',
  token: '____TOKEN___HERE___'
});


module.exports = {
  db: {
    mysql: {
      port: 3306,
      user: admin,
      passwd: GetFromVault('/team/service/name/mysql-password'),
    }
  },
};
```


### Fetch Secret From Vault. Option 2
```javascript
// file: config/default.js
const GetFromVault = require('serverless-nconfig/src/resolvers/vault')({
  host: 'vault.corp.com',
  roleId: '____ROLE_ID___HERE___',
  secretId: '____SECRET_ID___HERE___'
});


module.exports = {
  db: {
    mysql: {
      port: 3306,
      user: admin,
      passwd: GetFromVault('/team/service/name/mysql', 'resp.path.to.mysql.pass')
    }
  },
};
```



### Fetch Config From: Aws - Cloud Formation Stack Outputs.
```javascript
// file: config/default.js

const { GetFromStackOutput } = require('serverless-nconfig/src/resolvers');

const stackName = 'my-app-service'
const stage = process.env.SLS_STAGE;

module.exports = {
  app: {
    redisUrl: GetFromStackOutput(`app-infra-${stage}`, 'redisUrl'),
    dynamoUrl: GetFromStackOutput(`app-infra-${stage}`, 'dynamoUrl'),
    cloudFrontUrl: GetFromStackOutput(`${stackName}-${stage}`, 'CloudFrontUrl')
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

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=278YCRJXTXLXJ)
