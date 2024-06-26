import { largeImage } from '@/utils/global'
import axios from '../../axios'

// Add new
export const addDraft = data => {
  return axios({
    url: 'Website/Pages',
    method: 'post',
    data
  })
}

// Update
export const update = (id, data) => {
  return axios({
    url: 'Website/Pages/' + id,
    method: 'put',
    data
  })
}

// Delete
export const del = id => {
  return axios({
    url: 'Website/Pages/' + id,
    method: 'delete',
  })
}

// Get
export const get = id => {
  return axios({
    url: 'Website/Pages/' + id,
    method: 'get',
  })
}

// Get all posts list
export const all = (queryParams) => axios({
  url: 'Website/Pages',
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
    url: `Website/Pages/${itemId}/UploadImage`,
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data;charset=UTF-8'},
    data: formData
  })
}


export const publish = itemId => {
  return axios({
    url: `Website/Pages/${itemId}/Publish`,
    method: 'post'
  })
}

export const unPublish = itemId => {
  return axios({
    url: `Website/Pages/${itemId}/UnPublish`,
    method: 'post'
  })
}

export const setIndex = itemId => {
  return axios({
    url: `Website/Pages/${itemId}/Index`,
    method: 'post'
  })
}

export const noIndex = itemId => {
  return axios({
    url: `Website/Pages/${itemId}/NoIndex`,
    method: 'post'
  })
}
