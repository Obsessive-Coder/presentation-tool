import { useEffect, useRef, useState } from 'react'

// Components.
import { Button, Card, CardMedia } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Carousel from 'react-elastic-carousel'

// Styles, utils, and other helpers.
import { makeStyles } from '@mui/styles'
import { MOBILE_SCREEN_THRESHOLD } from '../utils/constants/navDrawer'

const breakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 450, itemsToShow: 2 },
  { width: 600, itemsToShow: 3 },
  { width: 775, itemsToShow: 4 },
  { width: 975, itemsToShow: 5 },
  { width: 1150, itemsToShow: 6 },
  { width: 1450, itemsToShow: 7 },
  { width: 1750, itemsToShow: 8 },
]

const useStyles = makeStyles({
  previewCard: {
    margin: '0 0.5rem',
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    color: 'rgba(255, 0, 0, 1)',
    backgroundColor: 'white',
    minWidth: 25,
    width: 25,
    height: 25,
    padding: 0,
    borderRadius: '50%',
    border: 'thin solid rgba(255, 0, 0, 1)',
    '& *': {
      pointerEvents: 'none',
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 0, 0, 1)',
      color: 'white',
    }
  }
})

export default function SlideCarousel(props) {
  const carouselEL = useRef(null)
  const classes = useStyles()
  const [isMobile, setIsMobile] = useState(false)

  const {
    items, allowMultipleSlides, isRemoveVisible, isFullscreen, isPreview, activeIndex, isActiveHighlighted = false, handleAddRemoveSlide, handleNextStart = () => null, handlePrevStart = () => null
  } = props

  useEffect(() => {
    if (isPreview && carouselEL?.current) {
      carouselEL.current.goTo(items.length - 1)
    }

    if (activeIndex >= 0) {
      carouselEL.current.goTo(activeIndex)
    }
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { innerWidth } = window
      setIsMobile(innerWidth < MOBILE_SCREEN_THRESHOLD)
    }
  }, [])

  return (
    <Carousel
      showEmptySlots
      showArrows={!isMobile}
      ref={carouselEL}
      breakPoints={allowMultipleSlides ? breakPoints : []}
      pagination={false}
      initialActiveIndex={activeIndex || 0}
      onNextStart={handleNextStart}
      onPrevStart={handlePrevStart}
      style={{ padding: '0.5rem' }}
    >
      {items.map(({ fileName, name = '' }, index) => (
        <Card
          key={`slide-preview-${name}-${fileName}`}
          className={classes.previewCard}
          style={{
            border: (isActiveHighlighted && index === activeIndex) ? 'thick solid #6c9730' : '',
            boxShadow: (isActiveHighlighted && index === activeIndex) ? '0 0 10px #6c9730 ' : '',
          }}
        >
          {isRemoveVisible && name && (
            <Button
              aria-label="delete"
              value={name}
              size="small"
              onClick={handleAddRemoveSlide}
              className={classes.removeButton}
            >
              <CloseIcon fontSize="small" />
            </Button>
          )}

          <CardMedia
            alt={name}
            component="img"
            data-item-index={index}
            src={`https://firebasestorage.googleapis.com/v0/b/microdried-261c8.appspot.com/o/slides%2F${fileName}?alt=media`}
            style={{ height: isFullscreen ? '95vh' : 'auto' }}
          />
        </Card>
      ))}
    </Carousel>
  )
}
