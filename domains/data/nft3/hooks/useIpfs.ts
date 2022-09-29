import { getFilePath } from 'app/constant'
import axios from 'axios'
import { useCallback } from 'react'

const BaseUrl = 'https://t0.onebitdev.com/ipfs'

export default function useIpfs() {
  const format = useCallback((link: string) => {
    if (!link) return
    const url = new URL(link)
    const key = url.pathname.replace(/^\/\//, '')
    return `${BaseUrl}/${key}`
  }, [])

  const upload = useCallback(async (file: File) => {
    const form = new FormData()
    form.append('file', file)
    const { data } = await axios.post(`${BaseUrl}/api/v0/add`, form)
    return getFilePath(data)
  }, [])

  return {
    format,
    upload,
  }
}
