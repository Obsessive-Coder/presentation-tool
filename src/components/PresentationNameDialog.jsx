import { useState } from 'react'

// Components.
import {
  Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@mui/material'

export default function PresentationNameDialog({ isOpen, handleClose, handleSave }) {
  const [presentationName, setPresentationName] = useState('')

  const handleOnChange = (event) => {
    setPresentationName(event.target.value)
  }

  const handleSaveOnClick = () => {
    handleSave(presentationName.trim())
    handleClose()
  }

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle style={{ padding: 10, backgroundColor: '#542989', color: 'white' }}>Save Presentation</DialogTitle>

      <DialogContent style={{ paddingTop: 10 }}>
        <DialogContentText>Name for your presentation.</DialogContentText>

        <TextField
          autoFocus
          fullWidth
          id="presentationName"
          margin="dense"
          label="Name"
          type="text"
          variant="standard"
          value={presentationName}
          onChange={handleOnChange}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>

        <Button disabled={!presentationName.trim()} onClick={handleSaveOnClick}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
