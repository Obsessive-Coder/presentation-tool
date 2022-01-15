import React from 'react'

// Components.
import { useNavigate } from 'react-router-dom'
import {
  Box, Card, CardActionArea, CardContent, List, ListItem, ListItemIcon, ListItemText, Typography,
} from "@mui/material"
import StarIcon from '@mui/icons-material/Star'

const items = [{
  label: 'Presentations',
  bullets: ['View Presentations', 'Delete Presentations', 'Show Presentations', 'MORE'],
}, {
  label: 'Slides',
  bullets: ['Filter Slides', 'Sort Slides', 'Create Presentation', 'MORE'],
},
  // {
  //   label: 'Help',
  //   bullets: ['Create Presentations', 'Delete Presentations', 'Show Presentations', 'MORE'],
  // },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <main>
      <Typography variant="h2" textAlign="center" color="primary">
        Microdried Presentation Tool
      </Typography>

      <Box display="flex" justifyContent="space-around" flexWrap="wrap" mt={8}>

        {items.map(({ label, bullets }) => (
          <Card
            raised
            sx={{ flex: 1, mx: 8, width: 350, border: 'thin solid #542989' }}
          >
            <CardActionArea onClick={() => navigate(`/${label.toLowerCase()}`)}>
              <CardContent>
                <Typography variant="h3" component="div" color="primary" textAlign="center" fontWeight="bold">
                  {label}
                </Typography>

                <List dense>
                  {bullets.map((item) => (
                    <ListItem key={`list-item-${item}`}>
                      <ListItemIcon sx={{ textAlign: 'center' }}>
                        <StarIcon color="secondary" />
                      </ListItemIcon>

                      <ListItemText
                        primary={item}
                        primaryTypographyProps={{ fontSize: 'large', fontWeight: 'bold' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </main>
  )
}
