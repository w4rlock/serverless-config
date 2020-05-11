const { asyncConfig } = require('config/async');
const Aws = require('aws-sdk');

const SSM = (region) => new Aws.SSM({ region });

const getValueFromSSM = (region, secretPath, withDecryption = true) => {
  if (!region) throw new Error('Parameter "region" is Required.');
  if (!secretPath) throw new Error('Parameter "secretPath" is Required.');

  return asyncConfig(
    () =>
      new Promise((res, rej) => {
        const param = {
          Name: secretPath,
          WithDecryption: withDecryption,
        };

        SSM(region).getParameter(param, (error, data) => {
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