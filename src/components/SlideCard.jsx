// Components.
import {
  Box, Button, Card, CardActions, CardActionArea, CardContent, CardMedia, Tooltip, Typography,
} from '@mui/material'

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
  textTruncate: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  }
})

export default function SlideCard({ slideData, isSelected, handleAddRemoveSlide }) {
  const classes = useStyles()
  const {
    id, fileName, name, application, endProduct, organicity, manufacturer, mdProducts, types,
  } = slideData

  const infoItems = [{
    label: 'App',
    value: application,
  }, {
    label: 'Prod',
    value: endProduct,
  }, {
    label: 'Mfr',
    value: manufacturer,
  }, {
    label: 'MD Prod(s)',
    value: mdProducts.map(({ product, form }) => `${product} - ${form}`).join(', '),
  }, {
    label: 'Type(s)',
    value: types.join(' & ')
  }, {
    label: 'Organicity',
    value: organicity
  }]

  return (
    <Card raised className={classes.root}>
      <CardActionArea sx={{ flexGrow: 1 }}>
        <CardMedia
          alt={name}
          component="img"
          width="100%"
          height="auto"
          sx={{ objectFit: 'unset' }}
          src={`https://firebasestorage.googleapis.com/v0/b/presentation-tool-d1b24.appspot.com/o/slides%2F${fileName}?alt=media`}
        />
      </CardActionArea>

      <CardContent style={{ textAlign: 'center', padding: 2 }}>
        <Tooltip arrow title={name} placement="top" enterTouchDelay={100}>
          <Typography
            variant="h6"
            component="div"
            mx={2}
            my={0}
            className={classes.textTruncate}
          >
            {name}
          </Typography>
        </Tooltip>

        {/* <Box display="flex" flexWrap="wrap" justifyContent="space-around">
          {infoItems.map(({ label, value }) => (
            <div key={`item-info-${label}-${id}`} style={{ width: '33%' }}>
              {label && <Typography variant="body2" fontWeight="bold">{label}</Typography>}
              <Typography variant="body2" color="text.secondary">
                {value}
              </Typography>
            </div>
          ))}
        </Box> */}
      </CardContent>

      <CardActions sx={{ p: 0 }}>
        <Button
          value={name}
          color="primary"
          sx={{ margin: 'auto', fontWeight: 'bold', fontSize: 'large' }}
          onClick={handleAddRemoveSlide}
        >
          {isSelected ? 'Remove' : 'Add'}
        </Button>
      </CardActions>
    </Card>
  )
}
