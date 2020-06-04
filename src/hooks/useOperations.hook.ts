import { useEffect, useState } from 'react'

import { fetchOperations } from '../utils/tool'
import { RemoteData } from '../utils/remote_data'

export const useOperations = (
  expectedOperationsCount: number,
): {
  operations: RemoteData<any[]>
  moreOperations: boolean
} => {
  const [operations, setOperations] = useState<RemoteData<any[]>>(RemoteData.loading())
  const [latestIdToCheck, setLatestIdToCheck] = useState<number>(0)
  const [moreOperations, setMoreOperations] = useState(true)
  const [needFetchMore, setNeedFetchMore] = useState(true)

  useEffect(() => {
    setMoreOperations(latestIdToCheck === null || latestIdToCheck > 1490010383583048)
  }, [latestIdToCheck])

  useEffect(() => {
    if (
      RemoteData.is.success(operations) &&
      operations.data.length < expectedOperationsCount &&
      moreOperations
    ) {
      setNeedFetchMore(true)
    }
  }, [operations, moreOperations, expectedOperationsCount])

  // fetch operations
  useEffect(() => {
    let didCancel = false

    const run = async () => {
      try {
        setOperations(operations =>
          RemoteData.hasData(operations)
            ? RemoteData.reloading(operations.data)
            : RemoteData.loading(),
        )
        const result = await fetchOperations(latestIdToCheck, expectedOperationsCount)

        if (!didCancel) {
          setNeedFetchMore(false)
          setLatestIdToCheck(result.lastId)
          setOperations(currentOperations =>
            RemoteData.hasData(currentOperations)
              ? RemoteData.success(currentOperations.data.concat(result.operations))
              : RemoteData.success(result.operations),
          )
        }
      } catch (e) {
        if (!didCancel) {
          setOperations(RemoteData.failure(e))
        }
      }
    }

    if (needFetchMore) {
      run()
    }

    return () => {
      didCancel = true
    }
  }, [latestIdToCheck, expectedOperationsCount, needFetchMore])

  return {
    operations,
    moreOperations,
  }
}
