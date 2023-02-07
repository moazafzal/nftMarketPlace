import { AppBar, Box, IconButton, Link, Stack, SvgIcon } from '@mui/material'
import React, { useEffect } from 'react'
import { bgBlur } from '../mock/cssStyles'
import { Icon } from '@iconify/react';
import { StyledRoot, StyledToolbar } from '../mock/config'
import SearchBar from './SearchBar';
import AccountPopover from './AccountPopover';
import { ethers } from 'ethers';
// import HomeIcon from '@mui/icons-material/Home';
const Navbar = ({ onOpenNav, account, setAccount }) => {

  useEffect(() => {
    loadBlockChainData()
  }, [])
  const loadBlockChainData = async () => {
    const accounts = await window.ethereum.request({ 'method': 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    if (account) {
      setAccount(account)
    }
  }
  const connectHandler = async () => {
    const accounts = await window.ethereum.request({ 'method': 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)
  }
  return (
    <>

      <StyledRoot>
        <StyledToolbar>
          <IconButton
            onClick={onOpenNav}
            sx={{
              mr: 1,
              color: 'text.primary',
              display: { lg: 'none' },
            }}
          >
            <Box component={Icon} icon="eva:menu-2-fill" sx={{ width: 20, height: 20 }}></Box><SvgIcon><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></SvgIcon>

          </IconButton>

          <SearchBar />
          <Box sx={{ flexGrow: 1 }} />

          <Stack
            direction="row"
            alignItems="center"
            spacing={{
              xs: 0.5,
              sm: 1,
            }}
          >
            {/* <LanguagePopover /> */}
            {/* <NotificationsPopover /> */}
            {/* <Link href='/createNFT' sx={{paddingRight:1}} underline="hover">Create New NFT</Link>
          <Link href='/myNFT' sx={{paddingRight:1}} underline="hover">My NFT</Link> */}
            <Link href='/' sx={{ paddingRight: 1 }} underline="hover">
              <SvgIcon color='primary'>
                <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
              </SvgIcon>
            </Link>
            <AccountPopover account={account} />
          </Stack>
        </StyledToolbar>
      </StyledRoot>
    </>
  )
}

export default Navbar