import { useState } from 'react'

// Components.
import {
  Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FilterList from './FilterList'
import FilterSelect from './FilterSelect'

// Styles, utils, and other helpers.
import { sort } from 'fast-sort'
import { FILTER_FIELDS } from '../utils/constants'

const getDefaultSelectedFilters = () => {
  return (
    Object.keys(FILTER_FIELDS)
      .reduce((accumulator, currentValue) => ({
        ...accumulator,
        [currentValue]: []
      }), {}
      )
  )
}

export default function FilterAccordion({ handleFilter }) {
  const [selectedFilters, setSelectedFilters] = useState(getDefaultSelectedFilters())

  const handleAddRemoveFilter = ({ category, filter }) => {
    if (category === 'all' && filter === 'all') {
      const defaultSelectedFilters = getDefaultSelectedFilters()
      return setSelectedFilters(defaultSelectedFilters)
    }

    const filters = selectedFilters[category]
    const isSelected = filters.includes(filter)
    let newFilters = [...filters]

    if (isSelected) {
      newFilters = newFilters.filter((value) => value !== filter)
    } else {
      newFilters.push(filter)
    }

    const updatedSFilters = {
      ...selectedFilters,
      [category]: newFilters
    }

    setSelectedFilters(updatedSFilters)
    handleFilter(updatedSFilters)
  }

  const filterCategories = Object.keys(FILTER_FIELDS).sort()
  const mergedSelectedFilters = [].concat.apply([], Object.values(selectedFilters))

  return (
    <Accordion>
      <AccordionSummary
        id="filter-panel-header"
        aria-controls="filter-panel-content"
        expandIcon={<ExpandMoreIcon />}
        sx={{ '& .MuiAccordionSummary-content': { alignItems: 'flex-start', m: 0, maxHeight: 100 } }}
      >
        <Box>
          <Box display="flex" width="100%">
            <Typography variant="h5" component="div" fontWeight="bold">
              Filters:
            </Typography>

            {mergedSelectedFilters.length === 0 && (
              <Typography variant="h6" component="div" mx={5}>
                Click to add filters
              </Typography>
            )}
          </Box>

          {mergedSelectedFilters.length > 0 && (
            <Button
              size="small"
              color="warning"
              onClick={() => handleAddRemoveFilter({ category: 'all', filter: 'all' })}
            >
              Clear
            </Button>
          )}
        </Box>

        <FilterList
          selectedFilters={selectedFilters}
          handleAddRemoveFilter={handleAddRemoveFilter}
        />
      </AccordionSummary>

      <AccordionDetails style={{ borderTop: 'medium solid #542989' }}>
        <Box display="flex" flexWrap="wrap" overflow="auto">
          {filterCategories.map((category) => (
            <FilterSelect
              key={`filter-select-${category}`}
              category={category}
              choices={sort(FILTER_FIELDS[category]).asc()}
              selectedChoices={selectedFilters[category] ?? []}
              handleAddRemoveFilter={handleAddRemoveFilter}
            />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion >
  )
}
