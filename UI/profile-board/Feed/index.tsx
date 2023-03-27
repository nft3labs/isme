import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import { H2, Span, Tiny } from '../../../components/Typography'
import { format as formatDate } from 'date-fns'
import Avatar from '@mui/material/Avatar'
import expandSvg from './expand.svg'
import { ImageButton } from '../../../components/btn/IconButton'
import { useNFT3, useNFT3Profile } from '../../../domains/data'
import { useEffect, useMemo, useRef, useState } from 'react'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import imageAttachmentSvg from '../../../public/image-attachment.svg'

interface PostData {
  title: string
  content?: string
  image?: string
  date: number
}

const posts: PostData[] = [
  {
    title: 'Hello World',
    content:
      'Lorem ipsum dolor sit amet consectetur. Id eget fermentum consectetur praesent ante vel. Lorem ipsum dolor sit amet consectetur. Id eget fermentum consectetur praesent ante vel.<br/><br/>Lorem ipsum dolor sit amet consectetur. Id eget fermentum consectetur praesent ante vel.Lorem ipsum dolor sit amet consectetur. Id eget fermentum consectetur praesent ante vel. Lorem ipsum dolor sit amet consectetur. Id eget fermentum consectetur praesent ante vel.<br/><br/>Lorem ipsum dolor sit amet consectetur. Id eget fermentum consectetur praesent ante vel.Lorem ipsum dolor sit amet consectetur. Id eget fermentum consectetur praesent ante vel. Lorem ipsum dolor sit amet consectetur. Id eget fermentum consectetur praesent ante vel.<br/><br/>Lorem ipsum dolor sit amet consectetur. Id eget fermentum consectetur praesent ante vel.',
    image: 'https://picsum.photos/seed/1/1200/800',
    date: Date.now(),
  },
  {
    title: "What's going on?",
    content:
      'Lorem ipsum dolor sit amet consectetur.<br/><br/>Id eget fermentum consectetur praesent ante vel. Lorem ipsum dolor sit amet consectetur. Id eget fermentum consectetur praesent ante vel.',

    image: 'https://picsum.photos/seed/9/1200/800',
    date: Date.now(),
  },
  {
    title: 'Small amount of content',
    content:
      'Lorem ipsum dolor sit amet consectetur.<br/><br/>Id eget fermentum consectetur praesent ante vel. Lorem ipsum dolor sit amet consectetur. Id eget fermentum consectetur praesent ante vel.',

    date: Date.now(),
  },
  {
    title: 'Just a casual post with no content',
    image: 'https://picsum.photos/seed/d/1200/800',
    date: Date.now(),
  },
  {
    title: 'Nothing Special',
    content:
      'Lorem ipsum dolor sit amet consectetur.<br/>Id eget fermentum consectetur praesent ante vel. Lorem ipsum dolor sit amet consectetur. Id eget fermentum consectetur praesent ante vel.<br/><br/>Id eget fermentum consectetur praesent ante vel. Lorem ipsum dolor sit amet consectetur. Id eget fermentum consectetur praesent ante vel.<br/><br/>Id eget fermentum consectetur praesent ante vel. Lorem ipsum dolor sit amet consectetur. Id eget fermentum consectetur praesent ante vel.',

    date: Date.now(),
  },
]

//

const FEED_ITEM_CONTENT_MAX_HEIGHT = 120

enum FeedItemFoldState {
  UNKNOWN,
  COLLAPSED,
  EXPANDED,
}

type FeedItemProps = { post: PostData }

const FeedItem: FC<FeedItemProps> = ({ post }) => {
  const { profile } = useNFT3Profile()
  const { format } = useNFT3()

  const contentRef = useRef<HTMLElement>()
  const imageRef = useRef<HTMLImageElement>()
  const [foldState, setFoldState] = useState(FeedItemFoldState.UNKNOWN)

  useEffect(() => {
    if (foldState !== FeedItemFoldState.UNKNOWN) return

    // Feed item is not visible at the beginning, since it's insida a inactive Tab.
    // So we need to check its visibility periodically.
    const timer = setInterval(() => {
      if (contentRef.current?.scrollHeight || imageRef.current) {
        const isContentGreater = contentRef.current?.scrollHeight > FEED_ITEM_CONTENT_MAX_HEIGHT

        // We treat the post as collapsed if any image is present,
        // since 99.99% that this image is cropped and not visible entirely
        setFoldState(isContentGreater || imageRef.current ? FeedItemFoldState.COLLAPSED : FeedItemFoldState.EXPANDED)
      }
    }, 500)

    return () => clearInterval(timer)
  }, [foldState])

  return (
    <Card>
      {!!post.image && (
        <CardMedia
          ref={imageRef}
          component="img"
          image={post.image}
          sx={{ height: foldState === FeedItemFoldState.EXPANDED ? undefined : 160 }}
        />
      )}

      <CardContent sx={{ padding: 3 }}>
        <H2>{post.title}</H2>

        <Box
          ref={contentRef}
          sx={{
            color: 'text.secondary',
            marginTop: 1,
            maxHeight: foldState === FeedItemFoldState.EXPANDED ? undefined : FEED_ITEM_CONTENT_MAX_HEIGHT,
            overflow: 'hidden',
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <Stack direction="row" alignItems="center" justifyContent="space-between" marginTop={3}>
          <Stack direction="row" spacing={1.5}>
            <Avatar alt={profile.name} src={format(profile.avatar)} sx={{ width: 40, height: 40 }} />

            <Stack>
              <Span fontWeight={600}>{profile.name}.isme</Span>
              <Tiny>{formatDate(post.date, 'MMM d, yyyy')}</Tiny>
            </Stack>
          </Stack>

          {foldState === FeedItemFoldState.COLLAPSED && (
            <ImageButton
              src={expandSvg}
              title="Expand"
              sx={{ marginX: 1 }}
              onClick={() => setFoldState(FeedItemFoldState.EXPANDED)}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

//

const Form = styled(Box)`
  ${({ theme }) => ({
    marginBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
    borderBottom: `1px solid ${theme.palette.divider}`,
  })}
`

const Feed: FC = () => {
  const { isUser } = useNFT3Profile()

  const hasMoreData = true
  const isLoading = false

  const fileInput = useMemo(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = () => {
      console.log(input.files[0])
    }
    return input
  }, [])

  return (
    <Stack spacing={2}>
      {isUser && (
        <Form>
          <Card sx={{ padding: 2 }}>
            <Stack direction="row" alignItems="end" spacing={2}>
              <TextField
                multiline
                variant="standard"
                minRows={3}
                maxRows={20}
                placeholder="Make a new post"
                sx={{ flexGrow: 1 }}
              />

              <Stack direction="row" alignItems="center" spacing={1}>
                <ImageButton src={imageAttachmentSvg} title="Attach Cover Image" onClick={() => fileInput.click()} />

                <Button variant="gradient" size="large" sx={{ flexShrink: 0 }}>
                  Post
                </Button>
              </Stack>
            </Stack>
          </Card>
        </Form>
      )}

      {posts.length ? (
        <>
          {posts.map((post, i) => (
            <FeedItem key={i} post={post} />
          ))}

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
        </>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" height={200}>
          <Typography color="text.disabled">No posts yet.</Typography>
        </Box>
      )}
    </Stack>
  )
}

export default Feed