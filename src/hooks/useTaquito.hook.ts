import { TezosToolkit } from '@taquito/taquito'
import { InMemorySigner } from '@taquito/signer'

import { Account } from '../utils/types'
import { baseConfig } from '../config/constants'

export const useTaquito = (account: Maybe<Account>): TezosToolkit => {
  const signer = account
    ? InMemorySigner.fromFundraiser(account.email, account.password, account.mnemonic.join(' '))
    : undefined

  const taquito = new TezosToolkit()
  taquito.setProvider({ ...baseConfig, signer })

  return taquito
}
