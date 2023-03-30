import { Fragment } from 'react'
import Container from '@mui/material/Container'
import Header from 'components/Header'
import { H2, H4, Tiny } from '../../../components/Typography'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import { format as formatDate } from 'date-fns'
import { useRouter } from 'next/router'
import { useTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { ChatListState, useChatList } from '../../../domains/data/ylide/chats'

const ChatsPage = () => {
  const theme = useTheme()
  const router = useRouter()
  const chatList = useChatList()

  return (
    <Fragment>
      <Header title="ISME | Chats" />
      <Container sx={{ width: { sm: 1, md: 0.6 }, padding: 0 }}>
        <Stack paddingTop={4} spacing={2}>
          <H2>Chats</H2>

          {chatList.list.length ? (
            <Stack spacing={2}>
              {chatList.list.map((thread, i) => (
                <Card
                  key={i}
                  onClick={() => router.push(`/app/chats/${thread.didname}`)}
                  sx={{
                    cursor: 'pointer',
                    border: 'solid 1px transparent',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <Stack direction="row" spacing={2} padding={2}>
                    <Avatar sx={{ width: 48, height: 48 }} />

                    <Stack>
                      <H4>{thread.didname}.isme</H4>
                      <Tiny>{formatDate(thread.lastMessageDate, 'MMM d, yyyy')}</Tiny>
                    </Stack>
                  </Stack>
                </Card>
              ))}
            </Stack>
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" height={100}>
              <Tiny>{chatList.state === ChatListState.LOADING ? 'Loading ...' : 'No messages yet ...'}</Tiny>
            </Box>
          )}

          {chatList.hasMore && (
            <Box justifyContent="center" display="flex">
              <Button size="small" disabled={chatList.state === ChatListState.LOADING}>
                Load More
              </Button>
            </Box>
          )}
        </Stack>
      </Container>
    </Fragment>
  )
}

export default ChatsPage
