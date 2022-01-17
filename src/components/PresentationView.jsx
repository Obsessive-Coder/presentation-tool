import { forwardRef, useEffect, useState } from 'react'

// Components.
import { Backdrop, Box, Button, Dialog, AppBar, Toolbar, IconButton, Slide, } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SlideCarousel from './SlideCarousel'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function PresentationView(props) {
  const [isMobile, setIsMobile] = useState(false)
  const [isBackdropOpen, setIsBackdropOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [slideIndex, setSlideIndex] = useState(0)

  const {
    isOpen, isSaveShown, carouselItems, handleClose, handleOpenNameDialog, handleAddRemoveSlide,
  } = props

  const getIsFullscreen = () => {
    const doc = window.document

    return (
      doc.fullscreenElement
      || doc.mozFullScreenElement
      || doc.webkitFullscreenElement
      || doc.msFullscreenElement
    )
  }

  const toggleFullscreen = async () => {
    const doc = window.document
    const docEl = doc.documentElement

    const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen

    const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      await requestFullScreen.call(docEl)
    }
    else {
      await cancelFullScreen.call(doc)
    }

    setIsFullscreen(getIsFullscreen())
    setIsBackdropOpen(true)
  }

  const handleBackdropOnClick = () => {
    if (!isMobile) return
    setIsBackdropOpen(false)
    handleClose()
  }

  const handleNextStart = () => {
    let nextSlideIndex = slideIndex + 1
    const lastIndex = carouselItems.length - 1
    if (nextSlideIndex > lastIndex) nextSlideIndex = lastIndex
    setSlideIndex(nextSlideIndex)
  }

  const handlePrevStart = () => {
    let prevSlideIndex = slideIndex - 1
    if (prevSlideIndex < 0) prevSlideIndex = 0
    setSlideIndex(prevSlideIndex)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { innerWidth } = window
      const isMobileScreen = innerWidth < 900
      setIsMobile(isMobileScreen)
      setIsBackdropOpen(isMobileScreen)
    }
  }, [])

  // Checks every second to see if the user has left fullscreen mode.
  setInterval(() => {
    setIsFullscreen(getIsFullscreen())
  }, 1000)

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      {!isFullscreen && (
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Box display="flex" alignItems="center" flex={1}>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {!isMobile && (
              <Box flex={3} textAlign='center'>
                <Button
                  color="inherit"
                  onClick={toggleFullscreen}
                  style={{ textTransform: 'capitalize', fontSize: 'large' }}
                >
                  Fullscreen
                </Button>
              </Box>
            )}

            <Box display="flex" justifyContent="flex-end" flex={1}>
              {isSaveShown && (
                <Button
                  color="inherit"
                  onClick={handleOpenNameDialog}
                  style={{ textTransform: 'capitalize', fontSize: 'large' }}
                >
                  Save
                </Button>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      )}

      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        style={{ padding: '0 20px', overflow: 'hidden' }}
      >
        <Box flexGrow={1}>
          {isMobile || isFullscreen ? (
            <Backdrop
              open={isBackdropOpen || (!isMobile && isFullscreen)}
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              onClick={handleBackdropOnClick}
            >
              <SlideCarousel
                items={carouselItems}
                allowMultipleSlides={false}
                isRemoveVisible={false}
                isFullscreen={!isMobile && isFullscreen}
                isPreview={false}
                activeIndex={slideIndex}
                isActiveHighlighted={false}
                handleAddRemoveSlide={handleAddRemoveSlide}
                handleNextStart={handleNextStart}
                handlePrevStart={handlePrevStart}
              />
            </Backdrop>
          ) : (
            <SlideCarousel
              items={carouselItems}
              allowMultipleSlides={false}
              isRemoveVisible={false}
              isFullscreen={!isMobile && isFullscreen}
              isPreview={false}
              activeIndex={slideIndex}
              isActiveHighlighted={false}
              handleAddRemoveSlide={handleAddRemoveSlide}
              handleNextStart={handleNextStart}
              handlePrevStart={handlePrevStart}
            />
          )}
        </Box>

        {!isMobile && !isFullscreen && (
          <Box borderTop="medium solid #542989">
            <SlideCarousel
              items={carouselItems}
              allowMultipleSlides={true}
              isRemoveVisible={true}
              isFullscreen={!isMobile && isFullscreen}
              isPreview={false}
              activeIndex={slideIndex}
              isActiveHighlighted={true}
              handleAddRemoveSlide={handleAddRemoveSlide}
              handleNextStart={handleNextStart}
              handlePrevStart={handlePrevStart}
            />
          </Box>
        )}
      </Box>
    </Dialog>
  )
}
