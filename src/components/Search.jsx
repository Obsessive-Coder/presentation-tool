// Components.
import SearchIcon from '@mui/icons-material/Search'
import { Divider, IconButton, InputBase, Paper } from '@mui/material'

export default function Search({ handleSearch }) {
  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', mx: 5, display: 'flex', alignItems: 'center', flexGrow: 1, flexShrink: 0, maxWidth: 600 }}
      onSubmit={handleSearch}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search"
        inputProps={{ 'aria-label': 'search' }}
        name="searchTerm"
      />

      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon color="primary" />
      </IconButton>
    </Paper>
  )
}
