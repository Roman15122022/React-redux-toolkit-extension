import type { LayersModel, Sequential } from '@tensorflow/tfjs'

import { TimePeriod } from '../../types'

import {
  AIModelMetadata,
  AIResult,
  TensorFlowModule,
  TrainingExample,
} from './types'
import { getAIModelMetadata, saveAIModelMetadata } from './indexedDb'
import {
  createInputFeatures,
  createTrainingExamples,
  getCompletedSessions,
  getFallbackPrediction,
  getNeededSessions,
  getTrainingSource,
  normalizePrediction,
} from './helpers'
import {
  AI_MODEL_STORAGE_URL,
  AI_MODEL_VERSION,
  FEATURE_COUNT,
  MIN_TRAINING_SESSIONS,
  OUTPUT_COUNT,
} from './constants'

type AIModel = LayersModel | Sequential

async function loadTensorFlow(): Promise<TensorFlowModule> {
  const tf = await import('@tensorflow/tfjs')

  await tf.ready()

  return tf
}

function createModel(tf: TensorFlowModule): Sequential {
  const model = tf.sequential()

  model.add(
    tf.layers.dense({
      inputShape: [FEATURE_COUNT],
      units: 12,
      activation: 'relu',
    }),
  )
  model.add(tf.layers.dense({ units: 8, activation: 'relu' }))
  model.add(tf.layers.dense({ units: OUTPUT_COUNT, activation: 'sigmoid' }))
  model.compile({
    optimizer: tf.train.adam(0.03),
    loss: 'meanSquaredError',
  })

  return model
}

async function predictWithModel(
  tf: TensorFlowModule,
  model: AIModel,
  sessions: TimePeriod[],
): Promise<AIModelMetadata['prediction']> {
  const latestIndex = sessions.length - 1
  const input = tf.tensor2d([createInputFeatures(sessions, latestIndex)])
  const output = model.predict(input)
  const outputTensor = Array.isArray(output) ? output[0] : output
  const rawPrediction = Array.from(await outputTensor.data())

  input.dispose()
  outputTensor.dispose()

  return normalizePrediction(rawPrediction, sessions)
}

async function trainModel(
  tf: TensorFlowModule,
  examples: TrainingExample[],
): Promise<{
  model: Sequential
  loss: number
}> {
  const model = createModel(tf)
  const xs = tf.tensor2d(examples.map(example => example.input))
  const ys = tf.tensor2d(examples.map(example => example.output))
  const history = await model.fit(xs, ys, {
    epochs: 80,
    batchSize: Math.min(8, examples.length),
    shuffle: true,
    verbose: 0,
  })
  const losses = history.history.loss as number[]

  xs.dispose()
  ys.dispose()

  return {
    model,
    loss: losses[losses.length - 1] || 0,
  }
}

export async function trainAndSaveAIModel(
  dates: TimePeriod[],
): Promise<AIModelMetadata> {
  const { sessions, boundary } = getTrainingSource(dates)

  if (boundary < MIN_TRAINING_SESSIONS) {
    throw new Error('Not enough sessions to train AI model')
  }

  const examples = createTrainingExamples(sessions)
  const tf = await loadTensorFlow()
  const { model, loss } = await trainModel(tf, examples)
  const prediction = await predictWithModel(tf, model, sessions)
  const metadata: AIModelMetadata = {
    version: AI_MODEL_VERSION,
    trainedAt: new Date().toISOString(),
    trainedSessionCount: boundary,
    loss,
    prediction,
  }

  await model.save(AI_MODEL_STORAGE_URL)
  await saveAIModelMetadata(metadata)
  model.dispose()

  return metadata
}

export async function trainAIModelAfterSession(
  dates: TimePeriod[],
): Promise<AIModelMetadata | null> {
  const sessions = getCompletedSessions(dates)

  if (
    sessions.length < MIN_TRAINING_SESSIONS ||
    sessions.length % MIN_TRAINING_SESSIONS !== 0
  ) {
    return null
  }

  return trainAndSaveAIModel(sessions)
}

async function loadSavedPrediction(
  dates: TimePeriod[],
  metadata: AIModelMetadata,
): Promise<AIModelMetadata['prediction']> {
  const sessions = getCompletedSessions(dates)
  const tf = await loadTensorFlow()
  const model = await tf.loadLayersModel(AI_MODEL_STORAGE_URL)
  const prediction = await predictWithModel(tf, model, sessions)

  model.dispose()

  return prediction || metadata.prediction
}

export async function getAIResult(dates: TimePeriod[]): Promise<AIResult> {
  const sessions = getCompletedSessions(dates)
  const neededSessions = getNeededSessions(sessions.length)
  const fallbackPrediction = getFallbackPrediction(sessions)

  if (neededSessions > 0) {
    return {
      status: 'notEnoughData',
      prediction: fallbackPrediction,
      neededSessions,
    }
  }

  try {
    const metadata = await getAIModelMetadata()
    const { boundary } = getTrainingSource(sessions)

    if (
      !metadata ||
      metadata.version !== AI_MODEL_VERSION ||
      metadata.trainedSessionCount < boundary
    ) {
      const trainedMetadata = await trainAndSaveAIModel(sessions)

      return {
        status: 'trained',
        prediction: trainedMetadata.prediction,
        trainedAt: trainedMetadata.trainedAt,
        trainedSessionCount: trainedMetadata.trainedSessionCount,
        loss: trainedMetadata.loss,
        neededSessions: 0,
      }
    }

    const prediction = await loadSavedPrediction(sessions, metadata)

    return {
      status: 'ready',
      prediction,
      trainedAt: metadata.trainedAt,
      trainedSessionCount: metadata.trainedSessionCount,
      loss: metadata.loss,
      neededSessions: 0,
    }
  } catch (error) {
    return {
      status: 'fallback',
      prediction: fallbackPrediction,
      neededSessions: 0,
      error: error instanceof Error ? error.message : 'AI model error',
    }
  }
}
