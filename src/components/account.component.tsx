import React from 'react'

import { useConnectedContext } from '../state/connected.context'
import { truncateStringInTheMiddle } from '../utils/tool'

export const Account = () => {
  const { account, clearCurrentAccount } = useConnectedContext()

  if (!account) {
    return null
  }

  const handleClick = () => {
    window.location.reload(false)
    clearCurrentAccount()
  }

  return (
    <>
      <div className="is-vertical-align" title={account.pkh}>
        {truncateStringInTheMiddle(account.pkh, 6, 4)}&nbsp;|
      </div>
      <div className="button primary icon" style={{ zIndex: 0 }} onClick={handleClick}>
        Disconnect&nbsp;
        <img src="https://icongr.am/clarity/disconnect.svg?size=16&amp;color=ffffff" alt="icon" />
      </div>
    </>
  )
}
