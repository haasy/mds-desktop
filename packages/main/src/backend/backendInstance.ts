import type { AxiosError, AxiosRequestConfig, AxiosInstance } from 'axios';
import axios from 'axios';
import config from '/@/config';
import { loginCache } from '/@/cache';

/**
 * This class hold the xaiox instance we use to communicate with the backend.
 * It specifies the connection timeout and the path to the backend with URL and port.
 * It also takes care of adding the authorization header to each request.
 * 
 * So take care that you only use the backend instance to communicate with the Backend,
 * else you risk leaking the session cookie to untrusted thrid parties.
 */
class Backend {
  instanceData:AxiosRequestConfig = {
    baseURL: `http://${config.baseURL}:30080`,
    timeout: 10000,
  };
  _backendInstance: AxiosInstance;
  constructor() {
    this._backendInstance = axios.create(this.instanceData);
  }
  setAuthorizationHeader(token: string, tokenType: string) {
    loginCache.token = token;
    loginCache.tokenType = tokenType;
    this._backendInstance = axios.create({
      ...this.instanceData,
      headers: {'Authorization': `${loginCache.tokenType} ${loginCache.token}`},
    });
  }
  get instance() {
    return this._backendInstance;
  }

}

/**
 * Function to print errors to the console with a little logic to see roughly where the error occured.
 * @param axError error to print to the console
 */
function printAxiosError(axError: AxiosError) {
  if(axError.response) {
    console.log('Error in Response', axError.response.data, axError.response.status, axError.response.headers);
  } else if(axError.request) {
      console.log('Error in Request', axError.code, axError.message);
  } else {
      console.log('Other Error', axError);
  }
}


export default new Backend();
export { printAxiosError };
