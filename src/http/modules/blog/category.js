import axios from '../../axios'

// Add new
export const add = data => {
  let formData = new FormData()

  for (let key in data)
  {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item)
        })
      } else {
        formData.append(key, value);
      }
    }
  }

  return axios({
    url: 'Blog/Categories',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data;charset=UTF-8'},
    data: formData
  })
}

// Update
export const update = (id, data) => {
  let formData = new FormData()

  for (let key in data)
  {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item)
        })
      } else {
        formData.append(key, value);
      }
    }
  }

  return axios({
    url: 'Blog/Categories/' + id + '/Update',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data;charset=UTF-8'},
    data: formData
  })
}

// Delete
export const del = id => {
  return axios({
    url: 'Blog/Categories/' + id,
    method: 'delete',
  })
}

// Get
export const get = id => {
  return axios({
    url: 'Blog/Categories/' + id,
    method: 'get',
  })
}

// Get all categories list
export const all = (queryParams) => axios({
  url: 'Blog/Categories',
  method: 'get',
  params: queryParams
})

// Get all categories with child
export const deepAll = () => axios({
  url: 'Blog/Categories/All',
  method: 'get'
})

// Get all categories list with nodes
export const nodes = (queryParams) => axios({
  url: 'Blog/Categories/Nodes',
  method: 'get',
  params: queryParams
})
