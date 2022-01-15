import { useEffect, useState } from 'react'

// Components.
import { Link } from 'react-router-dom'
import {
  Box, Divider, Drawer, List, ListItem, ListItemText, Toolbar, Typography,
} from '@mui/material'

// Styles, utils, and other helpers.
import { NAV_DRAWER_CONSTANTS } from '../utils/constants'
import logoPicture from '../images/MicroDried_logo.png'

// Destructure constants.
const { DRAWER_WIDTH, MOBILE_SCREEN_THRESHOLD, NAV_LINKS } = NAV_DRAWER_CONSTANTS

export default function NavDrawer({ isOpen, handleDrawerToggle, handleLogout }) {
  const [isMobile, setIsMobile] = useState(false)

  let drawerProps = {
    variant: 'permanent',
    open: true,
    sx: {
      display: { xs: 'none', md: 'block' },
      '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
    }
  }

  if (isMobile) {
    drawerProps = {
      variant: 'temporary',
      open: isOpen,
      onClose: handleDrawerToggle,
      ModalProps: { keepMounted: true },
      sx: {
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
      }
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { innerWidth } = window
      setIsMobile(innerWidth < MOBILE_SCREEN_THRESHOLD)
    }
  }, [])

  return (
    <Box sx={{ display: 'flex', mb: 100 }}>
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH } }}
        aria-label="mailbox folders"
      >
        <Drawer {...drawerProps}>
          <Box>
            <Toolbar>
              <Link to="/">
                <img
                  src={logoPicture}
                  alt="MicroDried logo"
                  placeholder="blur"
                  style={{ width: '100%', height: 'auto' }}
                />
              </Link>
            </Toolbar>

            <Divider />

            <List style={{ overflowX: 'hidden', position: 'relative' }}>
              {NAV_LINKS.map((label) => (
                <ListItem button key={`${label}-nav-link`}>
                  <Link
                    key={`nav-link-${label}`}
                    to={`${label === 'Home' ? '/' : `/${label.toLowerCase()}`}`}
                    style={{ textDecoration: 'none', color: '#542989', marginLeft: '2rem', marginRight: '2rem' }}
                  >
                    <ListItemText
                      disableTypography
                      primary={(
                        <Typography type="body2">{label}</Typography>
                      )}
                    />
                  </Link>
                </ListItem>
              ))}

              <Divider />

              <ListItem button
                component="button"
                onClick={handleLogout}
                style={{ marginLeft: '2rem', marginRight: '2rem' }}
              >
                <ListItemText
                  disableTypography
                  primary={(
                    <Typography type="body2" style={{ color: '#542989' }}>Sign Out</Typography>
                  )}
                />
              </ListItem>

              {/* TODO: Remove this when accepted as complete. */}
              <ListItem sx={{ position: 'fixed', bottom: 0 }}>
                <Box component="footer">
                  <a
                    href="https://github.com/Obsessive-Coder"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Created by Jared Huffstutler
                  </a>
                </Box>
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </Box >
    </Box >
  )
}
