import { TimePeriod } from '../../types'

export type AIRecommendationType =
  | 'rest'
  | 'shortSession'
  | 'increase'
  | 'steady'

export type AIPrediction = {
  mood: number
  studyTimeSeconds: number
  sessionCount: number
  badMoodRiskPercent: number
  fatigueScorePercent: number
  consistencyScorePercent: number
  recommendation: AIRecommendationType
}

export type AIModelMetadata = {
  version: 2
  trainedAt: string
  trainedSessionCount: number
  loss: number
  prediction: AIPrediction
}

export type AIModelStatus =
  | 'notEnoughData'
  | 'training'
  | 'trained'
  | 'ready'
  | 'fallback'
  | 'error'

export type AIResult = {
  status: AIModelStatus
  prediction: AIPrediction
  trainedAt?: string
  trainedSessionCount?: number
  loss?: number
  neededSessions: number
  error?: string
}

export type TrainingExample = {
  input: number[]
  output: number[]
}

export type TensorFlowModule = typeof import('@tensorflow/tfjs')

export type TrainingSource = {
  sessions: TimePeriod[]
  boundary: number
}
