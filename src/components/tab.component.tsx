import React from 'react'

import { Action } from '../utils/types'

interface TabProps {
  callback?: () => any
  action: Action
  active: boolean
}

export const Tab = (props: TabProps) => {
  const { callback, action, active } = props

  const onClick = () => {
    if (callback) callback()
  }

  return (
    // eslint-disable-next-line
    <a style={{ cursor: 'pointer' }} onClick={onClick} className={`${active ? 'active' : ''}`}>
      {action}
    </a>
  )
}
