const axios = require("axios");
let key, secret, authPromise;

function handleError(e) {
  console.error("autonomia-api error", e);
  throw e;
}

const api = {
  vehicles: {
    list() {
      return authPromise
        .then(authData => {
          return axios.get(
            `https://api.autonomia.io/v1/api/devices`,
            {
              headers: {
                Authorization: `Bearer ${authData.data.access_token}`
              }
            }
          );
        })
        .then(res => {
          return Promise.resolve(res.data);
        })
        .catch(handleError);
    }, // ---- list

    get(device) {
      return authPromise
        .then(authData => {
          return axios.get(
            `https://api.autonomia.io/v1/api/devices/${device}`,
            {
              headers: {
                Authorization: `Bearer ${authData.data.access_token}`
              }
            }            
          );
        })
        .then(res => {
          return Promise.resolve(res.data);
        })
        .catch(handleError);
    }, // ---- get

    videos(device, camera, start, end) {
      return authPromise
        .then(authData => {
          const params = Object.assign({ camera, start, end, sign: true});
          return axios.post(
            `https://api.autonomia.io/v1/api/devices/${device}/video`,
              params,
              {
              headers: {
                Authorization: `Bearer ${authData.data.access_token}`
                }
              }             
          );
        })
        .then(res => {
          return Promise.resolve(res.data);
        })
        .catch(handleError);
    }

  } // ---- vehicles
};

function auth() {
  authPromise = axios.post("https://api.autonomia.io/v1/api/auth/token", {
    app_key: key,
    app_secret: secret
  });
}

module.exports = function createAutonomiaSingleton(creds) {
  if (creds) {
    key = creds.key;
    secret = creds.secret;
    if (!authPromise) {
      auth();
    }
  }
  return api;
}

