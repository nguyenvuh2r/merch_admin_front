Date.prototype.format = function (fmt) {
  let o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
    S: this.getMilliseconds() // millisecond
  }
  for (let k in o) {
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(new RegExp('(' + k + ')', 'g'), (match, p1) => {
        return p1.length === 1 ? o[k] : ('00' + o[k]).substring(('' + o[k]).length)
      })
    }
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(new RegExp('(' + k + ')', 'g'), (match, p1) => {
        return p1.length === 1 ? o[k] : ('00' + o[k]).substring(('' + o[k]).length)
      })
    }
  }
  return fmt
}

export const dateTimeBeautify = function (dateTimeStr) {
  let dateObj = new Date(dateTimeStr)
  return dateObj.format('yyyy-MM-dd hh:mm:ss')
}
