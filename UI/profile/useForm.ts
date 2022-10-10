import type { ChangeEventHandler } from 'react'
import { useCallback, useEffect } from 'react'

import { useFormik } from 'formik'
import * as yup from 'yup'
import type { ProfileModel, WithMeta } from '@nft3sdk/client'

import { createToastifyPromise } from 'app/utils/promise/toastify'
import { useNFT3, useNFT3Profile } from 'domains/data'

const validationSchema = yup.object({
  name: yup.string().trim().min(2, 'Please enter a valid name').max(50, 'Please enter a valid name'),
  bio: yup.string().trim().max(150, 'Please enter a valid bio'),
  url: yup.string().trim().url().max(150, 'Please enter a valid url'),
})

const INITIAL_VALUES: Partial<WithMeta<ProfileModel>> = {
  name: '',
  avatar: '',
  bio: '',
  url: '',
  createdAt: Date.now(),
}

export const useForm = (initialValues = INITIAL_VALUES) => {
  const { upload } = useNFT3()
  const { setProfile } = useNFT3Profile()
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, formikHelpers) => {
      return createToastifyPromise(setProfile(values), {
        formikHelpers,
        serializeError(e) {
          return {
            message: e.message,
            errors: {
              didname: e.message,
            },
          }
        },
      })
    },
  })

  const onUpload = useCallback(
    (file: File) => {
      if (/\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(file.name) !== true) {
        return Promise.reject({ message: 'Invalid image type' })
      } else if (file.size > 1024 * 1024 * 2) {
        return Promise.reject({ message: 'Image size limit 2MB' })
      }
      return upload(file)
    },
    [upload]
  )

  const onAvatarChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files[0]
    if (!file) return
    createToastifyPromise(
      onUpload(file).then((value) => {
        if (!value) return
        formik.setFieldValue('avatar', value)
      })
    )
  }

  useEffect(() => {
    formik.setValues(initialValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues.name])

  return {
    formik,
    onAvatarChange,
  }
}
