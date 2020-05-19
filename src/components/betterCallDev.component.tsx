import React from 'react'

export const BetterCallDevTransaction = ({ title, hash }: { title: string; hash: string }) => {
  const url = `https://better-call.dev/carthage/${hash}`

  return (
    <strong>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {title}
      </a>
    </strong>
  )
}
