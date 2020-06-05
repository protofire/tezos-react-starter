export const TOKEN_CONTRACT_ADDRESS: string = process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS || ''
export const TEZOS_RPC: string = process.env.REACT_APP_TEZOS_RPC || ''
export const BAKING_BAD_API: string = process.env.REACT_APP_BCD_API || ''

export const baseConfig = {
  rpc: TEZOS_RPC,
  config: {
    confirmationPollingIntervalSecond: 2,
  },
}
