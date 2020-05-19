import React, { useState } from 'react'

import './toggleButton.component.css'

interface Props {
  id: string
  text: Array<string>
  name: string
  onChange?: () => void
  small?: boolean
  currentValue?: boolean
  disabled?: boolean
}

export const ToggleButton = (props: Props) => {
  const { id, text, name, onChange, small = false, currentValue = false, disabled = false } = props

  const [checked, setChecked] = useState<boolean>(currentValue)

  const onChangeToggle = (e: any) => {
    setChecked(e.target.checked)
    if (typeof onChange === 'function') onChange()
  }

  return (
    <div className={'toggle-switch' + (small ? ' small-switch' : '')}>
      <input
        id={id}
        name={name}
        type="checkbox"
        className="toggle-switch-checkbox"
        checked={checked}
        onChange={onChangeToggle}
        disabled={disabled}
      />
      <label className="toggle-switch-label" htmlFor={id}>
        <span
          className={
            disabled ? 'toggle-switch-inner toggle-switch-disabled' : 'toggle-switch-inner'
          }
          data-yes={text[0]}
          data-no={text[1]}
        />
        <span
          className={
            disabled ? 'toggle-switch-switch toggle-switch-disabled' : 'toggle-switch-switch'
          }
        />
      </label>
    </div>
  )
}
