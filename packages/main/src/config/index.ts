class Config {
  //the address of the backend
  _baseURL = 'localhost:30080';
  _mockedBackend = process.argv.includes('--mockedBackend');
  get baseURL() {
    return this._baseURL;
  }
  get mockedBackend () {
    return this._mockedBackend;
  }
}

export default new Config();