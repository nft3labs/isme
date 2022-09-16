import UserProvider, { createUserContext } from './user'
import ProfileBoardProvider, { createProfileBoardContext } from './profile-board'

const Provider: FC = ({ children }) => {
  return (
    <UserProvider>
      <ProfileBoardProvider>{children}</ProfileBoardProvider>
    </UserProvider>
  )
}

export default Provider

export const useUser = createUserContext()
export const useProfileBoard = createProfileBoardContext()
