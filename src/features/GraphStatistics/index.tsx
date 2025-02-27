import * as React from 'react'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'
import ListItem from '@mui/material/ListItem'
import List from '@mui/material/List'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'

import Button from '../../components/Button'

import { useGraphStatistics } from './useGraphStatistics'
import { GraphStatisticsProps } from './types'

export const GraphStatistics = ({
  dates,
}: GraphStatisticsProps): JSX.Element => {
  const { locale, open, toggleDrawer, chartTypes, currentGraph } =
    useGraphStatistics(dates)

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {chartTypes.map(({ id, title, icon, onClick }) => (
          <ListItem key={id} disablePadding>
            <ListItemButton onClick={onClick}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <div>
      <div className="flex justify-end mt-1.5">
        <Button onClick={toggleDrawer(true)}>{locale.more}</Button>
      </div>
      <div>{currentGraph}</div>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  )
}
