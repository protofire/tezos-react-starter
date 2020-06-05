import { useEffect, useState } from 'react'
import { TezosToolkit } from '@taquito/taquito'

export const useOperationProgress = (taquito: TezosToolkit): number => {
  const [progress, setProgress] = useState<number>(0)
  const [timestamp, setTimestamp] = useState<Maybe<Date>>(null)

  useEffect(() => {
    taquito.rpc.getBlockHeader().then(({ timestamp }) => {
      setTimestamp(new Date(timestamp))
    })
  }, [taquito.rpc])

  useEffect(() => {
    let buffer = 1
    let init = 1
    const step = 0.95
    const interval = setInterval(() => {
      const diff = new Date().getTime() - (timestamp?.getTime() ?? 0)
      const progress = Math.min((diff / 1000 / 30) * 80, 80)
      setProgress(progress + buffer)
      init *= step
      buffer = buffer + init
    }, 1000)

    return () => clearInterval(interval)
  }, [timestamp])

  return progress
}
