import React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

import { useInputNameActivity } from './useInputNameActivity'
import { InputNameActivityProps } from './types'
import { MAX_LENGTH } from './constants'

const InputNameActivity = ({
  nameLabel,
  currentLength,
  onChanges,
  isError,
}: InputNameActivityProps): JSX.Element => {
  const { styles, options } = useInputNameActivity(isError)

  return (
    <div className="relative">
      <Autocomplete
        freeSolo
        options={options}
        onInputChange={onChanges}
        renderInput={params => (
          <TextField
            {...params}
            inputProps={{ ...params.inputProps, maxLength: MAX_LENGTH }}
            label={nameLabel}
            error={isError}
            sx={styles}
          />
        )}
      />
      <span
        className={`font-extrabold text-[8px] absolute right-2.5 bottom-[-3px] ${
          isError
            ? 'text-red-600'
            : `text-secondary-light dark:text-purple-light`
        }`}
      >
        {currentLength}/{MAX_LENGTH}
      </span>
    </div>
  )
}

export default InputNameActivity
