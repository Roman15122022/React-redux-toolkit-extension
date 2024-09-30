import React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

import { useInputNameActivity } from './useInputNameActivity'
import { InputNameActivityProps } from './types'

const InputNameActivity = ({
  nameLabel,
  onChanges,
  isError,
}: InputNameActivityProps): JSX.Element => {
  const { styles } = useInputNameActivity(isError)

  return (
    <Autocomplete
      freeSolo
      options={['1', '2']}
      onInputChange={onChanges}
      renderInput={params => (
        <TextField {...params} label={nameLabel} error={isError} sx={styles} />
      )}
    />
  )
}

export default InputNameActivity
