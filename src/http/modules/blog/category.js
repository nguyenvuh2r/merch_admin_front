import axios from '../../axios'

// Add new
export const add = data => {
  return axios({
    url: 'Blog/Categories',
    method: 'post',
    data
  })
}

// Update
export const update = (id, data) => {
  return axios({
    url: 'Blog/Categories/' + id,
    method: 'put',
    data
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
