// Components.
import { Box, Chip, ListItem, Paper } from '@mui/material'

export default function FilterList(props) {
  const { selectedFilters, handleAddRemoveFilter } = props

  return (
    <Paper
      component="ul"
      elevation={0}
      sx={{
        display: 'flex', flexWrap: 'wrap', listStyle: 'none',
        maxHeight: 100, p: 0, my: 0, mx: 2, overflow: 'auto'
      }}
    >
      {Object.keys(selectedFilters).map((category) => (
        selectedFilters[category].map((filter) => (
          (
            <ListItem key={`filter-chip-${filter}`} sx={{ width: 'unset', p: 0, m: 0.5 }}>
              <Chip
                label={filter}
                color="primary"
                variant="outlined"
                onDelete={() => handleAddRemoveFilter({ category, filter })}
                style={{ textTransform: 'capitalize' }}
              />
            </ListItem>
          )
        ))
      ))}
    </Paper>
  )
}
