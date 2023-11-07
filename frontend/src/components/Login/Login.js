import { Grid, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const LoginModal = ({ open, onClose, isLogin, setIsLoggedIn, username, setUsername, showWelcomePopup, setShowWelcomePopup}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  useEffect(() => {
    const storedIsLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (storedIsLoggedIn === 'true') {
      setIsLoggedIn(true);
      const storedUsername = sessionStorage.getItem('username');
      setUsername(storedUsername || ''); 
    }
  }, [setIsLoggedIn, setUsername ]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    const formData = {
      username: email,
      password: password,
    };

    axios
      .post('https://eventretrieval.one/api/v1/login', formData)
      .then((response) => {
        if (response.status === 200) {
          console.log('res', response.data)
          setIsLoggedIn(true);
          setUsername(response.data.username);
          const sessionId = response.data.sessionId;
          sessionStorage.setItem('isLoggedIn', 'true');
          sessionStorage.setItem('username', email);
          sessionStorage.setItem('sessionId', sessionId);

          setShowWelcomePopup(true);
        } else {
          console.error('Login failed');
          alert('failed');
        }
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });

    // Close the modal
    onClose();
  };

  return (

    
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <h2>Login</h2>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                onChange={handleEmailChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={handlePasswordChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleLogin}
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>

    
  );
};

export default LoginModal;
