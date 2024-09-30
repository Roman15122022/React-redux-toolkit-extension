import React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

import { useInputNameActivity } from './useInputNameActivity'
import { InputNameActivityProps } from './types'

const InputNameActivity = ({
  nameLabel,
}: InputNameActivityProps): JSX.Element => {
  const { defaultColor, activeColor, textColor } = useInputNameActivity()

  return (
    <Autocomplete
      freeSolo
      options={['1', '2']}
      renderInput={params => (
        <TextField
          {...params}
          label={nameLabel}
          error={false}
          sx={{
            width: 160,
            height: 39,
            padding: 0,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: `${defaultColor} !important`, // Color outline
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: `${activeColor} !important`, // On hover outline color
              color: 'red',
            },
            '& .MuiInputLabel-root': {
              color: defaultColor,
              marginLeft: '3px',
              fontSize: '13px',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: activeColor, //  Color label focus
              marginLeft: '3px',
            },
            '& .MuiInputBase-input': {
              color: textColor, // Color Text
              padding: '4.5px 4px 3.5px 5px !important',
              marginBottom: '3px',
            },
            '& .MuiOutlinedInput-root': {
              padding: '7px !important',
              borderRadius: '10px',
            },
            '& .MuiSvgIcon-root': {
              fill: activeColor,
            },
          }}
        />
      )}
    />
  )
}

export default InputNameActivity
