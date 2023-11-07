import {
  AppBar,
  Avatar,
  Button,
  Link,
  Toolbar,
  Typography
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import LoginModal from "../Login/Login";
import LogoutDialog from "../LogoutDialog/LogoutDialog";
import "./Navigation.css";
import WelcomePopup from "../WelcomePopup/WelcomePopup";

function Navigation() {
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [open, setOpen] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    axios
      .get('https://eventretrieval.one/api/v1/logout')
      .then((response) => {
        if (response.status === 200) {
          setUsername('');
          sessionStorage.removeItem("isLoggedIn")
          sessionStorage.removeItem("username");
          sessionStorage.removeItem("sessionId");
        } else {
          console.error('Login failed');
          alert('failed');
        }
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });

    setOpen(false);
  };


  const handleOpenLoginModal = () => {
    setOpenLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setOpenLoginModal(false);
  };



  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name[0]),
      },
      children: `${name[0]}`,
    };
  }

  function stringToColor(string) {
    if (string) {
      let hash = 0;
      let i;

      for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
      }

      let color = '#';

      for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;

        color += `00${value.toString(16)}`.slice(-2);
      }
      return color;
    }
    return;
  }


  return (
    <React.Fragment>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}`, backgroundColor: '#388087' }}
      >
        <Toolbar sx={{ flexWrap: "wrap" }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1, fontFamily: 'Valorax' }}>
            <a href="/home" style={{ textDecoration: 'none', color: '#FFFFFF' }}> AIO - Pending</a>
          </Typography>
          <nav>
            {username ? (
              <Link
                variant="button"
                color="#FFAE42 "
                sx={{ my: 1, mx: 1.5, fontFamily: 'Valorax' }}
              >
                Welcome {username}
              </Link>
            ) : null}
            <Link
              variant="button"
              color="#FFFFFF"
              href="/home"
              sx={{ my: 1, mx: 1.5, fontFamily: 'Valorax' }}
            >
              Home
            </Link>
            <Link
              variant="button"
              color="#FFFFFF"
              href="/about"
              sx={{ my: 1, mx: 1.5, fontFamily: 'Valorax' }}
            >
              About
            </Link>

            { username ? (
              <Button onClick={handleClickOpen} color="primary">
                <Avatar {...stringAvatar(username)} />
              </Button>
            ) : (
              <Button variant="contained" onClick={handleOpenLoginModal}>
                Login
              </Button>
            )}
            <LoginModal open={openLoginModal} onClose={handleCloseLoginModal} isLogin={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn} username={username} setUsername={setUsername} showWelcomePopup={showWelcomePopup} setShowWelcomePopup={setShowWelcomePopup} />
            <LogoutDialog open={open} handleClose={handleClose} handleLogout={handleLogout} />

            {showWelcomePopup && (
              <WelcomePopup
                username={username}
                onClose={() => setShowWelcomePopup(false)}
              />
            )}
          </nav>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}

export default Navigation;
