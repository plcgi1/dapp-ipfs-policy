import { authHeaders } from './auth'
import { getServerErrorMessage } from '../utils/errors'

export const list = (param) => {
  const searchParams = {}
  
  Object.keys(param).forEach((key) => {
    if (param[key]) {
      searchParams[key] = param[key]
    }
  })
  
  return axios('/api/things/list', { params: searchParams, ...authHeaders() })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      throw new Error(getServerErrorMessage(err.response))
    })
}

export const get = (param) => {
  const searchParams = { id: param.id }
  
  return axios('/api/things', { params: searchParams, ...authHeaders() })
    .then((response) => {
      return response.data.data[0]
    })
    .catch((err) => {
      throw new Error(getServerErrorMessage(err.response))
    })
}

