import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'

import { TokenService } from '../services/tokenContract.service'

interface UseAccountAllowanceValue {
  allowance: BigNumber
}

export const useAccountAllowance = (
  addressFrom: string,
  addressTo: string,
  tokenService: TokenService,
): UseAccountAllowanceValue => {
  const [allowance, setAllowance] = useState<BigNumber>(new BigNumber(0))

  useEffect(() => {
    const fetchAllowance = async () => {
      const allowance = await tokenService.getAllowance(addressFrom, addressTo)
      setAllowance(allowance)
    }
    fetchAllowance()
  }, [addressFrom, addressTo, tokenService])

  return {
    allowance,
  }
}
