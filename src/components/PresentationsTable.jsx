// Components.
import {
  IconButton, Paper, Tooltip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import PreviewIcon from '@mui/icons-material/Preview'

export default function PresentationsTable(props) {
  const { presentations, handleOpenViewDialog, handleDeletePresentation } = props

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 800, mx: 'auto' }}>
      <Table aria-label="presentations table">
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
            <TableCell align="right" style={{ fontWeight: 'bold' }}># Slides</TableCell>
            <TableCell align="right" style={{ fontWeight: 'bold' }}>View</TableCell>
            <TableCell align="right" style={{ fontWeight: 'bold' }}></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {presentations.map(presentation => {
            const { id, name, slides } = presentation

            return (
              <TableRow
                key={`table-row-${id}`}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">{name}</TableCell>
                <TableCell align="right">{slides.length}</TableCell>

                <TableCell align="right">
                  <Tooltip title="View">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenViewDialog(presentation)}
                      style={{ padding: 0 }}
                    >
                      <PreviewIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>

                <TableCell align="right">
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => handleDeletePresentation(id, name)}
                      sx={{ '&:hover': { color: 'red' } }}
                      style={{ padding: 0 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
