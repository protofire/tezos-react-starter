import React, { useEffect } from 'react'

import { Account } from '../utils/types'

interface UseAccountValue {
  account: Maybe<Account>
  setCurrentAccount: (account: Account) => void
  clearCurrentAccount: () => void
}

const itemNameStorage = 'account'

export const useAccount = (): UseAccountValue => {
  const [account, setAccount] = React.useState<Maybe<Account>>(null)

  useEffect(() => {
    const initializeAccount = async () => {
      try {
        const item = window.localStorage.getItem(itemNameStorage)
        const account = item ? JSON.parse(item) : null
        setAccount(account)
      } catch (error) {
        setAccount(null)
      }
    }

    initializeAccount()
  }, [])

  const setCurrentAccount = React.useCallback((account: Account): void => {
    setAccount(account)
    window.localStorage.setItem(itemNameStorage, JSON.stringify(account))
  }, [])

  const clearCurrentAccount = () => {
    localStorage.removeItem(itemNameStorage)
  }

  return {
    account,
    setCurrentAccount,
    clearCurrentAccount,
  }
}
