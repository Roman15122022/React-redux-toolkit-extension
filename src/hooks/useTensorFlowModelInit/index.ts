import { useEffect, useState } from "react";
import * as tf from '@tensorflow/tfjs'
import { IndexDB, LocalStorageKeys } from "../../types";

export const useTensorFlowInit = () => {
  const [isModelReady, setIsModelReady] = useState(false)
  const [isModelLoading, setIsModelLoading] = useState(true)
  const [modelStats, setModelStats] = useState({
    trainedOn: 0,
    lastTrainingTime: 0
  })

  useEffect(() => {
    initializeTensorFlow()
  }, [])

  const initializeTensorFlow = async () => {
    try {
      await tf.ready()
      console.log('TensorFlow ready to use')

      try {
        const model = await tf.loadLayersModel(IndexDB.MODEL)
        console.log('Model successfully loaded from IndexedDB')

        const modelInfo =  localStorage.getItem(LocalStorageKeys.MODEL_INFO)
        if (modelInfo) {
          setModelStats(modelInfo as any)
        }

        setIsModelReady(true)
        setIsModelLoading(false)
      } catch (e) {
        console.log('The model is not found in IndexedDB, it will be created on the first data')
        setIsModelReady(false)
        setIsModelLoading(false)
      }
    } catch (error) {
      console.error('Error during TensorFlow initialisation:', error)
      setIsModelLoading(false)
    }
  }

  return {
    isModelReady,
    isModelLoading,
    modelStats
  }
}