import React from 'react'
import { TezosToolkit } from '@taquito/taquito'

import { useAccount } from '../hooks/useAccount.hook'
import { useContracts } from '../hooks/useContracts.hook'
import { useUpdater } from '../hooks/useUpdater.hook'
import { useTaquito } from '../hooks/useTaquito.hook'
import { TokenService } from '../services/tokenContract.service'
import { Account } from '../utils/types'
import { baseConfig } from '../config/constants'

export interface ConnectedContext {
  account: Maybe<Account>
  setCurrentAccount: (account: Account) => void
  clearCurrentAccount: () => void
  tokenService: Maybe<TokenService>
  updateFlag: boolean
  setUpdateFlag: (flag: boolean) => void
  taquito: TezosToolkit
}

const taquito = new TezosToolkit()
taquito.setProvider({ ...baseConfig })

export const CONNECTED_CONTEXT_DEFAULT_VALUE = {
  account: null,
  setCurrentAccount: () => {},
  clearCurrentAccount: () => {},
  tokenService: null,
  updateFlag: false,
  setUpdateFlag: () => {},
  taquito,
}

const ConnectedContext = React.createContext<ConnectedContext>(CONNECTED_CONTEXT_DEFAULT_VALUE)

interface Props {
  children: React.ReactNode
}

export const ConnectedNetwork = (props: Props) => {
  const { account, setCurrentAccount, clearCurrentAccount } = useAccount()
  const taquito = useTaquito(account)
  const useUpdaterValue = useUpdater()
  const tokenService = useContracts(account, taquito)

  const value = {
    account,
    setCurrentAccount,
    clearCurrentAccount,
    ...useUpdaterValue,
    tokenService,
    taquito,
  }

  return <ConnectedContext.Provider value={value}>{props.children}</ConnectedContext.Provider>
}

export const useConnectedContext = (): ConnectedContext => {
  return React.useContext(ConnectedContext)
}
