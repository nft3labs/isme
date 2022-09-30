import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useControllers } from 'domains'

export const useRouteChange = () => {
  const router = useRouter()
  const { pageProcess } = useControllers()
  useEffect(() => {
    const handleRouteChangeStart = (url: string, { shallow }: any) => {
      if (!shallow) {
        pageProcess.start()
      }
    }

    const handleRouteChangeDone = (url: string, { shallow }: any) => {
      if (!shallow) {
        pageProcess.done()
      }
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeComplete', handleRouteChangeDone)
    router.events.on('routeChangeError', handleRouteChangeDone)
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
      router.events.off('routeChangeComplete', handleRouteChangeDone)
      router.events.off('routeChangeError', handleRouteChangeDone)
    }
  }, [pageProcess, router])
}
