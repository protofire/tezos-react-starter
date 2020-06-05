import BigNumber from 'bignumber.js'
import { Tezos } from '@taquito/taquito'
import { InMemorySigner } from '@taquito/signer'
import { validateKeyHash, ValidationResult } from '@taquito/utils'

import { BAKING_BAD_API, TEZOS_RPC as rpc, TOKEN_CONTRACT_ADDRESS } from '../config/constants'
import { Account } from '../utils/types'

export const truncateStringInTheMiddle = (
  str: string,
  strPositionStart: number,
  strPositionEnd: number,
) => {
  const minTruncatedLength = strPositionStart + strPositionEnd
  if (minTruncatedLength < str.length) {
    return `${str.substr(0, strPositionStart)}...${str.substr(
      str.length - strPositionEnd,
      str.length,
    )}`
  }
  return str
}

export const tzFormatter = (amount: any, format: any) => {
  const bigNum = new BigNumber(amount)
  if (bigNum.isNaN()) {
    return amount
  }

  if (format === 'tz') {
    return `${Tezos.format('mutez', 'tz', amount)} ꜩ`
  } else if (format === 'mtz') {
    return `${Tezos.format('mutez', 'mtz', amount)} mꜩ`
  } else {
    return bigNum.toString()
  }
}

export const percentageFormatter = (amount: any) => {
  const bigNum = new BigNumber(amount)
  if (bigNum.isNaN()) {
    return amount
  }

  return `${bigNum.toFixed(4)} %`
}

export const activateAccount = async (account: Account) => {
  try {
    const { email, password, mnemonic, pkh, secret } = account
    const signer = InMemorySigner.fromFundraiser(email, password, mnemonic.join(' '))
    Tezos.setProvider({ rpc, signer })
    const operation = await Tezos.tz.activate(pkh, secret)
    await operation.confirmation()
  } catch (err) {
    // eslint-disable-next-line
    console.error(err.message)
  }
}

export const getAddressFromAccount = async (account: Account) => {
  const { email, password, mnemonic } = account
  const signer = InMemorySigner.fromFundraiser(email, password, mnemonic.join(' '))
  return await signer.publicKeyHash()
}

export const tokenAmountInUnitsToBigNumber = (amount: BigNumber, decimals: BigNumber) => {
  const decimalsPerToken = new BigNumber(10).pow(decimals)
  return amount.dividedBy(decimalsPerToken)
}

export const tokenAmountInUnits = (amount: BigNumber, decimals: BigNumber, toFixedDecimals = 2) => {
  return tokenAmountInUnitsToBigNumber(amount, decimals).toFixed(toFixedDecimals)
}

export const unitsInTokenAmount = (units: any, decimals: BigNumber) => {
  const decimalsPerToken = new BigNumber(10).pow(decimals)
  return new BigNumber(units).multipliedBy(decimalsPerToken)
}

export const tokenAmountInUnitsWithSymbol = (units: any, decimals: BigNumber, symbol: string) => {
  return `${tokenAmountInUnits(units, decimals)} ${symbol.toLowerCase()}`
}

export const isAddressValid = (address: string): boolean =>
  validateKeyHash(address) === ValidationResult.VALID

export const fetchOperations = async (
  lastIdParam: number,
  limit: number,
): Promise<{ operations: any[]; lastId: number }> => {
  let callUntil = true
  let totalOperations: any[] = []

  while (callUntil) {
    let url = `${BAKING_BAD_API}contract/carthagenet/${TOKEN_CONTRACT_ADDRESS}/operations`
    if (lastIdParam > 0) {
      url = `${BAKING_BAD_API}contract/carthagenet/${TOKEN_CONTRACT_ADDRESS}/operations?last_id=${lastIdParam}`
    }

    const response = await fetch(url)
    const { operations, last_id: lastId } = await response.json()

    // Filter only this actions
    const operationsFiltered = operations.filter((operation: any) =>
      ['transfer', 'mint', 'allow'].includes(operation.entrypoint),
    )
    if (operationsFiltered.length > 0) {
      totalOperations = [...totalOperations, ...operationsFiltered]
    }

    callUntil = operations.length > 0 && lastId && totalOperations.length < limit
    lastIdParam = lastId
  }

  return {
    operations: totalOperations,
    lastId: lastIdParam,
  }
}
