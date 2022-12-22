import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
// import type { ENSTextRecord } from '@nft3sdk/client'
interface ENSTextRecord {
  snapshot: string
  email: string
  'eth.ens.delegate': string
  'vnd.github': string
  'org.telegram': string
  'com.linkedin': string
  'VND.TELEGRAM': string
  'com.reddit': string
  'com.github': string
  header: string
  'vnd.telegram': string
  'com.discord': string
  description: string
  'vnd.twitter': string
  'com.twitter': string
  url: string
  name: string
  keywords: string
  location: string
  avatar: string
  notice: string
  ensName: string
}

import { createToastifyPromise } from 'app/utils/promise/toastify'
import { useNFT3, useNFT3Profile, useUser } from 'domains/data'
import { useRouter } from 'next/router'
import { safeGet } from 'app/utils/get'
import { getItem } from 'app/utils/cache/localStorage'
import { INVITER_KEY } from 'app/router'

const validationSchema = yup.object({
  didname: yup
    .string()
    .trim()
    .min(2, 'Please enter a valid name')
    .max(50, 'Please enter a valid name')
    .required('Please specify your DID name'),
  bio: yup.string().trim().max(150, 'Please enter a valid bio'),
  url: yup.string().trim().url().max(150, 'Please enter a valid url'),
})

const initialValues = {
  didname: '',
  bio: '',
  url: '',
}

export const useForm = () => {
  const router = useRouter()
  const { register, account, login, registerDialog, logout, disconnect, client } = useUser()
  const { queryer } = useNFT3()
  const { setProfile } = useNFT3Profile()
  const [ens, setEns] = useState<ENSTextRecord>()

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, formikHelpers) => {
      return createToastifyPromise(
        register(values.didname).then(() => {
          registerDialog.close()
          login().then(({ result, needRegister }) => {
            if (result) {
              const inviter = getItem(INVITER_KEY)
              if (inviter) safeGet(() => client.referrer.add(`did:nft3:${inviter}`))
              router.push(`/app/referral-program`)
              setProfile(values)
            } else if (needRegister === true) {
            } else {
              logout()
              disconnect()
            }
          })
        }),
        {
          formikHelpers,
          serializeError(e) {
            const message = safeGet(() => e.reason || e.message)
            return {
              message,
              errors: {
                didname: message,
              },
            }
          },
        }
      )
    },
  })

  useEffect(() => {
    if (!account) return
    queryer
      .query({
        ensTextRecords: {
          // address: '0x983110309620D911731Ac0932219af06091b6744' || account,
          address: account,
        },
      })
      .then((data: any) => {
        setEns(data.ensTextRecords[0])
      })
  }, [account, queryer])

  useEffect(() => {
    if (!ens) return
    const values = formik.values
    if (!values.bio) {
      values.bio = ens.description
    }
    if (!values.url) {
      values.url = ens.url
    }
    formik.setValues(values)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ens])

  useEffect(() => {
    if (!registerDialog.visible) return
    const didname = sessionStorage.getItem('didname')
    if (didname) formik.setFieldValue('didname', didname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerDialog.visible])

  return {
    formik,
    account,
    ens,
  }
}
