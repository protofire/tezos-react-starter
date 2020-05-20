import { useEffect, useState } from 'react'

import { TEZOS_RPC as rpc } from '../config/constants'
import { Tezos } from '@taquito/taquito'
import { Account } from '../utils/types'
import { InMemorySigner } from '@taquito/signer'

export const useOperationProgress = (account: Maybe<Account>): number => {
  const [progress, setProgress] = useState<number>(0)
  const [timestamp, setTimestamp] = useState<Maybe<Date>>(null)

  const signer = account
    ? InMemorySigner.fromFundraiser(account.email, account.password, account.mnemonic.join(' '))
    : undefined

  Tezos.setProvider({ rpc, signer })

  useEffect(() => {
    Tezos.rpc.getBlockHeader().then(({ timestamp }) => {
      setTimestamp(new Date(timestamp))
    })
  }, [])

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
