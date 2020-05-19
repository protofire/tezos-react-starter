import { useMemo } from 'react'
import { InMemorySigner } from '@taquito/signer'

import { TokenService } from '../services/tokenContract.service'
import { Account } from '../utils/types'
import {
  TOKEN_CONTRACT_ADDRESS as tokenContractAddress,
  TEZOS_RPC as rpc,
} from '../config/constants'

export const useContracts = (account: Maybe<Account>) => {
  const signer = account
    ? InMemorySigner.fromFundraiser(account.email, account.password, account.mnemonic.join(' '))
    : undefined

  const tokenService = useMemo(() => new TokenService(tokenContractAddress, rpc, signer), [signer])

  return useMemo(
    () => ({
      tokenService,
    }),
    [tokenService],
  )
}
