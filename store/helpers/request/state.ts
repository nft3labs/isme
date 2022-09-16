export enum REQUEST_STATUS {
  ready = 'ready',
  polling = 'polling',
  single = 'single',
}

export interface RequestSliceState<DATA = any, ERROR = any> {
  data: DATA
  error: ERROR
  loading: boolean
  status: REQUEST_STATUS
}

export const createRequestState =
  <DATA = any, ERROR = any>(data: DATA = undefined, error: ERROR = undefined) =>
  () => ({
    data,
    error,
    loading: false,
    status: REQUEST_STATUS.ready,
  })
