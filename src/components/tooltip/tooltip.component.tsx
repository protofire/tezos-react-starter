import React, { HTMLAttributes } from 'react'
import ReactTooltip from 'react-tooltip'
import './tooltip.component.css'

import { IconInfo } from './img/iconInfo.component'
import { IconFuel } from './img/iconFuel.component'

export enum IconType {
  Fuel = 'Fuel',
  Info = 'Info',
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  id: string
  description: string
  iconType: IconType
}

export const Tooltip = (props: Props) => {
  const { id, description, iconType } = props

  return (
    <>
      <button
        className="icon"
        data-class="extraClass"
        data-tip
        data-for={id}
        data-multiline={true}
        data-html={true}
      >
        {iconType === IconType.Fuel && <IconFuel />}
        {iconType === IconType.Info && <IconInfo />}
      </button>
      <ReactTooltip id={id} effect="solid" delayHide={1000}>
        {description}
      </ReactTooltip>
    </>
  )
}
