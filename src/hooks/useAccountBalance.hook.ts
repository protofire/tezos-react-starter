import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'

import { TokenService } from '../services/tokenContract.service'
import { Account } from '../utils/types'
import { getAddressFromAccount } from '../utils/tool'

interface UseAccountBalanceValue {
  balance: BigNumber
}

export const useAccountBalance = (
  account: Maybe<Account>,
  tokenService: TokenService,
  updateFlag: boolean,
): UseAccountBalanceValue => {
  const [balance, setBalance] = useState<BigNumber>(new BigNumber(0))

  useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        const address = await getAddressFromAccount(account)
        const balance = await tokenService.getBalance(address)
        setBalance(balance)
      }
    }
    fetchBalance()
  }, [account, tokenService, updateFlag])

  return {
    balance,
  }
}
