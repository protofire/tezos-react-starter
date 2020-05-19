import { Tezos } from '@taquito/taquito'
import { InMemorySigner } from '@taquito/signer'
import BigNumber from 'bignumber.js'
import { UseTokenInformation } from '../utils/types'

class TokenService {
  contractAddress: string
  rpc: string
  signer?: InMemorySigner

  constructor(contractAddress: string, rpc: string, signer?: InMemorySigner) {
    this.contractAddress = contractAddress
    this.rpc = rpc
    if (signer) this.signer = signer
  }

  getAccounts = async (): Promise<any> => {
    const { accounts } = await this.getStorage()
    return accounts
  }

  getStorage = async (): Promise<any> => {
    Tezos.setProvider({ rpc: this.rpc, signer: this.signer })
    const contract = await Tezos.contract.at(this.contractAddress)
    return contract.storage()
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
    const contract = await Tezos.contract.at(this.contractAddress)
    return contract.methods.approve(address, amountToAllow.toNumber()).send()
  }

  transfer = async (addressFrom: string, addressTo: string, amountToTransfer: BigNumber) => {
    const contractPool = await Tezos.contract.at(this.contractAddress)
    return contractPool.methods.transfer(addressFrom, addressTo, amountToTransfer.toNumber()).send()
  }

  mint = async (amount: string) => {
    const contractPool = await Tezos.contract.at(this.contractAddress)
    return contractPool.methods.mint(amount).send()
  }

  getGasEstimationForAllow = async (address: string, amountToAllow: BigNumber) => {
    const contractPool = await Tezos.contract.at(this.contractAddress)

    const tx = contractPool.methods.approve(address, amountToAllow.toNumber()).toTransferParams()
    return Tezos.estimate.transfer(tx)
  }

  getGasEstimationForTransfer = async (
    addressFrom: string,
    addressTo: string,
    amountToTransfer: BigNumber,
  ) => {
    const contractPool = await Tezos.contract.at(this.contractAddress)

    const tx = contractPool.methods
      .transfer(addressFrom, addressTo, amountToTransfer.toNumber())
      .toTransferParams()
    return Tezos.estimate.transfer(tx)
  }

  isOwner = async (address: string) => {
    const storage = await this.getStorage()
    const owners = storage.owners
    return owners.includes(address)
  }
}

export { TokenService }
