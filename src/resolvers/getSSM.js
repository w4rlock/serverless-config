const { asyncConfig } = require('config/async');
const Aws = require('aws-sdk');

const SSM = () => new Aws.SSM();

const getValueFromSSM = (secretPath, withDecryption = true) => {
  if (!secretPath) throw new Error('Parameter "secretPath" is Required.');

  return asyncConfig(
    () =>
      new Promise((res, rej) => {
        const param = {
          Name: secretPath,
          WithDecryption: withDecryption,
        };

        SSM().getParameter(param, (error, data) => {
          if (error) {
            const msg = `SSM_ERROR: Fetching parameter '${secretPath}', ${error}`;
            rej(new Error(msg));
          } else {
            res(data.Parameter.Value);
          }
        });
      })
  );
};

module.exports = getValueFromSSM;