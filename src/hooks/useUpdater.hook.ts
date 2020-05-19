import React from 'react'

interface UpdaterProp {
  updateFlag: boolean
  setUpdateFlag: (flag: boolean) => void
}

export const useUpdater = (): UpdaterProp => {
  const [updateFlag, setUpdateFlag] = React.useState<boolean>(false)

  return {
    updateFlag,
    setUpdateFlag,
  }
}
