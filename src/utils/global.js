/**
  * Global constants and method encapsulation modules
  * Mount to Vue properties through prototype
  * Called via this.Global
  */

// Backend management system server address
export const baseUrl = import.meta.env.VITE_BASE_URL
export const smallImage = 1
export const mediumImage = 2
export const largeImage = 3

export default {
  baseUrl,
  smallImage,
  mediumImage,
  largeImage
}
