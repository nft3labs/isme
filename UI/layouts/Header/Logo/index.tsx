import Image from 'next/image'
import Link from 'next/link'
import { styled } from '@mui/material/styles'
import MaterialLink from '@mui/material/Link'

import LogoImg from './images/logo.svg'
import type { LogoProps } from './types'

const ROOT = styled(MaterialLink)`
  display: flex;
  align-items: center;
`

const Logo = (props: LogoProps) => {
  return (
    <Link href={'/'} passHref>
      <ROOT>
        <Image src={props.imgSrc || LogoImg} alt="NFT3Pass" />
      </ROOT>
    </Link>
  )
}

export default Logo
