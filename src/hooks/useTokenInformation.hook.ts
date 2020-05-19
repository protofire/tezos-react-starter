import { useEffect, useState } from 'react'

import { TokenService } from '../services/tokenContract.service'
import { UseTokenInformation } from '../utils/types'

export const useTokenInformation = (tokenService: TokenService): Maybe<UseTokenInformation> => {
  const [tokenInformation, setTokenInformation] = useState<Maybe<UseTokenInformation>>(null)

  useEffect(() => {
    const fetchTokenInformation = async () => {
      const tokenInformation = await tokenService.getInformation()
      setTokenInformation(tokenInformation)
    }
    fetchTokenInformation()
  }, [tokenService])

  return tokenInformation
}
