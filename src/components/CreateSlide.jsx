import { useState } from 'react'

// Components.
import {
  Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, IconButton, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'

// Styles, utils, and other helpers.
import { PRODUCTS_AND_FORMS } from '../utils/constants'

const textFields = [{
  label: 'Name',
  name: 'name',
  required: true,
}, {
  label: 'Application',
  name: 'application',
  required: true,
}, {
  label: 'End Product',
  name: 'endProduct',
  required: true,
}, {
  label: 'Manufacturer',
  name: 'manufacturer',
  required: true,
},]

const defaultFormData = {
  application: '',
  endProduct: '',
  fileName: '',
  manufacturer: '',
  name: '',
  organicity: '',
  types: [],
  mdProducts: [],
}

export default function CreateSlide({ handleCreateSlide }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ ...defaultFormData })
  const [newProductData, setNewProductData] = useState({ product: '', form: '' })
  const [slideFile, setSlideFile] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setFormData({ ...defaultFormData })
    setNewProductData({ product: '', form: '' })
    setSlideFile(null)
    setIsSubmitted(false)
  }

  const handleInputOnChange = (event) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleOrganicityOnChange = (event, value) => {
    setFormData({
      ...formData,
      organicity: value
    })
  }

  const handleTypesOnChange = (event, isChecked) => {
    const { name, value } = event.target
    const { types } = formData

    let updatedTypes = [...types]

    if (isChecked) {
      updatedTypes.push(name)
    } else {
      updatedTypes = updatedTypes.filter((type) => type !== name)
    }

    setFormData({
      ...formData,
      types: updatedTypes
    })
  }

  const handleSelectOnChange = (event) => {
    const { name, value } = event.target

    setNewProductData({
      ...newProductData,
      [name]: value
    })
  }

  const handleAddProductOnClick = () => {
    const { mdProducts } = formData

    setFormData({
      ...formData,
      mdProducts: [...mdProducts, newProductData]
    })

    setNewProductData({ product: '', form: '' })
  }

  const handleRemoveProduct = (product, form, index) => {
    const { mdProducts } = formData
    const updatedProducts = mdProducts.filter(({ product: p, form: f }, i) => (
      !(i === index && p === product && f === form)
    ))

    setFormData({
      ...formData,
      mdProducts: updatedProducts
    })
  }

  const handleFileSelected = (event) => {
    const file = event.target.files[0]

    if (file) {
      setSlideFile(file || null)
      setFormData({
        ...formData,
        fileName: file.name
      })
    }
  }

  const handleSubmitSlideForm = () => {
    setIsSubmitted(true)

    const formValues = Object.values(formData)

    for (let i = 0; i < formValues.length; i++) {
      const value = formValues[i];

      if (!value || value.length === 0) {
        return
      }
    }

    handleCreateSlide(formData, slideFile)
    handleClose()
  }

  const { organicity, types, mdProducts } = formData

  return (
    <div style={{ marginLeft: 'auto' }}>
      <Button variant="outlined" onClick={handleClickOpen}>
        Create Slide
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle color="primary" textAlign="center">Create A New Slide</DialogTitle>

        <DialogContent>
          <DialogContentText textAlign="center">
            Use the form to create a new slide.
          </DialogContentText>

          <Box
            component="form"
            sx={{ mt: 4, '& .MuiTextField-root': { m: 1, width: '25ch' } }}
          >
            <Box display="flex" flexWrap="wrap">
              {textFields.map((item) => (
                <Box key={`create-slide-${item.name}`} width="50%">
                  <TextField
                    size="small"
                    variant="standard"
                    {...item}
                    error={isSubmitted && !formData[item.name]}
                    onChange={handleInputOnChange}
                  />
                </Box>
              ))}
            </Box>

            <Box display="flex" justifyContent="space-between">
              <FormControl
                required
                error={isSubmitted && !organicity}
                component="fieldset"
                sx={{ mt: 3, ml: 1, flex: 1 }}
              >
                <FormLabel component="legend">Organicity</FormLabel>

                <RadioGroup
                  row
                  aria-label="gender"
                  name="row-radio-buttons-group"
                  value={organicity}
                  onChange={handleOrganicityOnChange}
                >
                  <FormControlLabel value="Organic" control={<Radio />} label="Organic" />
                  <FormControlLabel value="Inorganic" control={<Radio />} label="Inorganic" />
                </RadioGroup>

                {isSubmitted && !organicity && (
                  <FormHelperText>Please select an organicity option</FormHelperText>
                )}
              </FormControl>

              <FormControl
                required
                error={isSubmitted && types.length === 0}
                component="fieldset"
                sx={{ mt: 3, ml: 1, flex: 1 }}
              >
                <FormLabel component="legend">Types</FormLabel>

                <FormGroup row>
                  <FormControlLabel
                    label="Fruit"
                    control={(
                      <Checkbox
                        name="Fruit"
                        checked={types.includes('Fruit')}
                        onChange={handleTypesOnChange}
                      />
                    )}
                  />
                  <FormControlLabel
                    label="Vegetable"
                    control={(
                      <Checkbox
                        name="Vegetable"
                        checked={types.includes('Vegetable')}
                        onChange={handleTypesOnChange}
                      />
                    )}
                  />
                </FormGroup>

                {(isSubmitted && types.length === 0) && (
                  <FormHelperText>Please select a type option</FormHelperText>
                )}
              </FormControl>
            </Box>

            <FormControl
              required
              error={isSubmitted && !slideFile}
              component="fieldset"
              sx={{ mt: 3, width: '100%' }}
            >
              <TextField
                required
                error={isSubmitted && !slideFile}
                type="file"
                onChange={handleFileSelected}
                style={{ width: '100%' }}
              />
              {(isSubmitted && !slideFile) && (
                <FormHelperText>
                  Please select an image file to upload with this slide
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              required
              error={isSubmitted && mdProducts.length === 0}
              component="fieldset"
              sx={{ mt: 3, width: '100%' }}
            >
              <FormLabel component="legend" sx={{ ml: 1 }}>Microdried Products</FormLabel>
              {(isSubmitted && mdProducts.length === 0) && (
                <FormHelperText>Please add a Microdried product</FormHelperText>
              )}

              {mdProducts.length > 0 && (
                <Box
                  display="flex"
                  flexWrap="wrap"
                  p={1}
                  mx={1}
                  maxHeight={100}
                  border="medium solid #542989"
                  borderRadius={2}
                  sx={{ overflow: 'auto' }}
                >
                  {mdProducts.map(({ product, form }, index) => (
                    <Box
                      key={`select-product-${product}-${form}-${index}`}
                      display="flex"
                      alignItems="center"
                      width="50%"
                    >
                      <Typography color="success">{`${product} - ${form}`}</Typography>

                      <IconButton
                        color="error"
                        size="small"
                        aria-label="add"
                        onClick={() => handleRemoveProduct(product, form, index)}
                      >
                        <RemoveCircleIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}

              <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                <FormControl size="small" sx={{ flex: 1, mx: 2 }}>
                  <InputLabel id="product-label">Product</InputLabel>
                  <Select
                    labelId="product-label"
                    value={newProductData.product}
                    label="Product"
                    name="product"
                    onChange={handleSelectOnChange}
                    MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}>
                    {PRODUCTS_AND_FORMS.mdProducts.map((value) => (
                      <MenuItem key={`product-choice-${value}`} value={value}>{value}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ flex: 1, mx: 2 }}>
                  <InputLabel id="form-label">Form</InputLabel>
                  <Select
                    labelId="form-label"
                    value={newProductData.form}
                    label="Form"
                    name="form"
                    onChange={handleSelectOnChange}
                  >
                    {PRODUCTS_AND_FORMS.productForms.map((value) => (
                      <MenuItem key={`form-choice-${value}`} value={value}>{value}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <IconButton
                  disabled={!newProductData.product || !newProductData.form}
                  color="success"
                  aria-label="add"
                  onClick={handleAddProductOnClick}
                >
                  <AddIcon fontSize="large" />
                </IconButton>
              </Box>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmitSlideForm}>Create</Button>
        </DialogActions>
      </Dialog >
    </div >
  )
}
