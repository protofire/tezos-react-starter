import React from 'react'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import { useTokenInformation } from '../hooks/useTokenInformation.hook'
import { useAccountBalance } from '../hooks/useAccountBalance.hook'
import { useConnectedContext } from '../state/connected.context'
import { TokenService } from '../services/tokenContract.service'
import { tokenAmountInUnitsWithSymbol } from '../utils/tool'
import { Account } from '../utils/types'
import { useTokenOwnership } from '../hooks/useTokenOwnership.hook'

const ContractBalanceConnected = ({
  tokenService,
  account,
  updateFlag,
}: {
  tokenService: TokenService
  account: Maybe<Account>
  updateFlag: boolean
}) => {
  const { balance } = useAccountBalance(account, tokenService, updateFlag)
  const tokenInformation = useTokenInformation(tokenService)
  const isOwner = useTokenOwnership(account, tokenService)

  return (
    <div className="card bg-light" style={{ width: '300px', height: 'auto' }}>
      <header>
        <h4>My balance</h4>
      </header>
      <footer>
        <div className="row">
          <div className="col">User balance:</div>
          <div className="col is-right">
            {tokenInformation ? (
              tokenAmountInUnitsWithSymbol(
                balance,
                tokenInformation.decimals,
                tokenInformation.symbol,
              )
            ) : (
              <Loader visible={true} type="ThreeDots" color="#14854f" height={18} width={18} />
            )}
          </div>
        </div>
        <div className="row">
          <div className="col">Token name:</div>
          <div className="col is-right">
            {tokenInformation ? (
              tokenInformation.name
            ) : (
              <Loader visible={true} type="ThreeDots" color="#14854f" height={18} width={18} />
            )}
          </div>
        </div>
        <div className="row">
          <div className="col">Token symbol:</div>
          <div className="col is-right">
            {tokenInformation ? (
              tokenInformation.symbol
            ) : (
              <Loader visible={true} type="ThreeDots" color="#14854f" height={18} width={18} />
            )}
          </div>
        </div>
        <div className="row">
          <div className="col">Token decimals:</div>
          <div className="col is-right">
            {tokenInformation ? (
              tokenInformation.decimals.toNumber()
            ) : (
              <Loader visible={true} type="ThreeDots" color="#14854f" height={18} width={18} />
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-10">Can mint tokens?</div>
          <div className="col is-right">{isOwner ? 'Yes' : 'No'}</div>
        </div>
      </footer>
    </div>
  )
}

const ContractBalanceDisconnected = () => {
  return (
    <div className="card bg-light" style={{ width: '300px', height: 'auto' }}>
      <header>
        <h4>My balances</h4>
      </header>
      <footer>
        <div className="is-center">
          <Loader visible={true} type="ThreeDots" color="#14854f" height={80} width={80} />
        </div>
      </footer>
    </div>
  )
}

export const ContractBalance = () => {
  const context = useConnectedContext()
  const { tokenService, account, updateFlag } = context

  return (
    <>
      {tokenService ? (
        <ContractBalanceConnected
          tokenService={tokenService}
          account={account}
          updateFlag={updateFlag}
        />
      ) : (
        <ContractBalanceDisconnected />
      )}
    </>
  )
}
