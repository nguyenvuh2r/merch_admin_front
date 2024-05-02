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
    url: 'Website/Users',
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
    url: 'Website/Users/' + id + '/Update',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data;charset=UTF-8'},
    data: formData
  })
}

export const changePassword = (id, data) => {
  return axios({
    url: 'Website/Users/' + id + '/ChangePassword',
    method: 'put',
    data
  })
}

// Delete
export const del = id => {
  return axios({
    url: 'Website/Users/' + id,
    method: 'delete',
  })
}

// Get
export const get = id => {
  return axios({
    url: 'Website/Users/' + id,
    method: 'get',
  })
}

// Get all users list
export const all = (queryParams) => axios({
  url: 'Website/Users',
  method: 'get',
  params: queryParams
})

// Recache all users
export const recache = () => {
  return axios({
    url: 'Website/Users/Recache',
    method: 'post',
  })
}