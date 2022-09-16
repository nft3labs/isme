import { createContext } from 'app/utils/createContext'

// import { useUserController } from 'domains/data/user/application/controllers'

export const useControllersService = () => {
  // const user = useUserController()

  return {
    // user,
  }
}

const { Provider: ControllersProvider, createUseContext } = createContext(useControllersService)

export const createControllersContext = createUseContext
export default ControllersProvider
