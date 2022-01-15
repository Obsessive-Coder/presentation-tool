import { useEffect, useState } from 'react'

// Components.
import { Alert, AlertTitle, Box, Grid, Pagination, Snackbar, Stack } from '@mui/material'
import { FilterAccordion, PresentationPreview, SlideCard, SortDropdown } from '../components'

// Styles, utils, and other helpers.
import { sort } from 'fast-sort'
import { CREATE_FIRESTORE_DATA, READ_FIRESTORE_DATA } from '../utils/firebase/firestore'

const defaultPageData = {
  currentPageNumber: 1,
  pageCount: 0,
  pageSize: 18,
  pageSlides: [],
}

export default function Slides() {
  const [isLoading, setIsLoading] = useState(true)
  const [alertData, setAlertData] = useState({})
  const [slides, setSlides] = useState(null)
  const [presentationSlides, setPresentationSlides] = useState([])
  const [pageData, setPageData] = useState({ ...defaultPageData })

  const handleCloseSnackbar = () => {
    setAlertData({
      isOpen: false,
      severity: '',
      message: '',
    })
  }

  const handlePageOnChange = (event, pageNumber) => {
    const { pageSize } = pageData
    const startIndex = (pageNumber - 1) * pageSize
    const endIndex = pageNumber * pageSize
    const pageSlides = slides.slice(startIndex, endIndex)

    setPageData({
      ...pageData,
      pageSlides,
      currentPageNumber: pageNumber
    })
  }

  const handleSort = (sortData) => {
    if (!sortData) return

    const { field, isAscending } = sortData
    const sortType = isAscending ? 'asc' : 'desc'
    const sortedSlides = sort(slides)[sortType]((slide) => slide[field])
    setSlides(sortedSlides)

    const { pageSize } = pageData
    const pageSlides = sortedSlides.slice(0, pageSize)
    setPageData({
      ...pageData,
      pageSlides,
      currentPageNumber: 1,
      pageCount: Math.ceil(sortedSlides.length / pageSize)
    })
  }

  const handleFilter = (filters) => {
    // TODO: Special filters for types and form and md products.


  }

  const handleAddRemoveSlide = (event) => {
    event.stopPropagation()
    const { value: productName } = event.target

    if (productName === 'all') {
      return setPresentationSlides([])
    }

    const tempPresentationSlides = presentationSlides.filter(({ name }) => name !== productName)

    if (tempPresentationSlides.length === presentationSlides.length) {
      // Add slide data to the presentation slides.
      const slideData = slides.filter(({ name }) => name === productName)[0]
      setPresentationSlides((previousSlides) => [...previousSlides, slideData])
    } else {
      // Remove the slide from the presentation slides.
      setPresentationSlides(tempPresentationSlides)
    }
  }

  const handleSavePresentation = async (presentationName) => {
    // Check if the name is unique.
    const snapshot = await READ_FIRESTORE_DATA('presentations', 'name', presentationName)
    let isNameAvailable = true

    snapshot.forEach((doc) => {
      if (doc?.data().name === presentationName) {
        isNameAvailable = false
      }
    })

    if (!isNameAvailable) {
      return setAlertData({
        isOpen: true,
        severity: 'error',
        message: 'That presentation name is already taken. Please choose a unique name.'
      })
    }

    // Add the new presentation to the db.
    const presentation = {
      name: presentationName,
      slides: presentationSlides.map(({ name, fileName }) => ({ name, fileName }))
    }

    CREATE_FIRESTORE_DATA('presentations', presentation)
      .then(() => {
        setAlertData({
          isOpen: true,
          severity: 'success',
          message: 'Successfully saved the new presentation'
        })
      })
      .catch(error => {
        setAlertData({
          isOpen: true,
          severity: 'error',
          message: `Error saving new presentation. Please try again later.\n${JSON.stringify(error)}`
        })
      })
  }

  useEffect(() => {
    setIsLoading(!Array.isArray(slides))
  }, [slides])

  useEffect(() => {
    READ_FIRESTORE_DATA('slides')
      .then((snapshot) => {
        const docs = []
        snapshot.forEach(doc => docs.push({
          id: doc.id,
          ...doc.data(),
        }))

        setSlides(docs)

        const pageCount = Math.ceil(docs.length / pageData.pageSize)
        const { currentPageNumber, pageSize } = pageData
        const startIndex = (currentPageNumber - 1) * pageSize
        const endIndex = currentPageNumber * pageSize
        const pageSlides = docs.slice(startIndex, endIndex)

        setPageData({
          ...pageData,
          pageCount,
          pageSlides
        })
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

  const { currentPageNumber, pageCount, pageSlides } = pageData

  return (
    <main>
      <Box>
        <Box display="flex" alignItems="flex-start" mb={2}>
          <Box flex={1}>
            <FilterAccordion
              setAlertData={setAlertData}
              handleFilter={handleFilter}
              handleSort={handleSort}
            />
          </Box>

          <Box>
            <SortDropdown handleSort={handleSort} />
          </Box>
        </Box>

        <Box>
          <Grid container spacing={5}>
            {pageSlides.map((slide, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={`slide-${slide.name}-${index}`}>
                <SlideCard
                  key={currentPageNumber}
                  slideData={slide}
                  isSelected={presentationSlides.filter(({ name }) => name === slide.name).length > 0}
                  handleAddRemoveSlide={handleAddRemoveSlide}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {presentationSlides.length > 0 && (
          <PresentationPreview
            carouselItems={presentationSlides}
            handleAddRemoveSlide={handleAddRemoveSlide}
            handleSavePresentation={handleSavePresentation}
          />
        )}
      </Box>

      <Stack spacing={2}>
        <Pagination
          count={pageCount}
          page={currentPageNumber}
          onChange={handlePageOnChange}
          sx={{ mx: 'auto', mt: 8 }}
        />
      </Stack>

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
