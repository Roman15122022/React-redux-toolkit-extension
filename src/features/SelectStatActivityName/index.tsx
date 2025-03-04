import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

import { SelectStatPeriodProps } from '../SelectStatPeriod/types'

import { useSelectStatActivityName } from './useSelectStatActivityName'

export const SelectStatActivityName = ({
  value,
  onChange,
}: SelectStatPeriodProps): JSX.Element => {
  const { locale, styles, options } = useSelectStatActivityName()

  return (
    <FormControl sx={{ margin: 0, minWidth: 65, ...styles }} size="small">
      <InputLabel id="demo-select-small-label">
        {locale.chooseActivityName}
      </InputLabel>
      <Select
        className="custom-select"
        labelId="demo-select-small-label"
        id="demo-select-small"
        autoWidth
        value={value || 0}
        label={locale.chooseActivityName}
        onChange={onChange}
        IconComponent={() => null}
        sx={{
          '& .MuiSelect-select': {
            paddingRight: '15px !important',
          },
        }}
      >
        {options.map(option => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
        <MenuItem value={0}>{locale.allActivities}</MenuItem>
      </Select>
    </FormControl>
  )
}
