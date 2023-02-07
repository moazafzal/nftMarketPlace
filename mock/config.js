import { bgBlur } from '../mock/cssStyles';
import { AppBar, styled, Toolbar } from '@mui/material';
export const StyledRoot = styled(AppBar)(({ theme }) => ({
    ...bgBlur({ color: theme.palette.background.default }),
    boxShadow: 'none',
    [theme.breakpoints.up('lg')]: {
        width: `calc(100%)`,
    },
}));

export const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    minHeight: 64,
    [theme.breakpoints.up('lg')]: {
        minHeight: 92,
        padding: theme.spacing(0, 5),
    },
}));
export const StyledSearchbar = styled('div')(({ theme }) => ({
    ...bgBlur({ color: theme.palette.background.default }),
    top: 0,
    left: 0,
    zIndex: 99,
    width: '90%',
    display: 'flex',
    position: 'absolute',
    alignItems: 'center',
    height: 64,
    padding: theme.spacing(0, 3),
    [theme.breakpoints.up('md')]: {
        width:'97%',
        height: 92,
        padding: theme.spacing(0, 3),
    },
}));
export const Main = styled('div')(({ theme }) => ({
    flexGrow: 1,
    overflow: 'auto',
    minHeight: '100%',
    paddingTop: 64 + 24,//Mobile bar
    paddingBottom: theme.spacing(10),
    [theme.breakpoints.up('lg')]: {
      paddingTop: 92 + 24,//Desktop
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  }));