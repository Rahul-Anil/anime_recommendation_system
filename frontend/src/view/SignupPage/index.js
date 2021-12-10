import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
//import FormControlLabel from '@mui/material/FormControlLabel';
//import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from "../../assets/logo/logo.png";

const theme = createTheme();
const port = 'http://localhost:8080';

export default function SignupPage() {
  const [token, setToken] = useState(0);
  const [username, setUsername] = useState();
  const [firstname, setFirstname] = useState();

  const [lastname, setLastname] = useState();
  const [email, setEmail] = useState();
  const [dob, setDob] = useState();

  const [password, setPassword] = useState();
  const [errorMessage, setErrormessage] = useState();

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const usernameValue= document.getElementById('username').value
    const passwordValue= document.getElementById('password').value
    const confirmpasswordValue= document.getElementById('Confirm_password').value

    if (usernameValue === '' || passwordValue === '') {
      //alert('Username or keyword cannot be empty');
      setErrormessage('Username or keyword cannot be empty');
      return false;
    }
    if(passwordValue != confirmpasswordValue) {
      //alert('Plesae confirm your passwords');
      setErrormessage('Plesae confirm your passwords');
      return false;
    }

    //create sign up message
    const signupBody ={
      "username": username,
      "firstname":firstname,
      "lastname":lastname,
      "email": email,
      "dob": dob,
      "password": password,
    };
    const data = {
      method: 'POST',
      body: JSON.stringify(signupBody),
      headers: {
        'Content-Type': 'application/json'
      },
    }
    fetch(`${port}/signup`, data).then(res => {
      if (res.status === 200) {
        res.json().then(res => {
          // show success information
          //alert('Succeed! Enjoy your game')
          console.log('signed')
          //store the user id
          sessionStorage.setItem('data',res.user_id);
          // show log in page
          //history.push('./login');
          window.location.href='/preference'
        })
      }else {
        res.json().then(res => {
          console.log(res.error);
          //alert(res.error);
          setErrormessage('Cannot fetch from backend');
          return false;
        })
      }
    })
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}
          src={logo}>
            {/* <LockOutlinedIcon /> */}
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              
            <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="User Name"
                  name="username"
                  autoComplete="username"
                  onChange={e => setUsername(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="firstname"
                  label="First Name"
                  id="firstname"
                  autoComplete="firstname"
                  onChange={e => setFirstname(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="lastname"
                  label="Last Name"
                  id="lastname"
                  autoComplete="lastname"
                  onChange={e => setLastname(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={e => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="dob"
                  label="Date of Birth(YYYY-MM-DD)"
                  id="dob"
                  autoComplete="yyyy-mm-dd"
                  onChange={e => setDob(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={e => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="Confirm_password"
                  label="Confirm Your Password"
                  type="password"
                  id="Confirm_password"
                  autoComplete="Confirm_password"
                />
              </Grid>
              
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              
            >
              Next
            </Button>
            {errorMessage && <div className="error" style={{color: "red"}}> {errorMessage} </div>}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        
      </Container>
    </ThemeProvider>
  );
}