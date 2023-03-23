import { Fragment, useCallback } from 'react'
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

const ChatsPage = () => {
  const theme = useTheme()
  const router = useRouter()

  const hasMoreData = true
  const isLoading = false

  const goToChat = useCallback(
    (username: string) => {
      router.push(`/app/chats/${username}`)
    },
    [router]
  )

  return (
    <Fragment>
      <Header title="ISME | Chats" />
      <Container sx={{ width: { sm: 1, md: 0.6 }, padding: 0 }}>
        <Stack paddingTop={4} spacing={2}>
          <H2>Chats</H2>

          <Stack spacing={2}>
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Card
                  key={i}
                  onClick={() => goToChat('username')}
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
                      <H4>username.isme</H4>
                      <Tiny>{formatDate(Date.now(), 'MMM d, yyyy')}</Tiny>
                    </Stack>
                  </Stack>
                </Card>
              ))}
          </Stack>

          <Box justifyContent="center" display="flex">
            {hasMoreData ? (
              <Button size="small" disabled={isLoading}>
                Load More
              </Button>
            ) : (
              <Button size="small" disabled>
                No more data
              </Button>
            )}
          </Box>
        </Stack>
      </Container>
    </Fragment>
  )
}

export default ChatsPage
