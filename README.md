[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![npm version](https://badge.fury.io/js/serverless-config.svg)](https://badge.fury.io/js/serverless-nconfig)
[![npm downloads](https://img.shields.io/npm/dt/serverless-nconfig.svg?style=flat)](https://www.npmjs.com/package/serverless-nconfig)

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

### Usage
```yaml
plugins:
  - serverless-nconfig

custom:
  dbPort: ${config:db.mysql.port:3306}
  prop2: ${config:path.to.required.value}
  prop2: ${config:some.path:DEFAULT_VALUE_HERE}

```

### Code Example
```javascript
const { GetValuefromSSM }  = require('serverless-nconfig/src/resolvers');

const stage = process.env.SLS_INSTANCE_STAGE;
const region = process.env.SLS_INSTANCE_REGION;

module.exports = {
  db: {
    mysql: {
      port: 3306,
      passwd: GetValuefromSSM(region, `/${stage}/MY_SQL_PASSWORD`, true)
    }
  },
};
```

### Test - Render Serverless Config
```bash
$ serverless print --stage develop
$ serverless print --stage testing
$ serverless print --stage production
```


### Configuration References
https://github.com/lorenwest/node-config
