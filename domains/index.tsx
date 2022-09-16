import DataProvider from './data'
import ControllersProvider, { createControllersContext } from './controllers'

const Provider: FC = ({ children }) => {
  return (
    <ControllersProvider>
      <DataProvider>{children}</DataProvider>
    </ControllersProvider>
  )
}

export default Provider

export const useControllers = createControllersContext()
