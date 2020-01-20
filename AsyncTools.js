import GenericTools from './GenericTools'
const AsyncTools = {

  to(promise) {
    return promise.then(data => {
      return [null, data];
    })
      .catch(err => [err]);
  },

  superFetchX(url, payload = null) {

    let fPromise = payload == null ? fetch(url) : fetch(url, payload);

    return new Promise((res, rej) => {

      fPromise.then((r) => {

        if (r && r.ok === true) {

          r.json().then(re => {

            res([re, null]);

          })
            .catch(err => res([null, err]));

        } else {
          console.log('error hy', r);
          res([null, "No response, check your network connectivity"]);
        }

      })
        .catch(err => { res([null, err]); });
    });
  },


  parseJSON(response) {
    return new Promise((resolve, reject) =>
      response.json()

        .then((json) => resolve({
          status: response.status,
          ok: response.ok,
          json
        }))
        .catch(error => {
          response.status == 204 ? resolve({ ok: response.ok, status: response.status, json: { ok: response.ok } }) : reject(error)
        })
    );
  },

  superFetch(url, payload) {
    if (GenericTools.isCordova() && process.env.REACT_APP_DOMAIN) url = process.env.REACT_APP_DOMAIN + url;
    let fPromise = payload == null ? fetch(url) : fetch(url, payload);

    return new Promise((resolve, reject) => {
      fPromise
        .then(this.parseJSON)// this trys to parse- get origin error when you have one.
        .then((response) => {
          if (response.ok) {
            return resolve([response.json, null]);
          }
          // extract the error from the server's json
          return resolve([null, response.json]);
        })
        .catch((error) => resolve([null, "No response, check your network connectivity"]));
    });
  }

}

export default AsyncTools;
