import type { ReactNode, SyntheticEvent } from 'react'
import { Fragment, useState } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import MuiTabs from '@mui/material/Tabs'
import MuiTab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { Paragraph } from 'components/Typography'

const applyProps = (index: number) => {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  }
}
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}
const TabPanel: FC<TabPanelProps> = (props) => {
  const { children, value, index } = props
  return (
    <Box
      sx={{
        display: value != index ? 'none' : 'block',
        paddingTop: 2,
      }}
    >
      {children}
    </Box>
  )
}

const Tab = styled(MuiTab)(({ theme }) => ({
  color: theme.palette.text.secondary,
}))

type TabTitleProps = {
  label: string
  icon: ReactNode
}
const TabTitle: FC<TabTitleProps> = ({ icon, label }) => {
  return (
    <Stack spacing={1} direction="row">
      {icon}
      <Paragraph lineHeight="24px">{label}</Paragraph>
    </Stack>
  )
}

type TabItem = {
  title: TabTitleProps
  children: {
    component: any
    props?: any
  }
}
export type TabsProps = {
  tabs: TabItem[]
}
const Tabs: FC<TabsProps> = ({ tabs }) => {
  const theme = useTheme()
  const [value, setValue] = useState(0)
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  return (
    <Fragment>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <MuiTabs
          sx={{
            '.MuiTabs-indicator': {
              height: 3,
              background: theme.palette.gradientColors.main,
            },
          }}
          variant="scrollable"
          allowScrollButtonsMobile
          value={value}
          onChange={handleChange}
        >
          {tabs.map(({ title }, index) => {
            return <Tab sx={{ width: { xs: 'auto', sm: '23%' } }} key={title.label} label={<TabTitle {...title} />} {...applyProps(index)} />
          })}
        </MuiTabs>
      </Box>
      {tabs.map(({ title, children }, index) => {
        return (
          <TabPanel key={title.label} value={value} index={index}>
            <children.component {...(children.props || {})} />
          </TabPanel>
        )
      })}
    </Fragment>
  )
}

export default Tabs
