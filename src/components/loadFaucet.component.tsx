import React from 'react'
import { useToasts } from 'react-toast-notifications'

import { useConnectedContext } from '../state/connected.context'
import { activateAccount } from '../utils/tool'
import { Account } from '../utils/types'

export const LoadFaucet = () => {
  const { setCurrentAccount } = useConnectedContext()
  const { addToast } = useToasts()

  const fileInput = React.useRef<HTMLInputElement>(null)

  const handleClick = () => {
    if (null !== fileInput.current) {
      fileInput.current.click()
    }
  }

  const handleFileChange = (event: any) => {
    const reader = new FileReader()

    reader.onload = (event: any) => {
      const account = JSON.parse(event.target.result)

      // Activate account
      activateAccount(account as Account)

      // Set account state
      setCurrentAccount(account as Account)

      // Send notification
      addToast('Wallet load successfully', { appearance: 'success', autoDismiss: true })
    }

    reader.readAsText(event.target.files[0])
  }

  return (
    <>
      <div className="is-vertical-align">
        You can download a wallet from&nbsp;
        <a
          className="is-paddingless"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'underline' }}
          href="https://faucet.tzalpha.net/"
        >
          here
        </a>
      </div>
      <div className="button primary icon" onClick={handleClick} style={{ zIndex: 0 }}>
        Load wallet&nbsp;
        <img src="https://icongr.am/clarity/upload.svg?size=16&amp;color=ffffff" alt="icon" />
      </div>
      <input
        type="file"
        accept=".json,application/json"
        className="is-hidden"
        onChange={handleFileChange}
        ref={fileInput}
      />
    </>
  )
}
