import React from 'react'
import BigNumber from 'bignumber.js'

import { BetterCallDevTransaction } from './betterCallDev.component'
import { tokenAmountInUnitsWithSymbol } from '../utils/tool'

export const AllowMessage = ({
  hash,
  amount,
  decimals,
  symbol,
}: {
  hash: string
  amount: BigNumber
  decimals: BigNumber
  symbol: string
}) => {
  return (
    <>
      <strong>Allow</strong>
      <div>
        Allow of {tokenAmountInUnitsWithSymbol(amount, decimals, symbol)} successfully. See
        transaction right <BetterCallDevTransaction title={'here'} hash={hash} />
      </div>
    </>
  )
}

export const TransferMessage = ({
  hash,
  amount,
  decimals,
  symbol,
}: {
  hash: string
  amount: BigNumber
  decimals: BigNumber
  symbol: string
}) => {
  return (
    <>
      <strong>Transfer</strong>
      <div>
        The transfer of {tokenAmountInUnitsWithSymbol(amount, decimals, symbol)} was successfully.
        See transaction right <BetterCallDevTransaction title={'here'} hash={hash} />
      </div>
    </>
  )
}

export const MintMessage = ({
  hash,
  amount,
  decimals,
  symbol,
}: {
  hash: string
  amount: BigNumber
  decimals: BigNumber
  symbol: string
}) => {
  return (
    <>
      <strong>Mint</strong>
      <div>
        The mint of {tokenAmountInUnitsWithSymbol(amount, decimals, symbol)} was successfully. See
        transaction right <BetterCallDevTransaction title={'here'} hash={hash} />
      </div>
    </>
  )
}
