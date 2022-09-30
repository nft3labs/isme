import { createContext } from 'app/utils/createContext'
import { usePageProgressController } from 'store/progress/page'

// import { useUserController } from 'domains/data/user/application/controllers'

export const useControllersService = () => {
  const pageProcess = usePageProgressController()
  // const user = useUserController()

  return {
    pageProcess,
    // user,
  }
}

const { Provider: ControllersProvider, createUseContext } = createContext(useControllersService)

export const createControllersContext = createUseContext
export default ControllersProvider
