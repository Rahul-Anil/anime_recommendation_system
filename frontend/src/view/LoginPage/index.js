import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import loginBack from "../../assets/image/loginBack.png";
import logo from "../../assets/logo/logo.png";
const theme = createTheme({
  typography: {
    fontFamily: "Mulish",
    h5: {
      fontWeight: 700,
      fontSize: "24px",
    },
    body2: {
      fontSize: "14px",
      fontWeight: 400,
    },
  },
});
const port = "http://localhost:8080";

export default function LoginPage() {
  const [token, setToken] = useState(0);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrormessage] = useState();

  const handleSubmit = (event) => {
    event.preventDefault();

    const usernameValue = document.getElementById("username").value;
    const passwordValue = document.getElementById("password").value;
    if (usernameValue === "" || passwordValue === "") {
      //alert("Username or keyword cannot be empty");
      setErrormessage("Username or keyword cannot be empty")
      return false;
    }
    // create login body and send
    const loginBody = { username: username, password: password };
    const data = {
      method: "POST",
      body: JSON.stringify(loginBody),
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(`${port}/login`, data).then((res) => {
      if (res.status === 200) {
        res.json().then((res) => {
          console.log("Logged in");
          // record the token for logged in user.
          setToken(res.token);
          console.log(res.token);
          sessionStorage.setItem("data", res.user_id);

          // switch to dashboard after logged in
          //*history.push('./dashboard');

          window.location.href = "/main";
        });
      } else {
        res.json().then((res) => {
          console.log(res.error);
          //alert(res.error);
          setErrormessage("Username or keyword not correct")
          return false;
        });
      }
    });
  };

  return (
    <ThemeProvider theme={theme}>
      {/* <CssBaseline /> */}
      <Grid container justifyContent="space-between">
        <Grid item md={5}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              px: 8,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "80vh",
                borderRadius: "6px",
                px: 4,
                border: "1px solid #E5E5E5",
              }}
            >
              <Avatar
                sx={{ m: 1, bgcolor: "secondary.main" }}
                src={logo}
              ></Avatar>
              <Typography component="h1" variant="h5" sx={{ color: "#E5E5E5" }}>
                アニメを探す
              </Typography>
              <Typography component="h1" variant="h5" sx={{ mt: 6 }}>
                Log In to アニメを探す
              </Typography>
              <Typography
                component="h1"
                variant="body2"
                sx={{ color: "#E5E5E5", mt: 4 }}
              >
                Enter your email and password below
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="User Name"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, bgcolor: "#3751FF", py: 2 }}
                >
                  Log In
                </Button>
                {errorMessage && <div className="error" style={{color: "red"}}> {errorMessage} </div>}
                {/* <Grid container>
                  <Grid item> */}
                {/* </Grid>
                </Grid> */}
              </Box>
              <Link href="/signup" variant="body2" sx={{ mt: 4 }}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Box>
          </Box>
        </Grid>
        <Grid item md={6}>
          <img
            src={loginBack}
            alt="loginback"
            style={{ height: "100vh", width: "100%" }}
          />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
