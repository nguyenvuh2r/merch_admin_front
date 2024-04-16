import axios from '../../axios'

// Add new
export const add = data => {
  return axios({
    url: 'Website/Users',
    method: 'post',
    data
  })
}

// Update
export const update = (id, data) => {
  return axios({
    url: 'Website/Users/' + id,
    method: 'put',
    data
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