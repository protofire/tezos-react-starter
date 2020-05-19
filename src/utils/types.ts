import BigNumber from 'bignumber.js'

export interface Account {
  amount: string
  email: string
  mnemonic: Array<string>
  password: string
  pkh: string
  secret: string
}

export enum Action {
  Allow = 'Allow',
  Transfer = 'Transfer',
}

export interface UseTokenInformation {
  decimals: BigNumber
  symbol: string
  name: string
}
