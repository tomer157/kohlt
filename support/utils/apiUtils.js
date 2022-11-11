const axios = require('axios');
const { logger } = require('../../logger/index');
const agent = require('superagent');

class ApiUtils {
  deelteCall = async (url, headers = {}) => {
    const res = await axios.delete(url, { headers: headers }).catch((err) => {
      logger.error(`[error] - [DELETE call failed at: ${err}]`);
      throw new Error(err);
    });

    return res;
  };

  getCall = async (url, headers = {}) => {
    let res;
    await axios
      .get('https://jsonplaceholder.typicode.com/users/1')
      .then((response) => {
        // console.log(response);
        res = response;
      })
      .catch((err) => console.log(err));
    return res;
  };

  uploadZipFile = async (url, zip, auth) => {
    const agentObj = agent
      .post(`${url}/`)
      .type('form-data')
      .set('Authorization', auth);

    for (const z of zip) {
      let stream = createReadSAtream(z);
      agentObj.attach('files', stream.path);
    }
  };
}

const apiUtils = new ApiUtils();
Object.freeze(apiUtils);
module.exports = apiUtils;
