import { Fragment, useState } from 'react'

// Components.
import {
  Accordion, AccordionDetails, AccordionSummary, Divider, IconButton, Paper, Toolbar, Typography,
} from '@mui/material'
import RemoveFromQueueIcon from '@mui/icons-material/RemoveFromQueue'
import SaveIcon from '@mui/icons-material/Save'
import PreviewIcon from '@mui/icons-material/Preview'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { PresentationNameDialog, PresentationView, SlideCarousel } from '../components'

// Styles, utils, and other helpers.
import { makeStyles } from '@mui/styles'
import { previewHeaderFields } from '../utils/constants/search'

const useStyles = makeStyles({
  root: {
    position: 'fixed',
    bottom: 5,
    right: 0,
    left: 0,
    marginRight: 15,
    border: 'medium solid #542989',
    borderRadius: 15,
    touchAction: 'none',
    zIndex: 1000,
  },
  previewToolbar: {
    width: '100%',
  },
  presentationName: {
    flexGrow: 4,
    maxWidth: 700,
    borderRight: 'medium solid #542989',
    borderRadius: '12px 0 0 0',
    backgroundColor: 'rgba(84, 41, 137, 0.15)',
  },
  previewHeaderButton: {
    borderRadius: 0,
    padding: '0.5rem 1rem',
    '&:hover': {
      backgroundColor: 'rgba(84, 41, 137, 1)',
      color: 'white',
    }
  },
})

const iconComponents = { PreviewIcon, RemoveFromQueueIcon, SaveIcon }

export default function PresentationPreview(props) {
  const classes = useStyles()
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const { carouselItems, handleAddRemoveSlide, handleSavePresentation } = props

  const handleOpenNameDialog = () => {
    setIsNameDialogOpen(true)
  }

  const handleCloseNameDialog = (event) => {
    setIsNameDialogOpen(false)
  }

  const handleOpenViewDialog = () => {
    setIsViewDialogOpen(true)
  }

  const handleCloseViewDialog = () => {
    setIsViewDialogOpen(false)
  }

  const getClickHandler = (label) => {
    let handler

    switch (label.toLowerCase()) {
      case 'view':
        handler = async (event) => {
          event.stopPropagation()
          handleOpenViewDialog()
        }
        break
      case 'save':
        handler = (event) => {
          event.stopPropagation()
          handleOpenNameDialog()
        }
        break
      case 'remove all':
        handler = handleAddRemoveSlide
        break
      default:
        handler = (event) => {
          event.stopPropagation()
          console.log('Error: No click handler was associated with this button.')
        }
        break
    }

    return handler
  }

  return (
    <Paper elevation={10} className={classes.root} sx={{ marginLeft: { xs: '15px', md: '250px' } }}>
      <PresentationNameDialog
        isOpen={isNameDialogOpen}
        handleClose={handleCloseNameDialog}
        handleSave={handleSavePresentation}
      />

      <PresentationView
        isOpen={isViewDialogOpen}
        isPresentationsPage={false}
        isSaveShown={true}
        carouselItems={carouselItems}
        handleClose={handleCloseViewDialog}
        handleOpenNameDialog={handleOpenNameDialog}
        handleSave={handleSavePresentation}
        handleAddRemoveSlide={handleAddRemoveSlide}
      />

      <Accordion
        defaultExpanded
        disableGutters
        TransitionProps={{ unmountOnExit: true }}
        style={{ borderRadius: 15 }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          style={{ backgroundColor: 'rgba(84, 41, 137, 0.15)', }}
          sx={{ p: 0, '& .MuiAccordionSummary-content': { margin: 0 }, '& .MuiAccordionSummary-expandIconWrapper': { mx: 2 } }}
        >
          <Toolbar disableGutters variant="dense" className={classes.previewToolbar}>
            {previewHeaderFields.map(({ label, iconName, type, value }, index) => {
              const Icon = iconComponents[iconName]
              return (
                <Fragment key={`preview-action-${label}`}>
                  <IconButton
                    type={type}
                    color="primary"
                    aria-label={label}
                    value={value}
                    onClick={getClickHandler(label)}
                    className={classes.previewHeaderButton}
                    style={{ flexGrow: 1 }}
                    sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                  >
                    <Icon fontSize="small" style={{ pointerEvents: 'none' }} />

                    <Typography variant="caption" fontWeight="bold" style={{ pointerEvents: 'none' }}>
                      {label}
                    </Typography>
                  </IconButton>

                  <Divider
                    flexItem
                    orientation="vertical"
                    sx={{ borderWidth: 1, backgroundColor: 'rgba(84, 41, 137, 0.75)' }}
                  />
                </Fragment>
              )
            })}
          </Toolbar>
        </AccordionSummary>

        <AccordionDetails style={{ borderTop: 'medium solid #542989' }}>
          <SlideCarousel
            items={carouselItems}
            allowMultipleSlides={true}
            isRemoveVisible={true}
            isFullscreen={false}
            isPreview={true}
            handleAddRemoveSlide={handleAddRemoveSlide}
          />
        </AccordionDetails>
      </Accordion>
    </Paper>
  )
}
