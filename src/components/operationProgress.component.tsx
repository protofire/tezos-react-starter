import React from 'react'
import { Line } from 'rc-progress'

import { useOperationProgress } from '../hooks/useOperationProgress.hook'
import { Account } from '../utils/types'

export const OperationProgress = ({ account }: { account: Maybe<Account> }) => {
  const progress = useOperationProgress(account)

  return <Line percent={progress} strokeWidth={2} strokeColor="#14854f" />
}
