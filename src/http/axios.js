import axios from 'axios';
import config from './config';
import router from '@/router'
import * as auth from '@/utils/auth'

export default function $axios(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: config.baseUrl,
      headers: config.headers,
      timeout: config.timeout,
      withCredentials: config.withCredentials
    })
    // request interceptor
    instance.interceptors.request.use(
      config => {
        // Carry token when sending request
        let token = auth.getToken()
        if (token && token !== '') {
          config.headers.Authorization = `Bearer ${token}`
        }

        return config
      },
      error => {
        // When an error occurs in the request
        console.log('request:', error)
        // Determine request timeout
        if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
          console.log('timeout request timeout')
        }
        // Need to redirect to error page
        const errorInfo = error.response
        console.log(errorInfo)
        if (errorInfo) {
          error = errorInfo.data  // You can get detailed error information when catching on the page, see Promise.reject at the bottom
          const errorStatus = errorInfo.status; // 404 403 500 ...
          router.push({
            path: `/error/${errorStatus}`
          })
        }
        return Promise.reject(error) // You can get (catch) the error information you want to return on the calling side.
      }
    )

    // response interceptor
    instance.interceptors.response.use(
      response => {
        return response.data
      },
      err => {
        let reason = err
        if (err && err.response) {
          // Wrap the default error message
          switch (err.response.status) {
            case 400:
              err.message = 'Request parameter error'
              break
            case 401:
              err.message = 'Please log in first before accessing'
              break
            case 403:
              err.message = 'Access denied, no access rights'
              break
            case 404:
              err.message = `Error requesting address: ${err.response.config.url}`
              break
            case 408:
              err.message = 'Request timed out'
              break
            case 500:
              err.message = 'Internal server error'
              break
            case 501:
              err.message = 'Service not implemented'
              break
            case 502:
              err.message = 'Gateway error'
              break
            case 503:
              err.message = 'Service is not available'
              break
            case 504:
              err.message = 'Gateway timeout'
              break
            case 505:
              err.message = 'HTTP version is not supported'
              break
            default:
          }

          // If there is an error response, handle it
          if (err.response.data) {
            reason = err.response.data
            // If no error message is returned, use the default message above.
            if (!reason.message) reason.message = err.message
          }
        }
        console.error(err)
        return Promise.reject(reason) // Returns the error information returned by the interface
      }
    )
    // Request processing
    instance(options).then(res => {
      resolve(res)
      return false
    }).catch(error => {
      reject(error)
    })
  })
}
