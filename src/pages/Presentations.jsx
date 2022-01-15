import { useEffect, useState } from 'react'

// Components.
import { Link } from 'react-router-dom'
import { Alert, AlertTitle, Box, Snackbar, Typography } from '@mui/material'
import { PresentationsTable, PresentationView } from '../components'

// Styles, utils, and other helpers.
import { DELETE_FIRESTORE_DATA, READ_FIRESTORE_DATA } from '../utils/firebase/firestore'

export default function Presentations() {
  const [isLoading, setIsLoading] = useState(true)
  const [alertData, setAlertData] = useState({})
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [presentations, setPresentations] = useState(null)
  const [selectedPresentation, setSelectedPresentation] = useState(null)

  const handleCloseSnackbar = () => {
    setAlertData({
      isOpen: false,
      severity: '',
      message: '',
    })
  }

  const handleOpenViewDialog = (presentation) => {
    setSelectedPresentation(presentation)
    setIsViewDialogOpen(true)
  }

  const handleCloseViewDialog = () => {
    setIsViewDialogOpen(false)
  }

  const handleDeletePresentation = (presentationId, presentationName) => {
    const isDeleteConfirmed = window
      .confirm(`Are you sure you want to delete '${presentationName}'?`)

    if (isDeleteConfirmed) {
      const updatedPresentations = presentations.filter(({ id }) => id !== presentationId)
      setPresentations(updatedPresentations)

      DELETE_FIRESTORE_DATA('presentations', presentationId)
        .then(() => {
          setAlertData({
            isOpen: true,
            severity: 'success',
            message: 'Successfully deleted the presentation'
          })
        })
        .catch(error => {
          setAlertData({
            isOpen: true,
            severity: 'danger',
            message: `Error retrieving data from the database. Please try again later.\n${JSON.stringify(error)}`
          })
        })
    }
  }

  useEffect(() => {
    setIsLoading(!Array.isArray(presentations))
  }, [presentations])

  useEffect(() => {
    READ_FIRESTORE_DATA('presentations')
      .then((snapshot) => {
        const docs = []
        snapshot.forEach(doc => docs.push({
          id: doc.id,
          ...doc.data(),
        }))

        setPresentations(docs)
      })
      .catch(error => {
        setAlertData({
          isOpen: true,
          severity: 'error',
          message: `Error retrieving data from the database. Please try again later.\n${JSON.stringify(error)}`
        })
      })
  }, [])

  if (isLoading) {
    return <h2 style={{ textAlign: 'center' }}>Loading...</h2>
  }

  return (
    <main>
      {isViewDialogOpen && (
        <PresentationView
          isOpen={isViewDialogOpen}
          isSaveShown={false}
          carouselItems={selectedPresentation?.slides ?? []}
          handleClose={handleCloseViewDialog}
          handleOpenNameDialog={() => null}
          handleSave={() => null}
          handleAddRemoveSlide={() => null}
        />
      )}

      <Box>
        {presentations.length > 0 ? (
          <PresentationsTable
            presentations={presentations}
            handleOpenViewDialog={handleOpenViewDialog}
            handleDeletePresentation={handleDeletePresentation}
          />
        ) : (
          <Box textAlign="center">
            <Typography variant="h2">No Presentations</Typography>

            <Typography variant="h5">
              Use the{' '}
              <Link to="/slides">Slides</Link>
              {' '}page to create and save a presentation.
            </Typography>
          </Box>
        )}
      </Box>

      {alertData.isOpen && (
        <Snackbar open autoHideDuration={5000} onClose={handleCloseSnackbar}>
          <Alert severity={alertData.severity} onClose={handleCloseSnackbar}>
            <AlertTitle style={{ textTransform: 'capitalize' }}>{alertData.severity}</AlertTitle>
            {alertData.message}
          </Alert>
        </Snackbar>
      )}
    </main>
  )
}
