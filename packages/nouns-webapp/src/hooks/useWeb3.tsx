import React, { createContext, useContext, ReactElement, useState, useCallback, useMemo } from "react"
import Web3Modal from "web3modal"
import WalletConnectProvider from '@walletconnect/web3-provider'
import Fortmatic from 'fortmatic'
import config, { CHAIN_ID, FORTMATIC_KEY, INFURA_PROJECT_ID } from '../config'
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers"
import { IFrameEthereumProvider } from '@ledgerhq/iframe-provider'
import { ChainId, TransactionOptions } from '@usedapp/core';
import { Contract, providers } from "ethers"

const defaultMainnetProvider = new providers.StaticJsonRpcProvider(config.app.jsonRpcUri)

const customNetworkOptions = {
    rpcUrl: config.app.jsonRpcUri,
    chainId: CHAIN_ID
}

const modal = new Web3Modal({
    cacheProvider: true,
    providerOptions: {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                infuraId: INFURA_PROJECT_ID,
            }
        },
        fortmatic: {
            package: Fortmatic,
            options: {
                key: FORTMATIC_KEY,
                network: customNetworkOptions
            }
        }
    } 
})

export type Web3ContextData = {
    connect: () => Promise<Web3Provider>
    disconnect: () => Promise<void> 
    hasCachedProvider: () => boolean
    account: string
    provider: JsonRpcProvider
    web3Modal: Web3Modal
    chainId: number 
    providerInitialized: boolean
}

export const Web3Context = createContext<Web3ContextData>(undefined!)

export const useWeb3Context = (): Web3ContextData => {
    return useContext(Web3Context)
    // if (!web3Context) {
    //     throw new Error("useWeb3Context() can only be executed inside of <Web3ContextProvider />")
    // }
    
    // return web3Context
}

export const Web3ContextProvider = ({ children }: { children: ReactElement }) => {
    const [connected, setConnected] = useState(false)
    const [account, setAccount] = useState('')
    const [provider, setProvider] = useState<JsonRpcProvider>(defaultMainnetProvider)
    const [web3Modal, setWeb3Modal] = useState<Web3Modal>(modal)
    const [chainId, setChainId] = useState(CHAIN_ID)
    const [providerInitialized, setProviderInitialized] = useState(false)

    const hasCachedProvider = useCallback(() => {
        if (!web3Modal) return false 
        if (!web3Modal.cachedProvider) return false
        return true
    }, [web3Modal])

    const connect = useCallback(async () => {
        let rawProvider
        if (isIFrame()) {
            rawProvider = new IFrameEthereumProvider()
        } else {
            rawProvider = await web3Modal.connect()
        }

        setupEventListeners(rawProvider)

        const connectedProvider = new Web3Provider(rawProvider)
        setProvider(connectedProvider)
        const connectedAddress = await connectedProvider.getSigner().getAddress()
        setAccount(connectedAddress)
        const networkId = await provider.getNetwork().then(network => network.chainId)
        setChainId(networkId)
        setProviderInitialized(Object.values(ChainId).includes(networkId))

        setConnected(true)
        return connectedProvider
    }, [provider, web3Modal, connected])

    const disconnect = useCallback(async () => {
        console.log("Disconnecting...")
        web3Modal.clearCachedProvider()
        setConnected(false)
        window.location.reload()
    }, [provider, web3Modal, connected])

    const setupEventListeners = useCallback((rawProvider) => {
        if (!rawProvider.on) return

        rawProvider.on('accountsChanged', (accounts: string[]) => {

        })

        rawProvider.on('chainChanged', (chainID: number) => {
            if (!Object.values(ChainId).includes(chainID)) {
                // Chain not supported, disconnect/show error
                disconnect()
            }
        })
    }, [provider])

    const contextValue = useMemo(() => ({
        connect,
        disconnect,
        hasCachedProvider,
        account,
        provider,
        web3Modal,
        chainId,
        providerInitialized,
    }), [
        connect,
        disconnect,
        hasCachedProvider,
        account,
        provider,
        web3Modal,
        chainId,
        providerInitialized,
    ])

    return <Web3Context.Provider value={contextValue}>{children}</Web3Context.Provider>
}

export const useContractFunction = (contract: Contract, functionName: string) => {
    const { provider, chainId } = useWeb3Context()

}

const isIFrame = () => {
    return window.location !== window.parent.location
}

export const connectContractToSigner = (contract: Contract, provider?: JsonRpcProvider) => {
    if (contract.signer) {
        return contract
    }

    if (provider?.getSigner()) {
        return contract.connect(provider.getSigner())
    }

    throw new TypeError("No signer available in contract or provider")
}