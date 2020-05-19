import React from 'react'

import { useAccount } from '../hooks/useAccount.hook'
import { useContracts } from '../hooks/useContracts.hook'
import { TokenService } from '../services/tokenContract.service'
import { Account } from '../utils/types'
import { useUpdater } from '../hooks/useUpdater.hook'

export interface ConnectedContext {
  account: Maybe<Account>
  setCurrentAccount: (account: Account) => void
  clearCurrentAccount: () => void
  tokenService: Maybe<TokenService>
  updateFlag: boolean
  setUpdateFlag: (flag: boolean) => void
}

export const CONNECTED_CONTEXT_DEFAULT_VALUE = {
  account: null,
  setCurrentAccount: () => {},
  clearCurrentAccount: () => {},
  tokenService: null,
  updateFlag: false,
  setUpdateFlag: () => {},
}

const ConnectedContext = React.createContext<ConnectedContext>(CONNECTED_CONTEXT_DEFAULT_VALUE)

interface Props {
  children: React.ReactNode
}

export const ConnectedNetwork = (props: Props) => {
  const useAccountValue = useAccount()
  const useUpdaterValue = useUpdater()
  const { tokenService } = useContracts(useAccountValue.account)

  const value = {
    ...useAccountValue,
    ...useUpdaterValue,
    tokenService,
  }

  return <ConnectedContext.Provider value={value}>{props.children}</ConnectedContext.Provider>
}

export const useConnectedContext = (): ConnectedContext => {
  return React.useContext(ConnectedContext)
}
