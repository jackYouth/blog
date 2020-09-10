import axios from 'axios';
import events from '../utils/events';
// import store from '@/store'
// import Vue from 'vue'
// import Router from '@/router'
// import { clearCookie } from '@/libs/util'
// import { PEKING_DOMAIN } from '@/api/test'

// const domains = Object.values(PEKING_DOMAIN)

// import { Spin } from 'iview'
// const addErrorLog = errorInfo => {
//   const { statusText, status, request: { responseURL } } = errorInfo
//   let info = {
//     type: 'ajax',
//     code: status,
//     mes: statusText,
//     url: responseURL
//   }
//   if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
// }

class HttpRequest {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.queue = {};
    this.headers = {};
    this.options = {};
  }
  setHeaders(headers) {
    this.headers = {...headers}
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {...this.headers},
    };
    return config;
  }
  destroy(url) {
    delete this.queue[url];
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      config => {
        // 添加全局的loading...
        if (!Object.keys(this.queue).length) {
          // Spin.show() // 不建议开启，因为界面不友好
        }
        this.queue[url] = true;
        /** 北京学情服务系统权限验证headers start */
        // const isExist = domains.some(item => {
        //   return url.indexOf(item) === 0
        // })
        // if (isExist) {
        //   const { signature, teacherId, timestamp } = store.state.user.signature
        //   config.headers.signature = signature
        //   config.headers.teacherid = teacherId
        //   config.headers.timestamp = timestamp
        // }
        /** 北京学情服务系统权限验证headers end */
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
    // 响应拦截
    instance.interceptors.response.use(
      res => {
        this.destroy(url);
        const { data, status } = res;
        if (data && data.status && data.status.code === -3) {
          events.emitNotLogin();
        }
        const others = {};
        if (this.options.needHeaders) {
          others.headers = res.headers;
        }
        return { data, status, ...others };
      },
      error => {
        this.destroy(url);
        // let errorInfo = error.response
        // if (!errorInfo) {
        //   const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        //   errorInfo = {
        //     statusText,
        //     status,
        //     request: { responseURL: config.url }
        //   }
        // }
        // if (errorInfo.data && !errorInfo.data.success) {
        //   let msg = errorInfo.data.errorMsg
        //   Vue.prototype.$Message.error({
        //     content: msg,
        //     duration: 10,
        //     closable: true
        //   });
        //   if (errorInfo.data.errorCode == 5000001) {
        //     clearCookie()
        //     Router.push({
        //       name: 'login'
        //     })
        //   }
        // }
        // addErrorLog(errorInfo)
        return Promise.reject(error);
      }
    );
  }
  request(options) {
    const instance = axios.create();
    options = Object.assign(this.getInsideConfig(), options);
    this.options = options;
    this.interceptors(instance, options.url);
    return instance(options).catch(err => ({
      data: {
        success: false,
        error: err
      },
    }));
  }
}
export default HttpRequest;
