import { useEffect, useState } from 'react'

// Components.
import {
  Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FilterList from './FilterList'
import FilterSelect from './FilterSelect'

// Styles, utils, and other helpers.
import { sort } from 'fast-sort'
import { READ_FIRESTORE_DATA } from '../utils/firebase/firestore'

const getDefaultSelectedFilters = (filterFields = []) => {
  return (
    Object.keys(filterFields)
      .reduce((accumulator, currentValue) => ({
        ...accumulator,
        [currentValue]: []
      }), {}
      )
  )
}


export default function FilterAccordion({ setAlertData, handleFilter, handleSort }) {
  const [filterFields, setFilterFields] = useState({})
  const [selectedFilters, setSelectedFilters] = useState({})

  const handleAddRemoveFilter = ({ category, filter }) => {
    if (category === 'all' && filter === 'all') {
      const defaultSelectedFilters = getDefaultSelectedFilters(filterFields)
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

  const filterCategories = Object.keys(filterFields).sort()

  useEffect(() => {
    (() => {
      if (setAlertData) {
        READ_FIRESTORE_DATA('constants')
          .then((snapshot) => {
            // Store filter fields data in state.
            let filterFields = {}
            snapshot.forEach((doc) => filterFields = doc.data())
            setFilterFields(filterFields)
            setSelectedFilters(getDefaultSelectedFilters(filterFields))
          })
          .catch(error => {
            setAlertData({
              isOpen: true,
              severity: 'error',
              message: `Error retrieving data from the database. Please try again later.\n${JSON.stringify(error)}`
            })
          })
      }
    })()
  }, [])

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
              choices={sort(filterFields[category]).asc()}
              selectedChoices={selectedFilters[category] ?? []}
              handleAddRemoveFilter={handleAddRemoveFilter}
            />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion >
  )
}
