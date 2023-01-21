import Box from '@mui/material/Box'
import Link from '@mui/material/Link'

const NeonBar: FC = () => {

  return (
    <Box sx={{ backgroundColor: 'primary.main', paddingY: 2, paddingX: 4, color: 'white', fontWeight: 'medium', textAlign: 'center' }}>
      {`The $ISME Referral Program and Airdrop have an IMPORTANT UPDATE: `}
      <Link 
        href="https://medium.com/nft3/the-isme-referral-campaign-updates-and-upgrades-68066e11abf7" 
        target="_blank"
        sx={{
          color: 'text.primary',
          '&:hover': {
            color: 'text.secondary',
          },
        }}
      >
        Read Here
      </Link>      
    </Box>
  )
}

export default NeonBar