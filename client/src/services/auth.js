import * as errors from '../helpers/errors'

export const isAuthenticatedFromStorage = () => {
  const result = sessionStorage.getItem('token')
    ? true
    : false
  return result
}

export const getToken = () => {
  return sessionStorage.getItem('token');
};

export const authHeaders = () => {
  return {
    headers: { Authorization: `Bearer ${getToken()}` }
  }
}

export const addressRegistered = async (publicAddress) => {
  const response = await fetch(`/api/users?publicAddress=${publicAddress}`)
  const result = await response.json()

  return result
}

export const login = async (param) => {
  const response = await fetch(`/api/auth/eth`, {
    body: JSON.stringify(param),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
  const result = await response.json()

  return result
}

export const isAuthenticated = () => {
  return axios.get('/api/users/me', authHeaders())
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      throw new Error(errors.getServerErrorMessage(err.response))
    });
};

// export const logout = (user) => {
//   return axios.delete('/api/auth', authHeaders())
//     .then(() => {
//       localStorage.setItem('user', '{}')
//       sessionStorage.removeItem('token')
//     })
//     .catch((err) => {
//       throw new Error(errors.getServerErrorMessage(err.response))
//     })
// }
