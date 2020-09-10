import HttpRequest from './axios';

// import config from '@/config'
// const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

// const { local, dev, test, show, pro } = config.baseUrl
// const BASE_URL_MAPPING = {
//   local,
//   development: dev,
//   qa: test,
//   prerelease: show,
//   production: pro
// }

const axios = new HttpRequest();
export default axios;
