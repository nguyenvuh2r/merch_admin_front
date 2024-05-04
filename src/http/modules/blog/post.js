import { largeImage } from '@/utils/global'
import axios from '../../axios'

// Add new
export const addDraft = data => {
  return axios({
    url: 'Blog/Posts',
    method: 'post',
    data
  })
}

// Update
export const update = (id, data) => {
  return axios({
    url: 'Blog/Posts/' + id,
    method: 'put',
    data
  })
}

// Delete
export const del = id => {
  return axios({
    url: 'Blog/Posts/' + id,
    method: 'delete',
  })
}

// Get
export const get = id => {
  return axios({
    url: 'Blog/Posts/' + id,
    method: 'get',
  })
}

// Get all posts list
export const all = (queryParams) => axios({
  url: 'Blog/Posts',
  method: 'get',
  params: queryParams
})

/**
 * Upload image
 * @param itemId Article ID
 * @param file Image file
 * @returns {*}
 */
export const uploadImage = (itemId, file, size = largeImage) => {
  let formData = new FormData()
  formData.append('file', file)
  formData.append('size', size)

  return axios({
    url: `Blog/Posts/${itemId}/UploadImage`,
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data;charset=UTF-8'},
    data: formData
  })
}

// Get images in the article
export const getImages = itemId => {
  return axios({
    url: `Blog/Posts/${itemId}/Images`,
    method: 'get'
  })
}

// Set featured blog
export const setFeatured = itemId => {
  return axios({
    url: `Blog/Posts/${itemId}/SetFeatured`,
    method: 'post'
  })
}

// Cancel featured blog
export const cancelFeatured = itemId => {
  return axios({
    url: `Blog/Posts/${itemId}/CancelFeatured`,
    method: 'post'
  })
}

// Set top
export const setTop = itemId => {
  return axios({
    url: `Blog/Posts/${itemId}/SetTop`,
    method: 'post'
  })
}

export const publish = itemId => {
  return axios({
    url: `Blog/Posts/${itemId}/Publish`,
    method: 'post'
  })
}

export const unPublish = itemId => {
  return axios({
    url: `Blog/Posts/${itemId}/UnPublish`,
    method: 'post'
  })
}

export const setIndex = itemId => {
  return axios({
    url: `Blog/Posts/${itemId}/Index`,
    method: 'post'
  })
}

export const noIndex = itemId => {
  return axios({
    url: `Blog/Posts/${itemId}/NoIndex`,
    method: 'post'
  })
}
