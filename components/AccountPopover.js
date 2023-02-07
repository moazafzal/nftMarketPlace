import React, { useState } from 'react'
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover, Link } from '@mui/material';


const AccountPopover = ({account}) => {
    const [open, setOpen] = useState(null);
    const [MENU_OPTIONS, setMENU_OPTIONS] = useState([
        {
            label: 'Home',
            icon: 'eva:home-fill',
            url:'/'
        },
        {
            label: 'My NFTs',
            icon: 'eva:person-fill',
            url:'/myNFT'
        },
        {
            label: 'Create New NFT',
            icon: 'eva:settings-2-fill',
            url:'/createNFT'
        }
    ])
    const [acount, setAcount] = useState({
        displayName: 'USER NAME',
        email: 'demo@minimals.cc',
        photoURL: '/assets/images/avatars/avatar_default.jpg',
    })
    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };
    return (
        <>
            {account &&<Box component="span" sx={{color:'black'}}>{account.slice(0,6)}....{account.slice(38,42)}</Box>}
            <IconButton
                onClick={handleOpen}
                sx={{
                    p: 0,
                    ...(open && {
                        '&:before': {
                            zIndex: 1,
                            content: "''",
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            position: 'absolute',
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),

                        },
                    }),
                }}
            >
                <Avatar src={acount.photoURL} alt="photoURL" />
            </IconButton>

            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        p: 0,
                        mt: 1.5,
                        ml: 0.75,
                        width: 180,
                        '& .MuiMenuItem-root': {
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}
            >
                <Box sx={{ my: 1.5, px: 2.5 }}>
                    <Typography variant="subtitle2" noWrap>
                        {acount.displayName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {acount.email}
                    </Typography>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Stack sx={{ p: 1 }}>
                    {MENU_OPTIONS.map((option) => (
                        <MenuItem key={option.label} onClick={handleClose}>
                            
                            <Link href={option.url} underline="none">{option.label}</Link>
                        </MenuItem>
                    ))}
                </Stack>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <MenuItem onClick={handleClose} sx={{ m: 1 }}>
                    Logout
                </MenuItem>
            </Popover>
            
        </>
    )
}

export default AccountPopover