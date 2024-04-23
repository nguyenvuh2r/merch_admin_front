import { largeImage } from '@/utils/global'
import api from '../http'
import utils from '@/utils/utils'

const { buildMediaUrl } = utils()

export default class CkUploadAdapter {
  constructor(loader, postId) {
    this.loader = loader
    this.postId = postId
  }

  upload() {
    return this.loader.file
      .then(file => {
        return new Promise((resolve, reject) => {
          api.blogPost.uploadImage(this.postId, file, largeImage)
            .then(response => {
              resolve({
                default: buildMediaUrl(response.data.url)
              })
            })
            .catch(error => {
              reject(error)
            })
        })
      })
  }
}
