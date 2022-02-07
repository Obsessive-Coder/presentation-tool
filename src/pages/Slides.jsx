import { useEffect, useState } from 'react'

// Components.
import {
  Alert, AlertTitle, Box, Grid, Pagination, Snackbar, Stack, Typography,
} from '@mui/material'
import {
  FilterAccordion, Navbar, PresentationPreview, SlideCard, SortDropdown,
} from '../components'

// Styles, utils, and other helpers.
import { sort } from 'fast-sort'
import { DELETE_FILE, UPLOAD_FILE } from '../utils/firebase/storage'
import {
  CREATE_FIRESTORE_DATA, DELETE_FIRESTORE_DATA, READ_FIRESTORE_DATA,
} from '../utils/firebase/firestore'

const defaultPageData = {
  currentPageNumber: 1,
  pageCount: 0,
  pageSize: 18,
  pageSlides: [],
}

export default function Slides({ isUserAuthenticated, handleDrawerToggle }) {
  const [isLoading, setIsLoading] = useState(true)
  const [alertData, setAlertData] = useState({})
  const [slides, setSlides] = useState(null)
  const [openingSlides, setOpeningSlides] = useState([])
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

  const handleSearch = (event) => {
    event.preventDefault()

    const { value } = event.target.searchTerm

    if (!value) {
      const { currentPageNumber, pageSize } = pageData
      const startIndex = (currentPageNumber - 1) * pageSize
      const endIndex = currentPageNumber * pageSize
      const pageSlides = slides.slice(startIndex, endIndex)

      return setPageData({
        ...pageData,
        pageSlides,
      })
    }

    READ_FIRESTORE_DATA('slides', 'name', value)
      .then(snapshot => {
        const docs = []
        snapshot.forEach(doc => docs.push({
          id: doc.id,
          ...doc.data(),
        }))

        const { currentPageNumber, pageSize } = pageData
        const startIndex = (currentPageNumber - 1) * pageSize
        const endIndex = currentPageNumber * pageSize
        const pageSlides = docs.slice(startIndex, endIndex)

        setPageData({
          ...pageData,
          pageSlides,
        })
      })
      .catch(error => {
        setAlertData({
          isOpen: true,
          severity: 'error',
          message: `Error finding slide. Please try again later.\n${JSON.stringify(error)}`
        })
      })
  }

  const handleSort = (sortData) => {
    if (!sortData) return

    const { field, isAscending } = sortData
    const sortType = isAscending ? 'asc' : 'desc'

    const sortedSlides = sort(slides)[sortType]((slide) => {
      if (field === 'mdProducts') {
        return slide[field][0].product
      }

      return slide[field]
    })

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
    const mergedFilters = [].concat.apply([], Object.values(filters))
    if (mergedFilters.length === 0) {
      const { pageSize } = pageData
      const pageSlides = slides.slice(0, pageSize)

      return setPageData({
        ...pageData,
        pageSlides,
        currentPageNumber: 1,
        pageCount: Math.ceil(slides.length / pageSize),
      })
    }

    const filteredSlides = []

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i]
      const filterKeys = Object.keys(filters)

      for (let j = 0; j < filterKeys.length; j++) {
        const key = filterKeys[j];
        const categoryFilters = filters[key]

        if (categoryFilters.length > 0) {
          let isTypesInSlide = false
          let isFormInSlide = false
          let isProductInSlide = false
          let isOtherFilterInSlide = filters[key].includes(slide[key])

          // Filter for types (fruit and/or vegetable).
          if (key === 'types') {
            for (let k = 0; k < slide.types.length; k++) {
              const type = slide.types[k]
              if (categoryFilters.includes(type)) {
                isTypesInSlide = true
                break
              }
            }
          }

          // Filter for forms and md products.
          if (key === 'form' || key === 'mdProduct') {
            for (let l = 0; l < slide.mdProducts.length; l++) {
              const slideKey = key === 'mdProduct' ? 'product' : key
              const product = slide.mdProducts[l]
              const property = product[slideKey]

              if (categoryFilters.includes(property)) {
                if (key === 'form') {
                  isFormInSlide = true
                } else {
                  isProductInSlide = true
                }
                break
              }
            }
          }

          // If the slide includes any of the filter items then included it in the result.
          if (isTypesInSlide || isFormInSlide || isProductInSlide || isOtherFilterInSlide) {
            const isInFilteredSlides = filteredSlides
              .filter(({ id }) => id === slide.id).length > 0

            if (!isInFilteredSlides) {
              filteredSlides.push(slide)
            }
          }
        }
      }
    }

    const { pageSize } = pageData
    const pageSlides = filteredSlides.slice(0, pageSize)

    setPageData({
      ...pageData,
      pageSlides,
      currentPageNumber: 1,
      pageCount: Math.ceil(filteredSlides.length / pageSize),
    })
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

      setPresentationSlides((previousSlides) => {
        let updatedSlides = []
        if (previousSlides.length === 0) {
          updatedSlides = [...openingSlides]
        }
        return [...updatedSlides, ...previousSlides, slideData]
      })
    } else {
      // Remove the slide from the presentation slides.
      setPresentationSlides((previousSlides) => {
        const actualSlides = tempPresentationSlides.filter(({ name }) => name)
        let updatedSlides = [...tempPresentationSlides]
        if (actualSlides.length === 0) {
          updatedSlides = []
        }
        return [...updatedSlides]
      })
    }
  }

  const handleDeleteSlide = (slideId, fileName) => {
    const isDeleteConfirmed = window
      .confirm(`Are you sure you want to delete this slide? Any presentations that use this slide will be broken.`)

    if (isDeleteConfirmed) {
      DELETE_FIRESTORE_DATA('slides', slideId)
        .then(() => {
          const updatedSlides = slides.filter(({ id }) => id !== slideId)
          setSlides(updatedSlides)

          const { pageSize } = pageData
          const pageSlides = updatedSlides.slice(0, pageSize)

          setPageData({
            ...pageData,
            pageSlides
          })

          DELETE_FILE(fileName)
            .then(() => {
              setAlertData({
                isOpen: true,
                severity: 'success',
                message: 'Successfully deleted the slide and related files.'
              })
            })
        })
        .catch(error => {
          setAlertData({
            isOpen: true,
            severity: 'error',
            message: `Error deleting slide. Please try again later.\n${JSON.stringify(error)}`
          })
        })
    }
  }

  const handleCreateSlide = (slideData, slideFile) => {
    UPLOAD_FILE(slideFile)
      .then(() => {
        return CREATE_FIRESTORE_DATA('slides', slideData)
      })
      .then((slideRef) => {
        setAlertData({
          isOpen: true,
          severity: 'success',
          message: 'Successfully created the slide and related file.'
        })

        const updatedSlides = [...slides]
        updatedSlides.push({ ...slideData, id: slideRef.id })
        setSlides(updatedSlides)

        const { currentPageNumber, pageSize } = pageData
        const startIndex = (currentPageNumber - 1) * pageSize
        const endIndex = currentPageNumber * pageSize
        const pageSlides = updatedSlides.slice(startIndex, endIndex)

        setPageData({
          ...pageData,
          pageSlides,
        })

      })
      .catch(error => {
        setAlertData({
          isOpen: true,
          severity: 'error',
          message: `Error saving new slide. Please try again later.\n${JSON.stringify(error)}`
        })
      })
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
      slides: presentationSlides.map(({ name, fileName }) => ({
        name: name ?? null,
        fileName: fileName ?? null
      }))
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

        READ_FIRESTORE_DATA('openingSlides')
          .then(snapshot => {
            const docs = []
            snapshot.forEach(doc => docs.push({
              id: doc.id,
              ...doc.data(),
            }))

            setOpeningSlides(docs)
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
      <Navbar
        isUserAuthenticated={isUserAuthenticated}
        handleDrawerToggle={handleDrawerToggle}
        handleSearch={handleSearch}
        handleCreateSlide={handleCreateSlide}
      />

      <Box>
        <Box display="flex" alignItems="flex-start" mb={2}>
          <Box flex={1}>
            <FilterAccordion
              setAlertData={setAlertData}
              handleFilter={handleFilter}
            />
          </Box>

          <Box>
            <SortDropdown handleSort={handleSort} />
          </Box>
        </Box>

        <Box key={pageSlides.length}>
          {pageSlides.length > 0 ? (
            <Grid container key={currentPageNumber} spacing={5}>
              {pageSlides.map((slide, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={`slide-${slide.name}-${index}`}>
                  <SlideCard
                    key={currentPageNumber}
                    slideData={slide}
                    isSelected={presentationSlides.filter(({ name }) => name === slide.name).length > 0}
                    handleAddRemoveSlide={handleAddRemoveSlide}
                    handleDeleteSlide={handleDeleteSlide}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box textAlign="center">
              <Typography variant="h2">No Slides</Typography>
            </Box>
          )}
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
