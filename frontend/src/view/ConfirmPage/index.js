import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

const theme = createTheme();

export default function ConfirmPage() {
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Yipeeee! Your Subscription has been confirmed.
          </Typography>
          <Typography component="h1" variant="h4" gutterBottom>
            Please check your mail for the invoice.
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Button 
                fullWidth 
                variant='contained' 
                sx={{ mt: 20, mb: 2 }}
                onClick={event =>  window.location.href='/main'}
              >
                Discover New Anime
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}