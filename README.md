[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![npm version](https://badge.fury.io/js/serverless-config.svg)](https://badge.fury.io/js/serverless-nconfig)
[![npm downloads](https://img.shields.io/npm/dt/serverless-nconfig.svg?style=flat)](https://www.npmjs.com/package/serverless-nconfig)

### Installation
```bash
npm i -E serverless-nconfig
```

### Before configure your environments files.
```bash
config
├── custom-environment-variables.yaml
├── default.js
├── develop.js
├── testing.yaml
├── production.js
```

### Usage
```yaml
plugins:
  - serverless-nconfig

custom:
  prop1: ${config:path.to.obj.value:default_value}
  prop2: ${config:path.to.required.value}

```


