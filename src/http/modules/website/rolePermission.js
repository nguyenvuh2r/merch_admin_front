import axios from '../../axios'

// get all roles
export const allRoles = () => {
  return axios({
    url: 'Website/RolePermission/Roles',
    method: 'get',
  })
}
