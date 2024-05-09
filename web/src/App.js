import React, { useMemo, useState } from 'react';
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

import './App.css';
import 'firebaseui/dist/firebaseui.css'

function App({ firebaseApp, firebaseUI}) {
  const [user, setUser] = useState();

  const handleLogout = () => {
    getAuth().signOut().then(() => {
      setUser(null);
    });
  };
  
  onAuthStateChanged(getAuth(firebaseApp), user => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      setUser(user);
    } else {
      setUser(undefined);
      if (firebaseUI) {
        firebaseUI.start('#firebaseui-auth-container', uiConfig);
      }
    }
  });

  const uiConfig = useMemo(() => ({
    callbacks: {
      signInSuccessWithAuthResult: (authResult, redirectUrl) => {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        return true;
      },
      uiShown: () => !user,
    },
  
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: '/',
    signInOptions: [
      GoogleAuthProvider.PROVIDER_ID,
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
  }), [user]);

  const loggedIn = useMemo(() => !!user, [user]);

  const profileMenu = useMemo(() => {
    return (
      <PopupState variant="popover" popupId="demo-popup-menu">
        {(popupState) => (
          <React.Fragment>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              {...bindTrigger(popupState)}
            >
              <AccountCircle />
            </IconButton>
            <Menu {...bindMenu(popupState)}>
              <MenuItem onClick={() => {
                handleLogout();
                popupState.close();
              }}>
                Logout
              </MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </PopupState>
    );
  }, []);

  const mainScreen = useMemo(() => {
    return (
      <Button variant='contained'>Take a test</Button>
    );
  }, []);

  const loginScreen = useMemo(() => {
    return (
      <div id="firebaseui-auth-container"></div>
    );
  }, []);

  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={10}>
          <Grid item xs={12}>
            <AppBar position="static">
              <Toolbar>
                {loggedIn && <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  {loggedIn ? 'TOEFL APP' : 'Welcome'}
                </Typography>
                {loggedIn && profileMenu}
              </Toolbar>
            </AppBar>
          </Grid>
          <Grid item xs={12}>
            {loggedIn ? mainScreen : loginScreen}
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default App;
