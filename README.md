[![Netlify Status](https://api.netlify.com/api/v1/badges/539778b8-47d4-458c-90b6-67085835a03e/deploy-status)](https://app.netlify.com/sites/tezos-starter/deploys)

# Tezos dApp React Starter Kit

[LIVE DEMO](https://tezos-starter.netlify.app/)

Download faucet from [here](https://faucet.tzalpha.net/) to use the dApp.

## Features

- All the [create react app](https://facebook.github.io/create-react-app) features
- Prettier configured
- Husky hooks for Linting and Prettier
- Example based on [taquito](https://github.com/ecadlabs/taquito)
- Connection to a wallet, previous download from [faucet](https://faucet.tzalpha.net/)
- Read and write a value in a Ligo Smart Contract FA 1.2

## Sections

#### Home
<img src="https://i.ibb.co/mvm2Pp8/Screenshot-20200519-150924.png" width="600">
 
#### Modal 
<img src="https://i.ibb.co/mcXsBD1/Screenshot-20200519-150954.png" width="600"> 

## State
- [Connected Context](https://github.com/protofire/tezos-starter/blob/master/src/state/connected.context.ts): Context that provides the connected account, and the service that communicates with the contract

## Hooks
- [useAccount](https://github.com/protofire/tezos-starter/blob/master/src/hooks/useAccount.hook.ts): Hook to get the connected account in the application
- [useAccountAllowance](https://github.com/protofire/tezos-starter/blob/master/src/hooks/useAccountAllowance.hook.ts): Hook to get the allowance of some address
- [useAccountBalance](https://github.com/protofire/tezos-starter/blob/master/src/hooks/useAccountBalance.hook.ts): Hook to get the balance of some address
- [useContracts](https://github.com/protofire/tezos-starter/blob/master/src/hooks/useContracts.hook.ts): Hook to get the available services in the application
- [useGasEstimation](https://github.com/protofire/tezos-starter/blob/master/src/hooks/useGasEstimation.hook.ts): Hook to get the gasEstimation of some method
- [useTokenInformation](https://github.com/protofire/tezos-starter/blob/master/src/hooks/useTokenInformation.hook.ts): Hook to get the token information of the FA 1.2 contract

## Services
- [Token Contract](https://github.com/protofire/tezos-starter/blob/master/src/services/tokenContract.service.ts): Service that communicates with the contract.

## Components
- [Account](https://github.com/protofire/tezos-starter/blob/master/src/components/account.component.tsx): display wallet information
- [AssetTezImage](https://github.com/protofire/tezos-starter/blob/master/src/components/assetTezImage.component.tsx): small tez logo
- [BetterCallDev](https://github.com/protofire/tezos-starter/blob/master/src/components/betterCallDev.component.tsx): renders a link with a transaction to [Better Call Dev](https://better-call.dev/)
- [GasEstimation](https://github.com/protofire/tezos-starter/blob/master/src/components/gasEstimation.component.tsx): an small icon with information regarding the transaction
- [LoadFaucet](https://github.com/protofire/tezos-starter/blob/master/src/components/loadFaucet.component.tsx): allows to import a wallet json file

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

- In this project `yarn start`

## Licensing
[MIT](https://github.com/protofire/tezos-starter/blob/master/LICENSE)