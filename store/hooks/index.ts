import { useDispatch, type TypedUseSelectorHook, useSelector } from 'react-redux'
import type { AppDispatch, AppState } from 'store'

export const useAppDispatch = () => useDispatch<AppDispatch>()

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector
