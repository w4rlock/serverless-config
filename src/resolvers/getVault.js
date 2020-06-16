const _ = require('lodash');
const { asyncConfig } = require('config/async');
const VaultService = require('vault-es6-cli');

/**
 * Validate Vault config
 *
 * @param {object} config vault config host and auth
 */
const validateConfig = (config) => {
  if (!config) {
    throw new Error('VAULT_INIT_CONF_IS_MISSING');
  }

  if (!config.host) {
    throw new Error('VAULT_HOST_IS_MISSING');
  }

  if (!config.token) {
    if (!config.roleId || !config.secretId) {
      throw new Error('VAULT_AUTH_IS_MISSING');
    }
  }
};

/**
 * Error Handler for Vault Request
 *
 * @param {string} secretPath path to secret
 * @returns {promise.reject} promise error
 */
const errorHandler = (secretPath) => (err) => {
  if (err.message) {
    if (err.message.includes('403')) {
      return Promise.reject(
        new Error(`VAULT_403_PERMISSION_ERROR: '${secretPath}'`)
      );
    }

    if (err.message.includes('404') && err.config) {
      return Promise.reject(
        new Error(`VAULT_404_SECRET_NOT_FOUND: '${secretPath}'`)
      );
    }
  }
  return Promise.reject(err);
};



/**
 * Response handler for friendly error message
 *
 * @param {string} pathToField deep object path to field
 * @returns {promise} object value
 */
const responseHandler = (pathToField) => (response) => {
  let val = response.data

  if (!_.isEmpty(pathToField)) {
    val = _.get(val, pathToField);
    // when the user wrote an wrong path to response
    if (_.isEmpty(val)) {
      return Promise.reject(new Error(`VAULT_WRONG_RESPONSE_PATH: '${pathToField}'`));
    }
  }

  return Promise.resolve(val)
}


/**
 * Get Secret From Vault
 *
 * @param {string} secretPath relative path to secret
 * @param {string} pathToValue path to response object value
 * @returns {any} secret string/object
 */
function getVaultConfig(secretPath, pathToValue = '') {
  validateConfig(this);

  const Vault = new VaultService(this.host, this.roleId, this.secretId);
  if (this.token) {
    Vault.useToken(this.token);
  }

  return asyncConfig(() => {
    if (!secretPath) {
      return Promise.reject(new Error('VAULT_SECRET_PATH_IS_MISSING'));
    }

    return Vault.fetchSecret(secretPath)
      .then(responseHandler(pathToValue))
      .catch(errorHandler(secretPath));
  });
}


module.exports = (config) => getVaultConfig.bind(config);
