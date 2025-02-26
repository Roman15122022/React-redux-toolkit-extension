import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

import { useSelectStatPeriod } from './useSelectStatPeriod'
import { SelectStatPeriodProps } from './types'

export const SelectStatPeriod = ({
  value,
  onChange,
}: SelectStatPeriodProps): JSX.Element => {
  const { styles, locale } = useSelectStatPeriod()

  return (
    <FormControl
      sx={{ m: 1, minWidth: 120, margin: 0, ...styles }}
      size="small"
    >
      <InputLabel id="demo-select-small-label">{locale.period}</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={value || 0}
        label={locale.period}
        onChange={onChange}
      >
        <MenuItem value={1}>{locale.day}</MenuItem>
        <MenuItem value={7}>{locale.week}</MenuItem>
        <MenuItem value={30}>{locale.month}</MenuItem>
        <MenuItem value={0}>{locale.allTime}</MenuItem>
      </Select>
    </FormControl>
  )
}
