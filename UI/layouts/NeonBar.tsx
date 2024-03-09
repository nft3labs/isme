import Box from '@mui/material/Box'
import Link from '@mui/material/Link'

const NeonBar: FC = () => {

  return (
    <Box sx={{ backgroundColor: 'primary.main', paddingY: 2, paddingX: 4, color: 'white', fontWeight: 'medium', textAlign: 'center' }}>
      {`The 2nd Round $ISME Referral and Airdrop is Live! : `}
      <Link 
        href="https://root-labs.medium.com/announcing-the-2nd-round-isme-did-referral-program-0a1860f024d5" 
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