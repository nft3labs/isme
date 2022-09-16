import { useFormik } from 'formik'
import * as yup from 'yup'

import { createToastifyPromise } from 'app/utils/promise/toastify'
import { useUser } from 'domains/data'

const validationSchema = yup.object({
  didname: yup
    .string()
    .trim()
    .min(2, 'Please enter a valid name')
    .max(50, 'Please enter a valid name')
    .required('Please specify your DID name'),
})

const initialValues = {
  didname: '',
}

export const useForm = () => {
  const { register, account, login, registerDialog } = useUser()
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, formikHelpers) => {
      return createToastifyPromise(
        register(values.didname).then(() => {
          registerDialog.close()
          login()
        }),
        {
          formikHelpers,
          serializeError(e) {
            return {
              message: e.message,
              errors: {
                didname: e.message,
              },
            }
          },
        }
      )
    },
  })

  return {
    formik,
    account,
  }
}
