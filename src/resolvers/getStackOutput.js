const Aws = require('aws-sdk');
const { asyncConfig } = require('config/async');
const _ = require('lodash');

/**
 * Handle Aws Stack Ouput Response
 *
 * @param {string} outputKey the exported stack ouput key
 * @returns {string} ouput value
 */
const handleResponse = (outputKey) => (res) => {
  const outputList = _.get(res, 'Stacks[0].Outputs', []);
  const output = outputList.find((out) => out.OutputKey === outputKey);

  if (_.isEmpty(output) || _.isEmpty(output.OutputValue)) {
    const err = new Error(
      `CLOUD_FORMATION_OUTPUT_KEY_NOT_FOUND: '${outputKey}'`
    );
    return Promise.reject(err);
  }

  return Promise.resolve(output.OutputValue);
};

/**
 * Handle error
 *
 * @param {string} stackName cloud formation stack name
 * @returns {string} promise.reject
 */
const handleError = (stackName) => (err) => {
  if (!err.message.includes('CLOUD_FORMATION_')) {
    return Promise.reject(
      new Error(`CLOUD_FORMATION_STACK_NOT_FOUND: '${stackName}'`)
    );
  }

  return Promise.reject(err);
};


/**
 * Get CloudFormation output value
 *
 * @param {string} stackName stack name
 * @param {string} outputKey ouput key
 * @returns {string} ouput key value
 */
function getOutput(stackName, outputKey) {
  if (!stackName) {
    throw new Error('CLOUD_FORMATION: param "stackName" is required');
  }

  if (!outputKey) {
    throw new Error('CLOUD_FORMATION: param "outputKey" is required');
  }

  const q = { StackName: stackName };
  const CF = new Aws.CloudFormation();

  return asyncConfig(() =>
    CF.describeStacks(q)
      .promise()
      .then(handleResponse(outputKey))
      .catch(handleError(stackName))
  );
}

module.exports = getOutput;
