import { baseUrl } from '@/utils/global'

export default {
  method: 'get',
  // Basic url prefix
  baseUrl: `${baseUrl}/Api`,
  // Request header information
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  // parameter
  data: {},
  // Set timeout
  timeout: 30000,
  // Bring your voucher
  withCredentials: true,
  // Return data type
  responseType: 'json'
}
