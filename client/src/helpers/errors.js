export const getServerErrorMessage = (response) => {
  if (!response) {
    return 'empty response'
  }
  if (response.data && response.data.errors) {
    const messages = response.data.errors.map((row) => { return row.message })
    
    return messages.join('\n')
  }
  
  if (response.data && response.data.message) {
    return response.data.message
  }
  if (response.message) return response.message
  
  if (response.data instanceof Array) {
    return response.data[0].param + ' ' + response.data[0].msg
  }
  
  if (response.status === 401) {
    window.location = '#/login'
    return
  }
  if (response.data) {
    return response.data
  }
  return 'Unknown error'
}
