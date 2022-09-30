import { createProgressSlice } from 'lib/nprogress/helpers'
const key = 'progress.page'

export const {
  reducer,
  useProgressController: usePageProgressController,
  select: selectPageProgress,
} = createProgressSlice(key)

export default reducer
