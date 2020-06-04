import React, { HTMLAttributes } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import BigNumber from 'bignumber.js'

import { UseTokenInformation } from '../utils/types'
import { tokenAmountInUnitsWithSymbol, truncateStringInTheMiddle } from '../utils/tool'
import { IconFail } from './iconFail.component'
import { IconSuccess } from './iconSuccess.component'
import { BetterCallDevTransaction } from './betterCallDev.component'

interface Props extends HTMLAttributes<HTMLDivElement> {
  operation: any
  tokenInformation: Maybe<UseTokenInformation>
  key: number
}

enum EntryPoint {
  Approve = 'approve',
  Transfer = 'transfer',
  Mint = 'mint',
}

const Transfer = (props: {
  entrypoint: EntryPoint
  from: string
  to: string
  amount: any
  dateHumanized: string
}) => {
  const { entrypoint, from, to, amount, dateHumanized } = props
  return (
    <>
      The address <em title={from}>{truncateStringInTheMiddle(from, 6, 4)}</em>{' '}
      <strong>{entrypoint}</strong> an amount of {amount} to the address{' '}
      <em title={to}>{truncateStringInTheMiddle(to, 6, 4)}</em>, {dateHumanized}.
    </>
  )
}

const Mint = (props: {
  entrypoint: EntryPoint
  from: string
  amount: any
  dateHumanized: string
}) => {
  const { entrypoint, from, amount, dateHumanized } = props

  return (
    <>
      The address <em title={from}>{truncateStringInTheMiddle(from, 6, 4)}</em>{' '}
      <strong>{entrypoint}</strong> an amount of {amount}, {dateHumanized}.
    </>
  )
}

const Approve = (props: {
  entrypoint: EntryPoint
  from: string
  to: string
  amount: any
  dateHumanized: string
}) => {
  const { entrypoint, from, to, amount, dateHumanized } = props

  return (
    <>
      The address <em title={from}>{truncateStringInTheMiddle(from, 6, 4)}</em>{' '}
      <strong>{entrypoint}</strong> an amount of {amount} to the address{' '}
      <em title={to}>{truncateStringInTheMiddle(to, 6, 4)}</em>, {dateHumanized}.
    </>
  )
}

export const OperationItem = (props: Props) => {
  const { operation, tokenInformation } = props
  const { entrypoint, timestamp, source, parameters, id, status, hash } = operation

  dayjs.extend(relativeTime)
  const dateHumanized = dayjs().to(dayjs(timestamp))

  return (
    <div className="row" key={id}>
      <div className="card is-full-width" style={{ marginBottom: '10px' }}>
        <div style={{ float: 'left', width: '50px' }}>
          {status === 'applied' ? <IconSuccess /> : <IconFail />}{' '}
        </div>
        <div style={{ display: 'inline-block', margin: '0 auto', width: '800px' }}>
          {entrypoint === EntryPoint.Approve && (
            <Approve
              entrypoint={entrypoint}
              from={source}
              to={parameters.children[0].value}
              amount={
                tokenInformation
                  ? tokenAmountInUnitsWithSymbol(
                      new BigNumber(parameters.children[1].value),
                      tokenInformation.decimals,
                      tokenInformation.symbol,
                    )
                  : 0
              }
              dateHumanized={dateHumanized}
            />
          )}
          {entrypoint === EntryPoint.Transfer && (
            <Transfer
              entrypoint={entrypoint}
              from={parameters.children[0].value}
              to={parameters.children[1].value}
              amount={
                tokenInformation
                  ? tokenAmountInUnitsWithSymbol(
                      new BigNumber(parameters.children[2].value),
                      tokenInformation.decimals,
                      tokenInformation.symbol,
                    )
                  : 0
              }
              dateHumanized={dateHumanized}
            />
          )}
          {entrypoint === EntryPoint.Mint && (
            <Mint
              entrypoint={entrypoint}
              from={source}
              amount={
                tokenInformation
                  ? tokenAmountInUnitsWithSymbol(
                      new BigNumber(parameters.value),
                      tokenInformation.decimals,
                      tokenInformation.symbol,
                    )
                  : 0
              }
              dateHumanized={dateHumanized}
            />
          )}
        </div>
        <div style={{ float: 'right', width: '145px' }}>
          <BetterCallDevTransaction title="See transaction" hash={hash} />
        </div>
      </div>
    </div>
  )
}
