import { largeImage } from '@/utils/global'
import api from '../http'
import utils from '@/utils/utils'

const { buildMediaUrl } = utils()

export default class CkUploadAdapter {
  constructor(loader, postId, type) {
    this.loader = loader
    this.postId = postId
    this.type = type
  }

  upload() {
    return this.loader.file
      .then(file => {
        return new Promise((resolve, reject) => {
          if (this.type === 'blog-post')
          {
            api.blogPost.uploadImage(this.postId, file, largeImage)
            .then(response => {
              resolve({
                default: buildMediaUrl(response.data.url)
              })
            })
            .catch(error => {
              reject(error)
            })
          }
          else if (this.type === 'site-page')
          {
            api.page.uploadImage(this.postId, file, largeImage)
            .then(response => {
              resolve({
                default: buildMediaUrl(response.data.url)
              })
            })
            .catch(error => {
              reject(error)
            })
          }
        })
      })
  }
}
