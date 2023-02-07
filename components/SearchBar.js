import React, { useState } from 'react'
// @mui
import { Input, Slide, Button, IconButton, InputAdornment, ClickAwayListener, Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { StyledSearchbar } from '../mock/config';
import { Icon } from '@iconify/react';

const SearchBar = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(!open);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <ClickAwayListener onClickAway={handleClose}>
            <div>
                {!open && (
                    <IconButton onClick={handleOpen}>
                        <Box component={Icon} icon="eva:search-fill" ></Box>
                    </IconButton>
                )}

                <Slide direction="down" in={open} mountOnEnter unmountOnExit>
                    <StyledSearchbar sx={{
                        boxShadow: 12,     
                }}
                    
                    >
                        <Input
                            autoFocus
                            fullWidth
                            disableUnderline
                            placeholder="Search…"
                            startAdornment={
                                <InputAdornment position="start">
                                    <Box component={Icon} icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }}></Box>

                                    {/* <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} /> */}
                                </InputAdornment>
                            }
                            sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
                        />
                        <Button variant="contained" onClick={handleClose}>
                            Search
                        </Button>
                    </StyledSearchbar>
                </Slide>
            </div>
        </ClickAwayListener>
    )
}

export default SearchBar