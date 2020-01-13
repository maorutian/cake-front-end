import axios from 'axios';
import qs from 'qs';
import {message} from 'antd';

// Add a request interceptor
// change data type before request is sent in post
axios.interceptors.request.use(function (config) {
  // change JSON to application/x-www-form-urlencoded format
  const {method, data} = config;
  if (method.toLowerCase() === 'post' && typeof data==='object') {
    config.data = qs.stringify(data); // username=admin&password=admin
  }

  return config
});

//Add a response interceptor change promise
axios.interceptors.response.use(function (response) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  //get data directly
  return response.data;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Message all the response errors
  message.error('response error ' + error.message)
  // return a new promise(pending), break promise chain
  return new Promise(() => {});
});

export  default axios;