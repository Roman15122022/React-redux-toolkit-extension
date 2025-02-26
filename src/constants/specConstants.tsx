import React from 'react'
import SentimentVerySatisfiedRoundedIcon from '@mui/icons-material/SentimentVerySatisfiedRounded'
import SentimentVeryDissatisfiedRoundedIcon from '@mui/icons-material/SentimentVeryDissatisfiedRounded'
import SentimentSatisfiedRoundedIcon from '@mui/icons-material/SentimentSatisfiedRounded'
import SentimentNeutralRoundedIcon from '@mui/icons-material/SentimentNeutralRounded'
import SentimentDissatisfiedRoundedIcon from '@mui/icons-material/SentimentDissatisfiedRounded'

export const MoodDictionary = {
  1: <SentimentVeryDissatisfiedRoundedIcon color="error" />,
  2: <SentimentDissatisfiedRoundedIcon color="warning" />,
  3: <SentimentNeutralRoundedIcon color="inherit" />,
  4: <SentimentSatisfiedRoundedIcon color="info" />,
  5: <SentimentVerySatisfiedRoundedIcon color="success" />,
}
