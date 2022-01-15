// Components.
import { InputLabel, MenuItem, FormControl, ListItemText, Select, Checkbox, } from '@mui/material'

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 400,
      width: 200,
    },
  },
}

export default function FilterSelect(props) {
  const { category, choices, selectedChoices, handleAddRemoveFilter } = props

  const handleOnChange = (event, option) => {
    const { value: filter } = option.props
    handleAddRemoveFilter({ category, filter })
  }

  const readableCategory = category.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase() })

  return (
    <FormControl size="small" sx={{ my: 1, mx: 2, width: 200 }}>
      <InputLabel id={`filter-select-label-${category}`} style={{ textTransform: 'capitalize' }}>
        {readableCategory}
      </InputLabel>

      <Select
        multiple
        labelId={`filter-select-label-${category}`}
        id={`filter-select-${category}`}
        label={readableCategory}
        value={selectedChoices}
        onChange={handleOnChange}
        renderValue={(selected) => selected.join(', ')}
        MenuProps={MenuProps}

      >
        {choices.map((choice, index) => (
          <MenuItem key={`filter-choice-${choice}-${index}`} value={choice}>
            <Checkbox checked={selectedChoices.includes(choice)} />
            <ListItemText primary={choice} primaryTypographyProps={{ style: { textTransform: 'capitalize', fontSize: 'small', overflowWrap: 'break-word', wordWrap: 'break-word', hyphens: 'auto', whiteSpace: 'normal' } }} />
          </MenuItem>

          //   overflow - wrap: break-word;
          // word-wrap: break-word;
          // hyphens: auto;
          // white-space: normal;
        ))}
      </Select>
    </FormControl>
  )
}
