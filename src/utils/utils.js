import CryptoJS from 'crypto-js'

function reverseString(str) {
	return str.split('').reverse().join('')
}

const utils = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL
	const key = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_KEY)
	const iv = CryptoJS.enc.Utf8.parse(reverseString(import.meta.env.VITE_KEY))

  const buildMediaUrl = (path) => {
    return BASE_URL + path.replace(/\\/g, '/')
  }

  const createSlug = (title) => {
    return title
      .toLowerCase() // Chuyển đổi tất cả thành chữ thường
      .replace(/[^\w\s-]/g, '') // Loại bỏ các ký tự không phải chữ cái, số, dấu gạch ngang và khoảng trắng
      .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng dấu gạch ngang
      .replace(/--+/g, '-') // Loại bỏ các dấu gạch ngang liên tiếp
      .trim() // Loại bỏ khoảng trắng ở đầu và cuối chuỗi (nếu có)
  }

  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  const stringCapitalize = (string) =>
    string?.charAt(0).toUpperCase() + string?.slice(1).toLowerCase()

  const isObject = (data) => {
    if (typeof data === 'object' && !Array.isArray(data) && data !== null) return true
    return false
  }

  const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0
  }

  const omitPropsFromObject = (object, omittingProps = []) => {
    if (!omittingProps || !omittingProps.length) return object
    return Object.entries(object).reduce((fields, field) => {
      if (!omittingProps.includes(field[0])) fields = { ...fields, [field[0]]: field[1] }
      return fields
    }, {})
  }

  const filterPropsFromObject = (object, filteringProps = []) => {
    if (!filteringProps || !filteringProps.length) return object
    return Object.entries(object).reduce((fields, field) => {
      if (filteringProps.includes(field[0])) fields = { ...fields, [field[0]]: field[1] }
      return fields
    }, {})
  }

  const formatDateTime = (date) => {
    const time = new Date(date)
    const usTime = new Date(time.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }))
    const formattedTime = usTime.toISOString().slice(0, 19).replace('T', ' ')
    return formattedTime
  }

  const encrypt = (text) => {
    return CryptoJS.AES.encrypt(text, key, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: iv
    }).toString()
  }

  const decrypt = (text) => {
    return CryptoJS.AES.decrypt(text, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
      iv: iv
    }).toString(CryptoJS.enc.Utf8)
  }

  return {
    stringCapitalize,
    isObject,
    isEmptyObject,
    omitPropsFromObject,
    filterPropsFromObject,
    formatBytes,
    buildMediaUrl,
    createSlug,
    formatDateTime,
		encrypt,
		decrypt
  }
}

export default utils
