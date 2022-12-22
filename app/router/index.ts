import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useControllers } from 'domains'
import { safeGet } from 'app/utils/get'
import { setItem } from 'app/utils/cache/localStorage'

export const INVITER_KEY = 'INVITER_KEY'

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

  useEffect(() => {
    const inviter = safeGet(() => {
      if (router.query.inviter instanceof Array) {
        const list = router.query.inviter
        return list[list.length - 1]
      }
      return router.query.inviter
    })

    if (inviter) setItem(INVITER_KEY, inviter)
  }, [router.query])
}
