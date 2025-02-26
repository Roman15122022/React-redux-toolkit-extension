import React from 'react'
import { FormControl, MenuItem, Select } from '@mui/material'
import SentimentVerySatisfiedRoundedIcon from '@mui/icons-material/SentimentVerySatisfiedRounded'
import SentimentVeryDissatisfiedRoundedIcon from '@mui/icons-material/SentimentVeryDissatisfiedRounded'
import SentimentSatisfiedRoundedIcon from '@mui/icons-material/SentimentSatisfiedRounded'
import SentimentNeutralRoundedIcon from '@mui/icons-material/SentimentNeutralRounded'
import SentimentDissatisfiedRoundedIcon from '@mui/icons-material/SentimentDissatisfiedRounded'

import useTheme from '../../hooks/useTheme'

import { MoodSelectOptions } from './types'
import { MoodColorDictionary } from './constants'

export const MoodSelect = ({
  value,
  onChange,
}: MoodSelectOptions): JSX.Element => {
  const { theme } = useTheme()

  return (
    <FormControl>
      <Select
        value={value}
        autoWidth
        onChange={onChange}
        className="mt-2 w-[54px] h-[40px] light:text-white dark:text-white"
        IconComponent={null}
        sx={{
          '& .MuiSelect-select': {
            paddingRight: '0px !important',
          },
          '& .MuiOutlinedInput-input': {
            paddingRight: '0px !important',
          },
          border: `2px solid ${MoodColorDictionary[value][theme]}`,
          borderRadius: '4px',
        }}
      >
        <MenuItem value={1}>
          <SentimentVeryDissatisfiedRoundedIcon color="error" />
        </MenuItem>
        <MenuItem value={2}>
          <SentimentDissatisfiedRoundedIcon color="warning" />
        </MenuItem>
        <MenuItem value={3}>
          <SentimentNeutralRoundedIcon color="inherit" />
        </MenuItem>
        <MenuItem value={4}>
          <SentimentSatisfiedRoundedIcon color="info" />
        </MenuItem>
        <MenuItem value={5}>
          <SentimentVerySatisfiedRoundedIcon color="success" />
        </MenuItem>
      </Select>
    </FormControl>
  )
}
