[![Netlify Status](https://api.netlify.com/api/v1/badges/7bae9967-4525-4259-a36f-30b007f05085/deploy-status)](https://app.netlify.com/sites/tezos-react-starter/deploys)
# Tezos DApp React Starter Kit
Build React-based DApps in Tezos. Check out a <a href="https://tezos-react-starter.netlify.app/" target="_blank">demo</a>.

## How to start
- Download an [owner wallet](https://gist.github.com/mariano-aguero/808d4d64a89e8fd673b9cd3cce629214) that can mint tokens
- Download a [wallet](https://gist.github.com/mariano-aguero/c2e7d15f77ddc3f35df5e8b21efb5f31) with some tokens.

To use a DApp, you can always download wallets from [Tezos faucet](https://faucet.tzalpha.net/)). Note that the balance will be zero, and you will need to transfer some tokens as an [owner](https://gist.github.com/mariano-aguero/808d4d64a89e8fd673b9cd3cce629214) using the address|phk property of a JSON file.

## Features

- [Create React app](https://facebook.github.io/create-react-app)
- [Prettier](https://prettier.io/) configured
- [Husky](https://github.com/typicode/husky) hooks for Linting and Prettier-based code linting
- Examples based on [taquito](https://github.com/ecadlabs/taquito)
- Connection to a wallet previously downloaded from the [faucet](https://faucet.tzalpha.net/)
- Token transfer and amount limit configuration in a LIGO [FA1.2](https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-7/tzip-7.md) smart contract

## Sections

#### Home
<img src="https://i.ibb.co/mvm2Pp8/Screenshot-20200519-150924.png" width="600">
 
#### Modal 
<img src="https://i.ibb.co/mcXsBD1/Screenshot-20200519-150954.png" width="600"> 
 
#### Operations 
<img src="https://i.ibb.co/jwxxHBS/Screenshot-20200605-094111.png" width="600"> 

## State
- [Connected Context](https://github.com/protofire/tezos-react-starter/blob/master/src/state/connected.context.tsx) provides a connected account and a service that communicates with a contract


## Hooks
- [useAccount](https://github.com/protofire/tezos-react-starter/blob/master/src/hooks/useAccount.hook.ts) gets a connected account in an application
- [useAccountAllowance](https://github.com/protofire/tezos-react-starter/blob/master/src/hooks/useAccountAllowance.hook.ts) gets address allowance
- [useAccountBalance](https://github.com/protofire/tezos-react-starter/blob/master/src/hooks/useAccountBalance.hook.ts) gets an address balance
- [useContracts](https://github.com/protofire/tezos-react-starter/blob/master/src/hooks/useContracts.hook.ts) gets available services in an application
- [useGasEstimation](https://github.com/protofire/tezos-react-starter/blob/master/src/hooks/useGasEstimation.hook.ts) gets gasEstimation of a method defined in a contract
- [useTokenInformation](https://github.com/protofire/tezos-react-starter/blob/master/src/hooks/useTokenInformation.hook.ts) gets token information of a FA1.2 contract
- [useOperationProgress](https://github.com/protofire/tezos-react-starter/blob/master/src/hooks/useOperationProgress.hook.ts) get the progress of some transaction, is an estimate
- [useOperations](https://github.com/protofire/tezos-react-starter/blob/master/src/hooks/useOperations.hook.ts) gets available operations
- [useTaquito](https://github.com/protofire/tezos-react-starter/blob/master/src/hooks/useTaquito.hook.ts) gets taquito instance

## Services
- [Token Contract](https://github.com/protofire/tezos-react-starter/blob/master/src/services/tokenContract.service.ts) a service that communicates with the contract.

## Components
- [Account](https://github.com/protofire/tezos-react-starter/blob/master/src/components/account.component.tsx) display wallet information
- [AssetTezImage](https://github.com/protofire/tezos-react-starter/blob/master/src/components/assetTezImage.component.tsx) provides the Tezos logo
- [BetterCallDev](https://github.com/protofire/tezos-react-starter/blob/master/src/components/betterCallDev.component.tsx) renders a link with a transaction to [Better Call Dev](https://better-call.dev/)
- [GasEstimation](https://github.com/protofire/tezos-react-starter/blob/master/src/components/gasEstimation.component.tsx) provides an icon with information regarding the transaction
- [LoadFaucet](https://github.com/protofire/tezos-react-starter/blob/master/src/components/loadFaucet.component.tsx) allows for importing the wallet's JSON file
- [OperationProgress](https://github.com/protofire/tezos-react-starter/blob/master/src/components/operationProgress.component.tsx) progress bar related to some operation
- [Operations](https://github.com/protofire/tezos-react-starter/blob/master/src/components/operations.component.tsx) display all the operations related to the contract

## FA 1.2 Contract
You can access to the contract right [here](https://ide.ligolang.org/p/rUi98TfooS8_H_skgKj4wg)

## TODO:

- Add [TezBridge](https://www.tezbridge.com/)
- Add more UI Components

## Requirements

- yarn
  - Mac: `brew install yarn`
  - Linux:  https://classic.yarnpkg.com/en/docs/install/#debian-stable
  - Win: https://classic.yarnpkg.com/en/docs/install/#windows-stable

## Optional tool

- NVM (Node Version Manager)
  - Mac & Linux: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash` . For more info click [here](https://github.com/nvm-sh/nvm).
  - Win: https://github.com/coreybutler/nvm-windows

## Install
    yarn install

## Develop
- Rename the `.env.example` to `.env`
- Use `yarn start` in this project

## Licensing
[MIT](https://github.com/protofire/tezos-react-starter/blob/master/LICENSE)
