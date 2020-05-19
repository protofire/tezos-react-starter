import React, { useState } from 'react'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import BigNumber from 'bignumber.js'
import { useToasts } from 'react-toast-notifications'

import { TokenService } from '../services/tokenContract.service'
import { useConnectedContext } from '../state/connected.context'
import { useTokenOwnership } from '../hooks/useTokenOwnership.hook'
import { Account } from '../utils/types'
import { ModalAllow } from './modalAllow.component'
import { ModalTransfer } from './modalTransfer.component'
import { useTokenInformation } from '../hooks/useTokenInformation.hook'
import { MintMessage } from './messages.component'
import { unitsInTokenAmount } from '../utils/tool'
import { useAccountBalance } from '../hooks/useAccountBalance.hook'

const ContractActionsConnected = ({
  account,
  tokenService,
  updateFlag,
  setUpdateFlag,
}: {
  account: Maybe<Account>
  tokenService: TokenService
  updateFlag: boolean
  setUpdateFlag: (flag: boolean) => void
}) => {
  const { addToast } = useToasts()

  const isOwner = useTokenOwnership(account, tokenService)
  const tokenInformation = useTokenInformation(tokenService)
  const { balance } = useAccountBalance(account, tokenService, updateFlag)

  const [isModalAllowOpen, setModalAllowOpen] = useState(false)
  const [isModalTransferOpen, setModalTransferOpen] = useState(false)
  const [isMintTransaction, setMintTransaction] = useState(false)

  const mintTokens = async () => {
    if (!tokenInformation) return
    setMintTransaction(true)
    try {
      const amount = new BigNumber(5)
      const amountInUnits = unitsInTokenAmount(amount, tokenInformation.decimals)

      const operation = await tokenService.mint(amountInUnits.toString())
      await operation.confirmation()

      const content = (
        <MintMessage
          hash={operation.hash}
          amount={amountInUnits}
          decimals={tokenInformation.decimals}
          symbol={tokenInformation.symbol}
        />
      )

      setUpdateFlag(!updateFlag)

      addToast(content, { appearance: 'success', autoDismiss: true })
    } catch (err) {
      // eslint-disable-next-line
      console.error(err.message)
      addToast(`There is an error minting some tokens.`, { appearance: 'error', autoDismiss: true })
    }
    setMintTransaction(false)
  }

  return (
    <div className="card bg-light" style={{ width: '300px', height: 'auto' }}>
      <header>
        <h4>My actions</h4>
      </header>
      <footer>
        <div className="row">
          <button
            disabled={!account || balance.isZero()}
            className="dark button"
            style={{ zIndex: 0 }}
            onClick={() => setModalAllowOpen(true)}
          >
            Allow
          </button>
        </div>
        <div className="row" style={{ marginTop: '12px' }}>
          <button
            disabled={!account || balance.isZero()}
            className="dark button"
            style={{ zIndex: 0 }}
            onClick={() => setModalTransferOpen(true)}
          >
            Transfer
          </button>
        </div>
        <div className="row" style={{ marginTop: '12px' }}>
          <button
            disabled={!isOwner || isMintTransaction}
            onClick={mintTokens}
            title="The user must be owner of the token contract"
            className="dark button"
            style={{ zIndex: 0 }}
          >
            {isMintTransaction ? 'Waiting...' : 'Give me 5 tokens'}
          </button>
        </div>
        {account && (
          <ModalAllow
            tokenService={tokenService}
            updateFlag={updateFlag}
            account={account}
            isOpen={isModalAllowOpen}
            onClose={() => {
              setModalAllowOpen(false)
              setUpdateFlag(!updateFlag)
            }}
          />
        )}
        {account && (
          <ModalTransfer
            tokenService={tokenService}
            updateFlag={updateFlag}
            account={account}
            isOpen={isModalTransferOpen}
            onClose={() => {
              setModalTransferOpen(false)
              setUpdateFlag(!updateFlag)
            }}
          />
        )}
      </footer>
    </div>
  )
}

const ContractActionsDisconnected = () => {
  return (
    <div className="card bg-light" style={{ width: '300px', height: 'auto' }}>
      <header>
        <h4>My actions</h4>
      </header>
      <footer>
        <div className="is-center">
          <Loader visible={true} type="ThreeDots" color="#14854f" height={80} width={80} />
        </div>
      </footer>
    </div>
  )
}

export const ContractActions = () => {
  const context = useConnectedContext()
  const { tokenService, account, updateFlag, setUpdateFlag } = context

  return (
    <>
      {tokenService ? (
        <ContractActionsConnected
          account={account}
          setUpdateFlag={setUpdateFlag}
          tokenService={tokenService}
          updateFlag={updateFlag}
        />
      ) : (
        <ContractActionsDisconnected />
      )}
    </>
  )
}
