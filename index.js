const { resolveAsyncConfigs } = require('config/async');
const _ = require('lodash');

class ServerlessConfig {
  /**
   * Default Constructor
   *
   * @param {object} serverless the serverless instance
   */
  constructor(serverless) {
    this.serverless = serverless;

    // TODO
    // region and stage can be overrided with --region some-region arguments.
    // should be available to build the config object with node-config
    const stage = serverless.getProvider('aws').getStage();
    const region = serverless.getProvider('aws').getRegion();

    process.env.NODE_ENV = stage;
    process.env.SLS_INSTANCE_STAGE = stage;
    process.env.SLS_INSTANCE_REGION = region;

    // first set NODE_ENV after that import the config module
    // eslint-disable-next-line global-require
    this.config = require('config');

    this.onceInit = _.once(async () => {
      await resolveAsyncConfigs(this.config);
    });

    this.hooks = {
      'before:info:info': () => Promise.reject(new Error('break')),
    };

    this.variableResolvers = {
      config: {
        serviceName: 'ServerlessConfig',
        isDisabledAtPrepopulation: true,
        resolver: this.dispatchAction.bind(this, this.getConfig),
      },
    };
  }

  /**
   * Action Wrapper for common entry point
   *
   * @param {function} funAction serverless plugin action
   */
  async dispatchAction(funAction, varResolver = undefined) {
    await this.onceInit();
    return funAction.call(this, varResolver);
  }

  /**
   * Resolve serverless yml variable
   *
   * @param {string} prop custom string with default value support
   * @returns {any} value for prop
   */
  async getConfig(prop) {
    let val = '';

    const [, deepPath, defaultValue] = prop.split(':');
    val = _.get(this.config, deepPath, defaultValue);

    if (_.isEmpty(val)) {
      let err = '';
      err += 'KEY_OR_VALUE_IS_MISSING: ';
      err += `Conf or value not found for "${prop}" key. `;
      err += 'Check in serverless.yml or configure this prop value.';
      err += 'https://github.com/lorenwest/node-config/wiki/';
      err += 'Configuration-Files';

      throw new Error(err);
    }

    return val;
  }
}

module.exports = ServerlessConfig;
