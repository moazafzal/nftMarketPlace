import Navbar from '../components/Navbar'
import '../styles/globals.css'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../mock/createEmotionCache';
import theme, { Main } from '../mock/config'
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import NFT from './abis/NFT.json'
import Marketplace from './abis/Marketplace.json'
import config from './config.json'

const clientSideEmotionCache = createEmotionCache();

export default function App({ Component, pageProps}) {
  const [open, setOpen] = useState(false);
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [marketPlace, setMarketPlace] = useState(null)
  const [nft, setNft] = useState(null)
  useEffect(() => {
    loadBlockChainData()
    loadAddress()
  },[])
  const loadAddress = async () => {
    const accounts = await window.ethereum.request({ 'method': 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)
    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ 'method': 'eth_requestAccounts' })
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)
    })
  }
  const loadBlockChainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork()
    const signer = provider.getSigner()
    
    const nft = new ethers.Contract(config[network.chainId].NFT.address, NFT, signer)
    const market = new ethers.Contract(config[network.chainId].Marketplace.address, Marketplace, signer)
    setNft(nft)
    setMarketPlace(market)
  }
  return <>
    
      <CssVarsProvider theme={theme}>
        {/* <CssBaseline /> */}
        <Navbar account={account} setAccount={setAccount} onOpenNav={() => setOpen(true)} />
        <Main>
          <Component  {...pageProps} nft={nft} marketPlace={marketPlace} setMarketPlace={setMarketPlace} setNft={setNft} setAccount={setAccount} account={account} />
        </Main>
      </CssVarsProvider>
    
  </>
}
