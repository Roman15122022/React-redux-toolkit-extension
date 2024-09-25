import React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

import { useInputNameActivity } from './useInputNameActivity'
import { InputNameActivityProps } from './types'

const InputNameActivity = ({
  nameLabel,
}: InputNameActivityProps): JSX.Element => {
  const { name } = useInputNameActivity()

  return (
    <Autocomplete
      freeSolo
      options={['1', '2']}
      renderInput={params => (
        <TextField
          {...params}
          label={nameLabel}
          sx={{
            width: 150,
            height: 39,
            fontSize: 14,
            padding: 0,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'purple', // Color outline
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'darkpurple', // On hover outline color
            },
            '& .MuiInputLabel-root': {
              color: 'white',
              marginLeft: '2px',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'purple', //  Color label focus
              marginLeft: '2px',
            },
            '& .MuiInputBase-input': {
              color: 'white', // Color Text
              padding: '4.5px 4px 3.5px 5px !important',
              marginBottom: '3px',
            },
            '& .MuiOutlinedInput-root': {
              padding: '7px !important', // Применяем padding через sx
              borderRadius: '10px',
            },
          }}
        />
      )}
    />
  )
}

export default InputNameActivity
