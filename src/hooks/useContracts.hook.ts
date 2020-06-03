import { useEffect, useState } from 'react'
import { TezosToolkit } from '@taquito/taquito'

import { TokenService } from '../services/tokenContract.service'
import { Account } from '../utils/types'
import { TOKEN_CONTRACT_ADDRESS as tokenContractAddress } from '../config/constants'

export const useContracts = (account: Maybe<Account>, taquito: TezosToolkit) => {
  const [tokenService, setTokenService] = useState<Maybe<TokenService>>(null)

  useEffect(() => {
    const initializeContract = async () => {
      const tokenService = await TokenService.create(tokenContractAddress, taquito)
      setTokenService(tokenService)
    }

    initializeContract()
    // eslint-disable-next-line
  }, [account])

  return tokenService
}
