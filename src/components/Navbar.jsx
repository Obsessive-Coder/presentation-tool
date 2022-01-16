// TODO: use react router.

// Components.
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Search from './Search'
import CreateSlide from './CreateSlide'

// Styles, utils, and other helpers.
import { useLocation } from 'react-router-dom'
import { NAV_DRAWER_CONSTANTS } from '../utils/constants'

const getAppBarStyles = (isUserAuthenticated) => ({
  width: {
    md: isUserAuthenticated ? `calc(100% - ${NAV_DRAWER_CONSTANTS.DRAWER_WIDTH}px)` : '100%'
  }
})

export default function Navbar(props) {
  const {
    isUserAuthenticated, handleDrawerToggle,
    handleSearch = () => null, handleCreateSlide = () => null,
  } = props
  const { pathname } = useLocation()

  return (
    <AppBar
      position="fixed"
      color="default"
      sx={getAppBarStyles(isUserAuthenticated)}
    >
      <Toolbar sx={{ display: 'flex' }}>

        {isUserAuthenticated && (
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="h4"
          component="div"
          sx={{
            display: { xs: 'none', sm: 'initial' },
            textTransform: 'capitalize',
            color: '#542989'
          }}
        >
          {pathname === '/' ? 'Welcome' : pathname.replace('/', '')}
        </Typography>

        {pathname === '/slides' && (
          <Box display="flex" alignItems="center" flexGrow={1} flexShrink={0}>
            <Search handleSearch={handleSearch} />

            <CreateSlide handleCreateSlide={handleCreateSlide} />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}
