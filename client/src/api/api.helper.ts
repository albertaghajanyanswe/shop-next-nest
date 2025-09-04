export const getContentType = () => ({
  'Content-Type': 'application/json',
})

export const errorCatch = (error: any): string => {
  const message = error.response?.data?.message || error.message || error

  return message
    ? typeof error.response.data.message === 'object'
      ? message[0]
      : message
    : error.message
}

