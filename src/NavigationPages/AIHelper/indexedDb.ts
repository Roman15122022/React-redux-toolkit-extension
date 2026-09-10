import { AIModelMetadata } from './types'
import {
  AI_METADATA_DB_NAME,
  AI_METADATA_KEY,
  AI_METADATA_STORE_NAME,
} from './constants'

type StoredAIModelMetadata = AIModelMetadata & {
  id: string
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(AI_METADATA_DB_NAME, 1)

    request.onupgradeneeded = () => {
      const database = request.result

      if (!database.objectStoreNames.contains(AI_METADATA_STORE_NAME)) {
        database.createObjectStore(AI_METADATA_STORE_NAME, { keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getAIModelMetadata(): Promise<AIModelMetadata | null> {
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(AI_METADATA_STORE_NAME, 'readonly')
    const store = transaction.objectStore(AI_METADATA_STORE_NAME)
    const request = store.get(AI_METADATA_KEY)

    request.onsuccess = () => {
      const result = request.result as StoredAIModelMetadata | undefined

      if (!result) {
        resolve(null)

        return
      }

      const { version, trainedAt, trainedSessionCount, loss, prediction } =
        result

      resolve({ version, trainedAt, trainedSessionCount, loss, prediction })
    }
    request.onerror = () => reject(request.error)
    transaction.oncomplete = () => database.close()
  })
}

export async function saveAIModelMetadata(
  metadata: AIModelMetadata,
): Promise<void> {
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(
      AI_METADATA_STORE_NAME,
      'readwrite',
    )
    const store = transaction.objectStore(AI_METADATA_STORE_NAME)
    const request = store.put({ id: AI_METADATA_KEY, ...metadata })

    request.onerror = () => reject(request.error)
    transaction.oncomplete = () => {
      database.close()
      resolve()
    }
    transaction.onerror = () => reject(transaction.error)
  })
}
