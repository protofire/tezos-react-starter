import React from 'react'
import { TezosToolkit } from '@taquito/taquito'
import { Line } from 'rc-progress'

import { useOperationProgress } from '../hooks/useOperationProgress.hook'

export const OperationProgress = ({ taquito }: { taquito: TezosToolkit }) => {
  const progress = useOperationProgress(taquito)

  return <Line percent={progress} strokeWidth={2} strokeColor="#14854f" />
}
