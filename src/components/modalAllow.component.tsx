import React, { HTMLAttributes, useState } from 'react'
import { BigNumberInput } from 'big-number-input'
import BigNumber from 'bignumber.js'
import { useToasts } from 'react-toast-notifications'

import { ModalWrapper } from './modalWrapper.component'
import { GasEstimation } from './gasEstimation.component'
import { TokenService } from '../services/tokenContract.service'
import { Action, Account } from '../utils/types'
import { AllowMessage } from './messages.component'
import { isAddressValid, tokenAmountInUnitsWithSymbol } from '../utils/tool'
import { useAccountBalance } from '../hooks/useAccountBalance.hook'
import { useTokenInformation } from '../hooks/useTokenInformation.hook'
import { useAccountAllowance } from '../hooks/useAccountAllowance.hook'

interface Props extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  onClose: () => void
  tokenService: TokenService
  account: Account
  updateFlag: boolean
}

export const ModalAllow = (props: Props) => {
  const { onClose, isOpen, tokenService, account, updateFlag } = props

  const { addToast } = useToasts()

  const [amount, setAmount] = useState<Maybe<BigNumber>>(null)
  const [address, setAddress] = useState<string>('')
  const [loadingTransferTransaction, setLoadingTransferTransaction] = useState<boolean>(false)

  const tokenInformation = useTokenInformation(tokenService)
  const { allowance } = useAccountAllowance(account.pkh, address, tokenService)
  const { balance } = useAccountBalance(account, tokenService, updateFlag)

  const setMax = async () => {
    setAmount(balance)
  }

  const close = () => {
    setAmount(null)
    setAddress('')
    onClose()
  }

  const submit = async () => {
    if (!amount || !tokenInformation) return

    setLoadingTransferTransaction(true)

    let operation: any
    try {
      operation = await tokenService.allow(address, amount)
      await operation.confirmation()

      const content = (
        <AllowMessage
          hash={operation.hash}
          amount={amount}
          decimals={tokenInformation.decimals}
          symbol={tokenInformation.symbol}
        />
      )

      addToast(content, { appearance: 'success', autoDismiss: true })

      close()
    } catch (err) {
      // eslint-disable-next-line
      console.error(err.message)
      addToast(`There is an error allowing an amount.`, {
        appearance: 'error',
        autoDismiss: true,
      })
    }

    setLoadingTransferTransaction(false)
  }

  const hasAddressError = address ? !isAddressValid(address) : false

  const disableButtonSubmit =
    !amount ||
    (amount && amount.isZero()) ||
    !address ||
    (allowance && !allowance.isZero()) ||
    loadingTransferTransaction ||
    hasAddressError

  const disableButtonCancel = loadingTransferTransaction

  return (
    <ModalWrapper isOpen={isOpen} onRequestClose={close}>
      <div className="card">
        <header className="is-center">
          <h4>Allow</h4>
        </header>
        <div className="row" style={{ marginTop: '30px' }}>
          <input
            value={address}
            onChange={(e: any) => setAddress(e.target.value)}
            placeholder="Put an address"
          />
        </div>
        <div className={`${!hasAddressError ? 'is-hidden row is-left' : 'row is-left'}`}>
          <span className="text-error is-horizontal-align">Address not valid</span>
        </div>
        <div className={`row is-left}`}>
          <span className="text-grey is-horizontal-align">
            Allowance: &nbsp;{' '}
            {tokenInformation &&
              allowance &&
              tokenAmountInUnitsWithSymbol(
                allowance,
                tokenInformation.decimals,
                tokenInformation.symbol,
              )}
          </span>
        </div>
        <div className="row" style={{ marginTop: '30px' }}>
          <div className="is-center">
            <BigNumberInput
              decimals={(tokenInformation && tokenInformation.decimals.toNumber()) || 18}
              onChange={newValue =>
                newValue ? setAmount(new BigNumber(newValue)) : setAmount(null)
              }
              value={amount ? amount.toString() : ''}
              max={balance.toString()}
            />
            <button
              className="button primary"
              disabled={!account || !tokenInformation}
              onClick={setMax}
              style={{ marginLeft: '10px' }}
            >
              Max
            </button>
          </div>
        </div>
        <div className={`row is-left}`}>
          <span className="text-grey is-horizontal-align">
            Max amount allowed: &nbsp;{' '}
            {tokenInformation &&
              tokenAmountInUnitsWithSymbol(
                balance,
                tokenInformation.decimals,
                tokenInformation.symbol,
              )}
          </span>
        </div>
        <footer className="row is-right" style={{ marginTop: '30px' }}>
          <GasEstimation
            amount={amount}
            addressTo={address}
            action={Action.Allow}
            tokenService={tokenService}
          />
          <button
            className="button primary"
            disabled={disableButtonSubmit}
            onClick={submit}
            style={{ marginLeft: '1rem' }}
          >
            {account && !loadingTransferTransaction && Action.Allow}
            {!account && !loadingTransferTransaction && 'Please connect to your account'}
            {loadingTransferTransaction && 'Waiting...'}
          </button>
          <button disabled={disableButtonCancel} onClick={close} className="button">
            Cancel
          </button>
        </footer>
      </div>
    </ModalWrapper>
  )
}
