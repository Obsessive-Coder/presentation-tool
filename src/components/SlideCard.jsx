// Components.
import {
  Box, Button, Card, CardActions, CardActionArea, CardContent, CardMedia, IconButton,
  Tooltip, Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

// Styles, utils, and other helpers.
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    maxWidth: 345,
    borderRadius: 12,
    margin: 'auto',
  },
  actionArea: {
    position: 'relative',
    textAlign: 'center',
    '&:hover': {
      '& .cardInfo': {
        display: 'flex'
      }
    }
  },
  cardInfo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    overflow: 'hidden'
  },
  textTruncate: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  }
})

export default function SlideCard(props) {
  const classes = useStyles()
  const { slideData, isSelected, handleAddRemoveSlide, handleDeleteSlide } = props
  const {
    id, fileName, name, application, endProduct, organicity, manufacturer, mdProducts, types,
  } = slideData

  const infoItems = [{
    label: 'App',
    values: [application],
  }, {
    label: 'Prod',
    values: [endProduct],
  }, {
    label: 'Mfr',
    values: [manufacturer],
  }, {
    label: 'Organicity',
    values: [organicity]
  }, {
    label: 'Type(s)',
    values: types
  }, {
    label: 'MD Prod(s)',
    values: mdProducts.map(({ product, form }) => `${product} - ${form}`)
  }]

  return (
    <Card raised className={classes.root}>
      <CardActionArea className={classes.actionArea} sx={{ flexGrow: 1 }}>
        <CardMedia
          alt={name}
          component="img"
          width="100%"
          height="auto"
          sx={{ objectFit: 'unset' }}
          src={`https://firebasestorage.googleapis.com/v0/b/presentation-tool-d1b24.appspot.com/o/slides%2F${fileName}?alt=media`}
        />

        <Box
          display="none"
          flexWrap="wrap"
          justifyContent="space-around"
          borderBottom="medium solid #542989"
          padding={2}
          className={[classes.cardInfo, 'cardInfo'].join(' ')}
        >
          {infoItems.map(({ label, values }) => (
            <div
              key={`item-info-${label}-${id}`}
              style={{ width: label === 'MD Prod(s)' ? '100%' : '33%' }}
            >
              {label && <Typography variant="body2" color="primary" fontWeight="bold">{label}</Typography>}

              <Tooltip title={values.join(', ')} enterTouchDelay={100}>
                <div style={{ maxHeight: 40, overflow: 'hidden' }}>
                  {values.map(value => (
                    <Typography key={`value-${value}`} variant="body2">
                      {value}
                    </Typography>
                  ))}
                </div>
              </Tooltip>
            </div>
          ))}
        </Box>
      </CardActionArea>

      <CardContent style={{ textAlign: 'center', padding: 8 }}>
        <Tooltip arrow title={name} placement="top" enterTouchDelay={100}>
          <Typography
            variant="subtitle1"
            component="div"
            color="primary"
            mx="2px"
            my={0}
            p={0}
            textAlign="center"
            className={classes.textTruncate}
          >
            {name}
          </Typography>
        </Tooltip>
      </CardContent>

      <CardActions sx={{ py: 0, px: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          value={name}
          color="primary"
          sx={{ fontWeight: 'bold', fontSize: 'large' }}
          onClick={handleAddRemoveSlide}
        >
          {isSelected ? 'Remove' : 'Add'}
        </Button>

        <IconButton color="error" aria-label="delete" onClick={() => handleDeleteSlide(id)}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  )
}
