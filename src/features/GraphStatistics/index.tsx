import * as React from 'react'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'
import ListItem from '@mui/material/ListItem'
import List from '@mui/material/List'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'

import { TypeTittle } from '../../types'
import Title from '../../components/Title'
import Button from '../../components/Button'

import { useGraphStatistics } from './useGraphStatistics'
import { GraphStatisticsProps } from './types'

export const GraphStatistics = ({
  dates,
  dataFilteredOnlyByTimePeriod,
  setIsActivityFilterVisible,
}: GraphStatisticsProps): JSX.Element => {
  const { locale, open, toggleDrawer, chartTypes, currentGraph, currentTitle } =
    useGraphStatistics(
      dates,
      dataFilteredOnlyByTimePeriod,
      setIsActivityFilterVisible,
    )

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {chartTypes.map(({ id, title, icon, isActive, onClick }) => (
          <ListItem key={id} disablePadding>
            <ListItemButton onClick={onClick} disabled={isActive}>
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
      <div className="flex items-center justify-between my-3">
        <Title variant={TypeTittle.SMALL} title={currentTitle} />
        <Button onClick={toggleDrawer(true)}>{locale.more}</Button>
      </div>
      <div>{currentGraph}</div>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  )
}
