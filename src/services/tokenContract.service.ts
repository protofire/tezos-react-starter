import { Tezos } from '@taquito/taquito'
import BigNumber from 'bignumber.js'
import { TezosToolkit } from '@taquito/taquito'

import { UseTokenInformation } from '../utils/types'
import { baseConfig } from '../config/constants'

class TokenService {
  contractAddress: string
  contract: any
  signer: any

  constructor(contractAddress: string, contract: any, signer: any) {
    this.contractAddress = contractAddress
    this.contract = contract
    this.signer = signer
  }

  static async create(contractAddress: string, taquito: TezosToolkit) {
    const contract = await taquito.contract.at(contractAddress)
    return new TokenService(contractAddress, contract, taquito.signer)
  }

  getStorage = async () => this.contract.storage()

  getAccounts = async (): Promise<any> => {
    const { accounts } = await this.getStorage()
    return accounts
  }

  getInformation = async (): Promise<UseTokenInformation> => {
    const storage = await this.getStorage()
    return {
      decimals: storage.decimals,
      symbol: storage.symbol as string,
      name: storage.name as string,
    }
  }

  getBalance = async (address: string): Promise<BigNumber> => {
    const accounts = await this.getAccounts()
    let balance = new BigNumber(0)
    try {
      const account = await accounts.get(address)
      balance = account.balance
    } catch (err) {
      // Do nothing
    }
    return balance
  }

  getAllowance = async (addressFrom: string, addressTo: string): Promise<BigNumber> => {
    const accounts = await this.getAccounts()
    let allowance = new BigNumber(0)
    try {
      const account = await accounts.get(addressFrom)
      const allowances = account.allowances
      allowance = (await allowances.get(addressTo)) || new BigNumber(0)
    } catch (err) {
      // Do nothing
    }
    return allowance
  }

  allow = async (address: string, amountToAllow: BigNumber) => {
    return this.contract.methods.approve(address, amountToAllow.toNumber()).send()
  }

  transfer = async (addressFrom: string, addressTo: string, amountToTransfer: BigNumber) => {
    return this.contract.methods
      .transfer(addressFrom, addressTo, amountToTransfer.toNumber())
      .send()
  }

  mint = async (amountToMint: BigNumber) => {
    return this.contract.methods.mint(amountToMint.toNumber()).send()
  }

  getGasEstimationForAllow = async (address: string, amountToAllow: BigNumber) => {
    const tx = this.contract.methods.approve(address, amountToAllow.toNumber()).toTransferParams()
    Tezos.setProvider({ ...baseConfig, signer: this.signer })
    return Tezos.estimate.transfer(tx)
  }

  getGasEstimationForTransfer = async (
    addressFrom: string,
    addressTo: string,
    amountToTransfer: BigNumber,
  ) => {
    const tx = this.contract.methods
      .transfer(addressFrom, addressTo, amountToTransfer.toNumber())
      .toTransferParams()
    Tezos.setProvider({ ...baseConfig, signer: this.signer })
    return Tezos.estimate.transfer(tx)
  }

  isOwner = async (address: string) => {
    const storage = await this.getStorage()
    const owners = storage.owners
    return owners.includes(address)
  }
}

export { TokenService }
