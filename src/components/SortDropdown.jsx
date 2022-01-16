import { useState } from 'react'

// Components.
import {
  ButtonGroup, Divider, FormControl, InputLabel, MenuItem, Paper, Select, ToggleButton,
} from '@mui/material'
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha'

// Styles, utils, and other helpers.
import { searchFields } from '../utils/constants/search'

export default function SortDropdown({ handleSort }) {
  const [sortData, setSortData] = useState({ field: 'name', isAscending: true })

  const handleOnChange = (event) => {
    const { value } = event.target

    const updatedSortData = {
      field: value,
      isAscending: true
    }

    setSortData(updatedSortData)
    handleSort(updatedSortData)
  }

  const toggleIsAscending = () => {
    const updatedSortData = {
      ...sortData,
      isAscending: !sortData.isAscending
    }

    setSortData(updatedSortData)
    handleSort(updatedSortData)
  }

  const { field, isAscending } = sortData

  return (
    <Paper
      component="form"
      sx={{ maxWidth: 200, margin: '0 1.5rem' }}
    >
      <ButtonGroup variant="contained" aria-label="sort dropdown" style={{ height: '100%' }}>
        <FormControl variant="standard" style={{ margin: 'auto' }}>
          <InputLabel
            id="sort-select-label"
            style={{ padding: '0.25rem 0.5rem' }}
          >
            Sort By:
          </InputLabel>

          <Select
            id="sort-select"
            labelId="sort-select-label"
            value={field}
            onChange={handleOnChange}
            className="noPseudoBorders"
            style={{ height: '100%', padding: '0 0.5rem' }}
          >
            {searchFields.map(({ label, dbField }, index) => (
              <MenuItem key={`sort-field-item-${dbField}`} value={dbField}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider sx={{ height: 28, m: 'auto 1px' }} orientation="vertical" />

        <ToggleButton
          value="ascending"
          color="primary"
          selected={isAscending}
          onChange={toggleIsAscending}
          style={{ border: 'none' }}
        >
          <SortByAlphaIcon />
        </ToggleButton>
      </ButtonGroup>
    </Paper>
  )
}
