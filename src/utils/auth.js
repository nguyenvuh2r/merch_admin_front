import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"

/**
 * Check if the user is logged in
 * @return boolean
 */
export const isLogin = () => {
  let token = Cookies.get('token')
  let user = localStorage.getItem('user')

  if (!token || token.length === 0) return false
  if (!user || user.length === 0) return false
  return !isExpired()
}

/**
 * Check if the login has expired
 * @return boolean
 */
export const isExpired = () => {
  let token = Cookies.get('token')
  if (!token || token.length === 0) return false

  const tokenClaims = jwtDecode(token)
  if (Date.now() / 1000 >= tokenClaims.exp) {
    return true
  }

  return false
}

/**
 * Get the saved token
 * @return string
 */
export const getToken = () => {
  return Cookies.get('token')
}

/**
 * Save login information
 * @param token Secret key
 * @param user Information of user
 */
export const login = (token, user) => {
  // Save the token to Cookie
  Cookies.set('token', token)
  // Save login data to local session
  localStorage.setItem('user', JSON.stringify(user))
}

// Logout
export const logout = () => {
  Cookies.remove('token')
  localStorage.removeItem('user')
}
