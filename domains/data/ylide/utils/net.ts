const INDEXER_URL = 'https://idx1.ylide.io'

export async function indexerRequest<Data>(url: string, body: any) {
  const response = await fetch(`${INDEXER_URL}${url}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'text/plain',
    },
  })

  const responseBody = await response.json()
  if (responseBody.data) {
    return responseBody.data as Data
  } else {
    throw new Error(responseBody.error || 'Request error')
  }
}
