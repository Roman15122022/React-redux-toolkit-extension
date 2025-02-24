import React from 'react'
import { FormControl, MenuItem, Select } from '@mui/material'
import SentimentVerySatisfiedRoundedIcon from '@mui/icons-material/SentimentVerySatisfiedRounded'
import SentimentVeryDissatisfiedRoundedIcon from '@mui/icons-material/SentimentVeryDissatisfiedRounded'
import SentimentSatisfiedRoundedIcon from '@mui/icons-material/SentimentSatisfiedRounded'
import SentimentNeutralRoundedIcon from '@mui/icons-material/SentimentNeutralRounded'
import SentimentDissatisfiedRoundedIcon from '@mui/icons-material/SentimentDissatisfiedRounded'

import { MoodSelectOptions } from './types'
import { SX_SELECTOR } from './constants'

export const MoodSelect = ({
  value,
  onChange,
}: MoodSelectOptions): JSX.Element => {
  return (
    <FormControl>
      <Select
        value={value.toString()}
        autoWidth
        onChange={onChange}
        className="mt-2 w-[52px] h-[40px] rounded-[15px] bg-secondary-light dark:bg-purple-dark light:text-white dark:text-white"
        IconComponent={null}
        sx={SX_SELECTOR}
      >
        <MenuItem value={1}>
          <SentimentVeryDissatisfiedRoundedIcon color="error" />
        </MenuItem>
        <MenuItem value={2}>
          <SentimentDissatisfiedRoundedIcon color="warning" />
        </MenuItem>
        <MenuItem value={3}>
          <SentimentNeutralRoundedIcon />
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
