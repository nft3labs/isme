import { styled } from '@mui/material/styles'

import GitHubIcon from '@mui/icons-material/GitHub'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import TelegramIcon from '@mui/icons-material/Telegram'
import TwitterIcon from '@mui/icons-material/Twitter'
import EmailIcon from '@mui/icons-material/Email'

const MediumSVG = () => {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.846 6.887C2.876 6.592 2.763 6.301 2.543 6.103L0.303 3.403V3H7.261L12.639 14.795L17.367 3H24V3.403L22.084 5.24C21.919 5.366 21.837 5.573 21.871 5.778V19.276C21.837 19.48 21.919 19.687 22.084 19.813L23.955 21.65V22.053H14.543V21.65L16.482 19.768C16.672 19.578 16.672 19.522 16.672 19.231V8.321L11.283 22.009H10.555L4.28 8.321V17.495C4.228 17.88 4.356 18.269 4.627 18.547L7.148 21.605V22.009H0V21.605L2.521 18.547C2.791 18.268 2.911 17.877 2.846 17.495V6.887V6.887Z"
      />
    </svg>
  )
}

const MediumIcon = styled('div')`
  display: flex;
  align-items: center;
  ${() => ({
    fontWeight: 'normal',
    width: '20px',
    height: '20px',
  })}
`

const DiscordIcon = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.6031 4.42375C18.1815 3.75862 16.6615 3.27524 15.0724 3C14.8772 3.35285 14.6492 3.82744 14.492 4.20498C12.8027 3.95093 11.1289 3.95093 9.47071 4.20498C9.31354 3.82744 9.08035 3.35285 8.88344 3C7.29258 3.27524 5.77082 3.7604 4.34924 4.42727C1.4819 8.76019 0.704613 12.9855 1.09326 17.1508C2.99503 18.571 4.83807 19.4337 6.65001 19.9983C7.09739 19.3825 7.49639 18.728 7.84012 18.0382C7.18547 17.7895 6.55846 17.4825 5.96601 17.1261C6.12319 17.0097 6.27693 16.8879 6.42546 16.7627C10.039 18.4528 13.9652 18.4528 17.5355 16.7627C17.6858 16.8879 17.8395 17.0097 17.995 17.1261C17.4008 17.4842 16.7721 17.7912 16.1174 18.04C16.4611 18.728 16.8584 19.3843 17.3075 20C19.1212 19.4355 20.966 18.5728 22.8677 17.1508C23.3237 12.3221 22.0887 8.13565 19.6031 4.42375ZM8.33241 14.5892C7.24767 14.5892 6.35809 13.5765 6.35809 12.3433C6.35809 11.1101 7.22867 10.0957 8.33241 10.0957C9.43618 10.0957 10.3257 11.1083 10.3067 12.3433C10.3084 13.5765 9.43618 14.5892 8.33241 14.5892ZM15.6286 14.5892C14.5438 14.5892 13.6543 13.5765 13.6543 12.3433C13.6543 11.1101 14.5248 10.0957 15.6286 10.0957C16.7323 10.0957 17.6219 11.1083 17.6029 12.3433C17.6029 13.5765 16.7323 14.5892 15.6286 14.5892Z" />
    </svg>
  )
}

const links = [
  { label: 'Telegram', linkTo: 'https://t.me/nft3com', icon: <TelegramIcon /> },
  {
    label: 'Discord',
    linkTo: 'https://discord.com/invite/HgHuuS9wzx',
    icon: <DiscordIcon />,
  },
  { label: 'Twitter', linkTo: 'https://twitter.com/_ISMEIS', icon: <TwitterIcon /> },
  { label: 'Docs', linkTo: 'https://sdk.nft3.com/docs/isme/intro', icon: <MenuBookIcon /> },
  {
    label: 'Medium',
    linkTo: 'https://medium.com/nft3',
    icon: (
      <MediumIcon>
        <MediumSVG />
      </MediumIcon>
    ),
  },
  { label: 'Github', linkTo: 'https://github.com/nft3labs/isme', icon: <GitHubIcon /> },
  { label: 'Email', linkTo: 'mailto:info@nft3.com', icon: <EmailIcon /> },
]

export const useLinks = () => {
  return {
    links,
  }
}
