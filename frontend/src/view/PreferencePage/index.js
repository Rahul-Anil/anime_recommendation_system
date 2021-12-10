import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { useHistory } from "react-router-dom";

const theme = createTheme();
const port = 'http://localhost:8080';

export default function BasicSelect() {
  const [genre1, setGenre1] = React.useState('');
  const [genre2, setGenre2] = React.useState('');
  const [genre3, setGenre3] = React.useState('');
  const [genre4, setGenre4] = React.useState('');
  const [genre5, setGenre5] = React.useState('');
  const [genre6, setGenre6] = React.useState('');
  const [genre7, setGenre7] = React.useState('');
  const [genre8, setGenre8] = React.useState('');
  const [genre9, setGenre9] = React.useState('');
  const [genre10, setGenre10] = React.useState('');

  const hist = useHistory();
  const [userDetails, setUserdetails] = useState({});

  const getUserById = async () => {
    try {
      let userId = sessionStorage.getItem('data');
      const user = await fetch("http://localhost:8080/user/" + userId.toString());
      //const userDetails = await user.json();
      setUserdetails(await user.json());
      console.log(userDetails);
      console.log(genre1)
      
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getUserById();
  }, []);

  const preferenceBody={
    "user_id": userDetails.user_id,
    "username": userDetails.username,
    "firstname":userDetails.firstname,
    "lastname":userDetails.lastname,
    "email": userDetails.email,
    "dob": userDetails.dob,
    "token": userDetails.token,
    "user_type": userDetails.user_type,
    "password": userDetails.userDetails,
    "preferred_genre": [`${genre1}`, `${genre2}`, `${genre3}`, `${genre4}`, `${genre5}`, `${genre6}`, `${genre7}`, `${genre8}`, `${genre9}`, `${genre10}`],
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    //simple duplicate alert
    if (genre1 == genre2 || genre1 == genre3 || genre1 == genre4 || genre1 == genre5 || genre1 == genre6 || genre1 == genre7 || genre1 == genre8 || genre1 == genre9|| genre1 == genre10 
      || genre2 == genre3 || genre2 == genre4 || genre2 == genre5 || genre2 == genre6 || genre2 == genre7 || genre2 == genre8 || genre2 == genre9|| genre2 == genre10 
      || genre3 == genre4 || genre3 == genre5 || genre3 == genre6 || genre3 == genre7 || genre3 == genre8 || genre3 == genre9 || genre3 == genre10
      || genre4 == genre5 || genre4 == genre6 || genre4 == genre7 || genre4 == genre8 || genre4 == genre9 || genre4 == genre10
      || genre5 == genre6 || genre5 == genre7 || genre5 == genre8 || genre5 == genre9 || genre5 == genre10
      || genre6 == genre7 || genre6 == genre8 || genre6 == genre9 || genre6 == genre10
      || genre7 == genre8 || genre7 == genre9 || genre7 == genre10
      || genre8 == genre9 || genre8 == genre10
      || genre9 == genre10){
      alert('Please avoid duplicate option')
      return false
    }
    if (genre1 == '' || genre2 == '' || genre3 == '' || genre4 == '' || genre5 == '' || genre6 == '' || genre7 == '' || genre8 == '' || genre9 == '' || genre10 == ''){
      alert('Please select 10 genres!')
      return false
    }
    //console.log(genrelist == '')
    // console.log(genre2)
    const data = {
      method: 'PUT',
      body: JSON.stringify(preferenceBody),
      headers: {
        'Content-Type': 'application/json'
      },
    }
    fetch(`${port}/user/${userDetails.user_id}`, data).then(res => res.json())
    .then(res => 
      console.log(res),
      //window.location.href='/subscription'
      hist.push("/subscription"),)
    .catch(err => console.log(err));
}

  

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
            Welcome to アニメを探す
          </Typography>
          <Typography component="h1" variant="h4" gutterBottom>
            Please select 10 genre to start the recommendation
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                <InputLabel id="Genre1">Genre</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={genre1}
                label="Genre1"
                onChange={e => setGenre1(e.target.value)}
                >
                  <MenuItem value={'action'}>action</MenuItem>
                  <MenuItem value={'adventure'}>adventure</MenuItem>
                  <MenuItem value={'cars'}>cars</MenuItem>
                  <MenuItem value={'comedy'}>comedy</MenuItem>
                  <MenuItem value={'dementia'}>dementia</MenuItem>
                  <MenuItem value={'demons'}>demons</MenuItem>
                  <MenuItem value={'drama'}>drama</MenuItem>
                  <MenuItem value={'ecchi'}>ecchi</MenuItem>
                  <MenuItem value={'fantasy'}>fantasy</MenuItem>
                  <MenuItem value={'game'}>game</MenuItem>
                  <MenuItem value={'harem'}>harem</MenuItem>
                  <MenuItem value={'hentai'}>hentai</MenuItem>
                  <MenuItem value={'historical'}>historical</MenuItem>
                  <MenuItem value={'horror'}>horror</MenuItem>
                  <MenuItem value={'josei'}>josei</MenuItem>
                  <MenuItem value={'kids'}>kids</MenuItem>
                  <MenuItem value={'magic'}>magic</MenuItem>
                  <MenuItem value={'martialarts'}>martialarts</MenuItem>
                  <MenuItem value={'mecha'}>mecha</MenuItem>
                  <MenuItem value={'military'}>military</MenuItem>
                  <MenuItem value={'music'}>music</MenuItem>
                  <MenuItem value={'mystery'}>mystery</MenuItem>
                  <MenuItem value={'parody'}>parody</MenuItem>
                  <MenuItem value={'police'}>police</MenuItem>
                  <MenuItem value={'psychological'}>psychological</MenuItem>
                  <MenuItem value={'romance'}>romance</MenuItem>
                  <MenuItem value={'samurai'}>samurai</MenuItem>
                  <MenuItem value={'school'}>school</MenuItem>
                  <MenuItem value={'sci-fi'}>sci-fi</MenuItem>
                  <MenuItem value={'seinen'}>seinen</MenuItem>
                  <MenuItem value={'shoujo'}>shoujo</MenuItem>
                  <MenuItem value={'shoujoai'}>shoujoai</MenuItem>
                  <MenuItem value={'shounen'}>shounen</MenuItem>
                  <MenuItem value={'shounenai'}>shounenai</MenuItem>
                  <MenuItem value={'sliceoflife'}>sliceoflife</MenuItem>
                  <MenuItem value={'space'}>space</MenuItem>
                  <MenuItem value={'sports'}>sports</MenuItem>
                  <MenuItem value={'supernatural'}>supernatural</MenuItem>
                  <MenuItem value={'superpower'}>superpower</MenuItem>
                  <MenuItem value={'thriller'}>thriller</MenuItem>
                  <MenuItem value={'unknown_genre'}>unknown_genre</MenuItem>
                  <MenuItem value={'vampire'}>vampire</MenuItem>
                  <MenuItem value={'yaoi'}>yaoi</MenuItem>
                  <MenuItem value={'yuri'}>yuri</MenuItem>
                </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                <InputLabel id="Genre2">Genre</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={genre2}
                label="Genre2"
                onChange={e => setGenre2(e.target.value)}
                >
                  <MenuItem value={'action'}>action</MenuItem>
                  <MenuItem value={'adventure'}>adventure</MenuItem>
                  <MenuItem value={'cars'}>cars</MenuItem>
                  <MenuItem value={'comedy'}>comedy</MenuItem>
                  <MenuItem value={'dementia'}>dementia</MenuItem>
                  <MenuItem value={'demons'}>demons</MenuItem>
                  <MenuItem value={'drama'}>drama</MenuItem>
                  <MenuItem value={'ecchi'}>ecchi</MenuItem>
                  <MenuItem value={'fantasy'}>fantasy</MenuItem>
                  <MenuItem value={'game'}>game</MenuItem>
                  <MenuItem value={'harem'}>harem</MenuItem>
                  <MenuItem value={'hentai'}>hentai</MenuItem>
                  <MenuItem value={'historical'}>historical</MenuItem>
                  <MenuItem value={'horror'}>horror</MenuItem>
                  <MenuItem value={'josei'}>josei</MenuItem>
                  <MenuItem value={'kids'}>kids</MenuItem>
                  <MenuItem value={'magic'}>magic</MenuItem>
                  <MenuItem value={'martialarts'}>martialarts</MenuItem>
                  <MenuItem value={'mecha'}>mecha</MenuItem>
                  <MenuItem value={'military'}>military</MenuItem>
                  <MenuItem value={'music'}>music</MenuItem>
                  <MenuItem value={'mystery'}>mystery</MenuItem>
                  <MenuItem value={'parody'}>parody</MenuItem>
                  <MenuItem value={'police'}>police</MenuItem>
                  <MenuItem value={'psychological'}>psychological</MenuItem>
                  <MenuItem value={'romance'}>romance</MenuItem>
                  <MenuItem value={'samurai'}>samurai</MenuItem>
                  <MenuItem value={'school'}>school</MenuItem>
                  <MenuItem value={'sci-fi'}>sci-fi</MenuItem>
                  <MenuItem value={'seinen'}>seinen</MenuItem>
                  <MenuItem value={'shoujo'}>shoujo</MenuItem>
                  <MenuItem value={'shoujoai'}>shoujoai</MenuItem>
                  <MenuItem value={'shounen'}>shounen</MenuItem>
                  <MenuItem value={'shounenai'}>shounenai</MenuItem>
                  <MenuItem value={'sliceoflife'}>sliceoflife</MenuItem>
                  <MenuItem value={'space'}>space</MenuItem>
                  <MenuItem value={'sports'}>sports</MenuItem>
                  <MenuItem value={'supernatural'}>supernatural</MenuItem>
                  <MenuItem value={'superpower'}>superpower</MenuItem>
                  <MenuItem value={'thriller'}>thriller</MenuItem>
                  <MenuItem value={'unknown_genre'}>unknown_genre</MenuItem>
                  <MenuItem value={'vampire'}>vampire</MenuItem>
                  <MenuItem value={'yaoi'}>yaoi</MenuItem>
                  <MenuItem value={'yuri'}>yuri</MenuItem>
                </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                <InputLabel id="Genre3">Genre</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={genre3}
                label="Genre3"
                onChange={e => setGenre3(e.target.value)}
                >
                  <MenuItem value={'action'}>action</MenuItem>
                  <MenuItem value={'adventure'}>adventure</MenuItem>
                  <MenuItem value={'cars'}>cars</MenuItem>
                  <MenuItem value={'comedy'}>comedy</MenuItem>
                  <MenuItem value={'dementia'}>dementia</MenuItem>
                  <MenuItem value={'demons'}>demons</MenuItem>
                  <MenuItem value={'drama'}>drama</MenuItem>
                  <MenuItem value={'ecchi'}>ecchi</MenuItem>
                  <MenuItem value={'fantasy'}>fantasy</MenuItem>
                  <MenuItem value={'game'}>game</MenuItem>
                  <MenuItem value={'harem'}>harem</MenuItem>
                  <MenuItem value={'hentai'}>hentai</MenuItem>
                  <MenuItem value={'historical'}>historical</MenuItem>
                  <MenuItem value={'horror'}>horror</MenuItem>
                  <MenuItem value={'josei'}>josei</MenuItem>
                  <MenuItem value={'kids'}>kids</MenuItem>
                  <MenuItem value={'magic'}>magic</MenuItem>
                  <MenuItem value={'martialarts'}>martialarts</MenuItem>
                  <MenuItem value={'mecha'}>mecha</MenuItem>
                  <MenuItem value={'military'}>military</MenuItem>
                  <MenuItem value={'music'}>music</MenuItem>
                  <MenuItem value={'mystery'}>mystery</MenuItem>
                  <MenuItem value={'parody'}>parody</MenuItem>
                  <MenuItem value={'police'}>police</MenuItem>
                  <MenuItem value={'psychological'}>psychological</MenuItem>
                  <MenuItem value={'romance'}>romance</MenuItem>
                  <MenuItem value={'samurai'}>samurai</MenuItem>
                  <MenuItem value={'school'}>school</MenuItem>
                  <MenuItem value={'sci-fi'}>sci-fi</MenuItem>
                  <MenuItem value={'seinen'}>seinen</MenuItem>
                  <MenuItem value={'shoujo'}>shoujo</MenuItem>
                  <MenuItem value={'shoujoai'}>shoujoai</MenuItem>
                  <MenuItem value={'shounen'}>shounen</MenuItem>
                  <MenuItem value={'shounenai'}>shounenai</MenuItem>
                  <MenuItem value={'sliceoflife'}>sliceoflife</MenuItem>
                  <MenuItem value={'space'}>space</MenuItem>
                  <MenuItem value={'sports'}>sports</MenuItem>
                  <MenuItem value={'supernatural'}>supernatural</MenuItem>
                  <MenuItem value={'superpower'}>superpower</MenuItem>
                  <MenuItem value={'thriller'}>thriller</MenuItem>
                  <MenuItem value={'unknown_genre'}>unknown_genre</MenuItem>
                  <MenuItem value={'vampire'}>vampire</MenuItem>
                  <MenuItem value={'yaoi'}>yaoi</MenuItem>
                  <MenuItem value={'yuri'}>yuri</MenuItem>
                </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                <InputLabel id="Genre4">Genre</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={genre4}
                label="Genre4"
                onChange={e => setGenre4(e.target.value)}
                >
                  <MenuItem value={'action'}>action</MenuItem>
                  <MenuItem value={'adventure'}>adventure</MenuItem>
                  <MenuItem value={'cars'}>cars</MenuItem>
                  <MenuItem value={'comedy'}>comedy</MenuItem>
                  <MenuItem value={'dementia'}>dementia</MenuItem>
                  <MenuItem value={'demons'}>demons</MenuItem>
                  <MenuItem value={'drama'}>drama</MenuItem>
                  <MenuItem value={'ecchi'}>ecchi</MenuItem>
                  <MenuItem value={'fantasy'}>fantasy</MenuItem>
                  <MenuItem value={'game'}>game</MenuItem>
                  <MenuItem value={'harem'}>harem</MenuItem>
                  <MenuItem value={'hentai'}>hentai</MenuItem>
                  <MenuItem value={'historical'}>historical</MenuItem>
                  <MenuItem value={'horror'}>horror</MenuItem>
                  <MenuItem value={'josei'}>josei</MenuItem>
                  <MenuItem value={'kids'}>kids</MenuItem>
                  <MenuItem value={'magic'}>magic</MenuItem>
                  <MenuItem value={'martialarts'}>martialarts</MenuItem>
                  <MenuItem value={'mecha'}>mecha</MenuItem>
                  <MenuItem value={'military'}>military</MenuItem>
                  <MenuItem value={'music'}>music</MenuItem>
                  <MenuItem value={'mystery'}>mystery</MenuItem>
                  <MenuItem value={'parody'}>parody</MenuItem>
                  <MenuItem value={'police'}>police</MenuItem>
                  <MenuItem value={'psychological'}>psychological</MenuItem>
                  <MenuItem value={'romance'}>romance</MenuItem>
                  <MenuItem value={'samurai'}>samurai</MenuItem>
                  <MenuItem value={'school'}>school</MenuItem>
                  <MenuItem value={'sci-fi'}>sci-fi</MenuItem>
                  <MenuItem value={'seinen'}>seinen</MenuItem>
                  <MenuItem value={'shoujo'}>shoujo</MenuItem>
                  <MenuItem value={'shoujoai'}>shoujoai</MenuItem>
                  <MenuItem value={'shounen'}>shounen</MenuItem>
                  <MenuItem value={'shounenai'}>shounenai</MenuItem>
                  <MenuItem value={'sliceoflife'}>sliceoflife</MenuItem>
                  <MenuItem value={'space'}>space</MenuItem>
                  <MenuItem value={'sports'}>sports</MenuItem>
                  <MenuItem value={'supernatural'}>supernatural</MenuItem>
                  <MenuItem value={'superpower'}>superpower</MenuItem>
                  <MenuItem value={'thriller'}>thriller</MenuItem>
                  <MenuItem value={'unknown_genre'}>unknown_genre</MenuItem>
                  <MenuItem value={'vampire'}>vampire</MenuItem>
                  <MenuItem value={'yaoi'}>yaoi</MenuItem>
                  <MenuItem value={'yuri'}>yuri</MenuItem>
                </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                <InputLabel id="Genre5">Genre</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={genre5}
                label="Genre5"
                onChange={e => setGenre5(e.target.value)}
                >
                  <MenuItem value={'action'}>action</MenuItem>
                  <MenuItem value={'adventure'}>adventure</MenuItem>
                  <MenuItem value={'cars'}>cars</MenuItem>
                  <MenuItem value={'comedy'}>comedy</MenuItem>
                  <MenuItem value={'dementia'}>dementia</MenuItem>
                  <MenuItem value={'demons'}>demons</MenuItem>
                  <MenuItem value={'drama'}>drama</MenuItem>
                  <MenuItem value={'ecchi'}>ecchi</MenuItem>
                  <MenuItem value={'fantasy'}>fantasy</MenuItem>
                  <MenuItem value={'game'}>game</MenuItem>
                  <MenuItem value={'harem'}>harem</MenuItem>
                  <MenuItem value={'hentai'}>hentai</MenuItem>
                  <MenuItem value={'historical'}>historical</MenuItem>
                  <MenuItem value={'horror'}>horror</MenuItem>
                  <MenuItem value={'josei'}>josei</MenuItem>
                  <MenuItem value={'kids'}>kids</MenuItem>
                  <MenuItem value={'magic'}>magic</MenuItem>
                  <MenuItem value={'martialarts'}>martialarts</MenuItem>
                  <MenuItem value={'mecha'}>mecha</MenuItem>
                  <MenuItem value={'military'}>military</MenuItem>
                  <MenuItem value={'music'}>music</MenuItem>
                  <MenuItem value={'mystery'}>mystery</MenuItem>
                  <MenuItem value={'parody'}>parody</MenuItem>
                  <MenuItem value={'police'}>police</MenuItem>
                  <MenuItem value={'psychological'}>psychological</MenuItem>
                  <MenuItem value={'romance'}>romance</MenuItem>
                  <MenuItem value={'samurai'}>samurai</MenuItem>
                  <MenuItem value={'school'}>school</MenuItem>
                  <MenuItem value={'sci-fi'}>sci-fi</MenuItem>
                  <MenuItem value={'seinen'}>seinen</MenuItem>
                  <MenuItem value={'shoujo'}>shoujo</MenuItem>
                  <MenuItem value={'shoujoai'}>shoujoai</MenuItem>
                  <MenuItem value={'shounen'}>shounen</MenuItem>
                  <MenuItem value={'shounenai'}>shounenai</MenuItem>
                  <MenuItem value={'sliceoflife'}>sliceoflife</MenuItem>
                  <MenuItem value={'space'}>space</MenuItem>
                  <MenuItem value={'sports'}>sports</MenuItem>
                  <MenuItem value={'supernatural'}>supernatural</MenuItem>
                  <MenuItem value={'superpower'}>superpower</MenuItem>
                  <MenuItem value={'thriller'}>thriller</MenuItem>
                  <MenuItem value={'unknown_genre'}>unknown_genre</MenuItem>
                  <MenuItem value={'vampire'}>vampire</MenuItem>
                  <MenuItem value={'yaoi'}>yaoi</MenuItem>
                  <MenuItem value={'yuri'}>yuri</MenuItem>
                </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                <InputLabel id="Genre6">Genre</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={genre6}
                label="Genre6"
                onChange={e => setGenre6(e.target.value)}
                >
                  <MenuItem value={'action'}>action</MenuItem>
                  <MenuItem value={'adventure'}>adventure</MenuItem>
                  <MenuItem value={'cars'}>cars</MenuItem>
                  <MenuItem value={'comedy'}>comedy</MenuItem>
                  <MenuItem value={'dementia'}>dementia</MenuItem>
                  <MenuItem value={'demons'}>demons</MenuItem>
                  <MenuItem value={'drama'}>drama</MenuItem>
                  <MenuItem value={'ecchi'}>ecchi</MenuItem>
                  <MenuItem value={'fantasy'}>fantasy</MenuItem>
                  <MenuItem value={'game'}>game</MenuItem>
                  <MenuItem value={'harem'}>harem</MenuItem>
                  <MenuItem value={'hentai'}>hentai</MenuItem>
                  <MenuItem value={'historical'}>historical</MenuItem>
                  <MenuItem value={'horror'}>horror</MenuItem>
                  <MenuItem value={'josei'}>josei</MenuItem>
                  <MenuItem value={'kids'}>kids</MenuItem>
                  <MenuItem value={'magic'}>magic</MenuItem>
                  <MenuItem value={'martialarts'}>martialarts</MenuItem>
                  <MenuItem value={'mecha'}>mecha</MenuItem>
                  <MenuItem value={'military'}>military</MenuItem>
                  <MenuItem value={'music'}>music</MenuItem>
                  <MenuItem value={'mystery'}>mystery</MenuItem>
                  <MenuItem value={'parody'}>parody</MenuItem>
                  <MenuItem value={'police'}>police</MenuItem>
                  <MenuItem value={'psychological'}>psychological</MenuItem>
                  <MenuItem value={'romance'}>romance</MenuItem>
                  <MenuItem value={'samurai'}>samurai</MenuItem>
                  <MenuItem value={'school'}>school</MenuItem>
                  <MenuItem value={'sci-fi'}>sci-fi</MenuItem>
                  <MenuItem value={'seinen'}>seinen</MenuItem>
                  <MenuItem value={'shoujo'}>shoujo</MenuItem>
                  <MenuItem value={'shoujoai'}>shoujoai</MenuItem>
                  <MenuItem value={'shounen'}>shounen</MenuItem>
                  <MenuItem value={'shounenai'}>shounenai</MenuItem>
                  <MenuItem value={'sliceoflife'}>sliceoflife</MenuItem>
                  <MenuItem value={'space'}>space</MenuItem>
                  <MenuItem value={'sports'}>sports</MenuItem>
                  <MenuItem value={'supernatural'}>supernatural</MenuItem>
                  <MenuItem value={'superpower'}>superpower</MenuItem>
                  <MenuItem value={'thriller'}>thriller</MenuItem>
                  <MenuItem value={'unknown_genre'}>unknown_genre</MenuItem>
                  <MenuItem value={'vampire'}>vampire</MenuItem>
                  <MenuItem value={'yaoi'}>yaoi</MenuItem>
                  <MenuItem value={'yuri'}>yuri</MenuItem>
                </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                <InputLabel id="Genre7">Genre</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={genre7}
                label="Genre7"
                onChange={e => setGenre7(e.target.value)}
                >
                  <MenuItem value={'action'}>action</MenuItem>
                  <MenuItem value={'adventure'}>adventure</MenuItem>
                  <MenuItem value={'cars'}>cars</MenuItem>
                  <MenuItem value={'comedy'}>comedy</MenuItem>
                  <MenuItem value={'dementia'}>dementia</MenuItem>
                  <MenuItem value={'demons'}>demons</MenuItem>
                  <MenuItem value={'drama'}>drama</MenuItem>
                  <MenuItem value={'ecchi'}>ecchi</MenuItem>
                  <MenuItem value={'fantasy'}>fantasy</MenuItem>
                  <MenuItem value={'game'}>game</MenuItem>
                  <MenuItem value={'harem'}>harem</MenuItem>
                  <MenuItem value={'hentai'}>hentai</MenuItem>
                  <MenuItem value={'historical'}>historical</MenuItem>
                  <MenuItem value={'horror'}>horror</MenuItem>
                  <MenuItem value={'josei'}>josei</MenuItem>
                  <MenuItem value={'kids'}>kids</MenuItem>
                  <MenuItem value={'magic'}>magic</MenuItem>
                  <MenuItem value={'martialarts'}>martialarts</MenuItem>
                  <MenuItem value={'mecha'}>mecha</MenuItem>
                  <MenuItem value={'military'}>military</MenuItem>
                  <MenuItem value={'music'}>music</MenuItem>
                  <MenuItem value={'mystery'}>mystery</MenuItem>
                  <MenuItem value={'parody'}>parody</MenuItem>
                  <MenuItem value={'police'}>police</MenuItem>
                  <MenuItem value={'psychological'}>psychological</MenuItem>
                  <MenuItem value={'romance'}>romance</MenuItem>
                  <MenuItem value={'samurai'}>samurai</MenuItem>
                  <MenuItem value={'school'}>school</MenuItem>
                  <MenuItem value={'sci-fi'}>sci-fi</MenuItem>
                  <MenuItem value={'seinen'}>seinen</MenuItem>
                  <MenuItem value={'shoujo'}>shoujo</MenuItem>
                  <MenuItem value={'shoujoai'}>shoujoai</MenuItem>
                  <MenuItem value={'shounen'}>shounen</MenuItem>
                  <MenuItem value={'shounenai'}>shounenai</MenuItem>
                  <MenuItem value={'sliceoflife'}>sliceoflife</MenuItem>
                  <MenuItem value={'space'}>space</MenuItem>
                  <MenuItem value={'sports'}>sports</MenuItem>
                  <MenuItem value={'supernatural'}>supernatural</MenuItem>
                  <MenuItem value={'superpower'}>superpower</MenuItem>
                  <MenuItem value={'thriller'}>thriller</MenuItem>
                  <MenuItem value={'unknown_genre'}>unknown_genre</MenuItem>
                  <MenuItem value={'vampire'}>vampire</MenuItem>
                  <MenuItem value={'yaoi'}>yaoi</MenuItem>
                  <MenuItem value={'yuri'}>yuri</MenuItem>
                </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                <InputLabel id="Genre8">Genre</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={genre8}
                label="Genre8"
                onChange={e => setGenre8(e.target.value)}
                >
                  <MenuItem value={'action'}>action</MenuItem>
                  <MenuItem value={'adventure'}>adventure</MenuItem>
                  <MenuItem value={'cars'}>cars</MenuItem>
                  <MenuItem value={'comedy'}>comedy</MenuItem>
                  <MenuItem value={'dementia'}>dementia</MenuItem>
                  <MenuItem value={'demons'}>demons</MenuItem>
                  <MenuItem value={'drama'}>drama</MenuItem>
                  <MenuItem value={'ecchi'}>ecchi</MenuItem>
                  <MenuItem value={'fantasy'}>fantasy</MenuItem>
                  <MenuItem value={'game'}>game</MenuItem>
                  <MenuItem value={'harem'}>harem</MenuItem>
                  <MenuItem value={'hentai'}>hentai</MenuItem>
                  <MenuItem value={'historical'}>historical</MenuItem>
                  <MenuItem value={'horror'}>horror</MenuItem>
                  <MenuItem value={'josei'}>josei</MenuItem>
                  <MenuItem value={'kids'}>kids</MenuItem>
                  <MenuItem value={'magic'}>magic</MenuItem>
                  <MenuItem value={'martialarts'}>martialarts</MenuItem>
                  <MenuItem value={'mecha'}>mecha</MenuItem>
                  <MenuItem value={'military'}>military</MenuItem>
                  <MenuItem value={'music'}>music</MenuItem>
                  <MenuItem value={'mystery'}>mystery</MenuItem>
                  <MenuItem value={'parody'}>parody</MenuItem>
                  <MenuItem value={'police'}>police</MenuItem>
                  <MenuItem value={'psychological'}>psychological</MenuItem>
                  <MenuItem value={'romance'}>romance</MenuItem>
                  <MenuItem value={'samurai'}>samurai</MenuItem>
                  <MenuItem value={'school'}>school</MenuItem>
                  <MenuItem value={'sci-fi'}>sci-fi</MenuItem>
                  <MenuItem value={'seinen'}>seinen</MenuItem>
                  <MenuItem value={'shoujo'}>shoujo</MenuItem>
                  <MenuItem value={'shoujoai'}>shoujoai</MenuItem>
                  <MenuItem value={'shounen'}>shounen</MenuItem>
                  <MenuItem value={'shounenai'}>shounenai</MenuItem>
                  <MenuItem value={'sliceoflife'}>sliceoflife</MenuItem>
                  <MenuItem value={'space'}>space</MenuItem>
                  <MenuItem value={'sports'}>sports</MenuItem>
                  <MenuItem value={'supernatural'}>supernatural</MenuItem>
                  <MenuItem value={'superpower'}>superpower</MenuItem>
                  <MenuItem value={'thriller'}>thriller</MenuItem>
                  <MenuItem value={'unknown_genre'}>unknown_genre</MenuItem>
                  <MenuItem value={'vampire'}>vampire</MenuItem>
                  <MenuItem value={'yaoi'}>yaoi</MenuItem>
                  <MenuItem value={'yuri'}>yuri</MenuItem>
                </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                <InputLabel id="Genre9">Genre</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={genre9}
                label="Genre9"
                onChange={e => setGenre9(e.target.value)}
                >
                  <MenuItem value={'action'}>action</MenuItem>
                  <MenuItem value={'adventure'}>adventure</MenuItem>
                  <MenuItem value={'cars'}>cars</MenuItem>
                  <MenuItem value={'comedy'}>comedy</MenuItem>
                  <MenuItem value={'dementia'}>dementia</MenuItem>
                  <MenuItem value={'demons'}>demons</MenuItem>
                  <MenuItem value={'drama'}>drama</MenuItem>
                  <MenuItem value={'ecchi'}>ecchi</MenuItem>
                  <MenuItem value={'fantasy'}>fantasy</MenuItem>
                  <MenuItem value={'game'}>game</MenuItem>
                  <MenuItem value={'harem'}>harem</MenuItem>
                  <MenuItem value={'hentai'}>hentai</MenuItem>
                  <MenuItem value={'historical'}>historical</MenuItem>
                  <MenuItem value={'horror'}>horror</MenuItem>
                  <MenuItem value={'josei'}>josei</MenuItem>
                  <MenuItem value={'kids'}>kids</MenuItem>
                  <MenuItem value={'magic'}>magic</MenuItem>
                  <MenuItem value={'martialarts'}>martialarts</MenuItem>
                  <MenuItem value={'mecha'}>mecha</MenuItem>
                  <MenuItem value={'military'}>military</MenuItem>
                  <MenuItem value={'music'}>music</MenuItem>
                  <MenuItem value={'mystery'}>mystery</MenuItem>
                  <MenuItem value={'parody'}>parody</MenuItem>
                  <MenuItem value={'police'}>police</MenuItem>
                  <MenuItem value={'psychological'}>psychological</MenuItem>
                  <MenuItem value={'romance'}>romance</MenuItem>
                  <MenuItem value={'samurai'}>samurai</MenuItem>
                  <MenuItem value={'school'}>school</MenuItem>
                  <MenuItem value={'sci-fi'}>sci-fi</MenuItem>
                  <MenuItem value={'seinen'}>seinen</MenuItem>
                  <MenuItem value={'shoujo'}>shoujo</MenuItem>
                  <MenuItem value={'shoujoai'}>shoujoai</MenuItem>
                  <MenuItem value={'shounen'}>shounen</MenuItem>
                  <MenuItem value={'shounenai'}>shounenai</MenuItem>
                  <MenuItem value={'sliceoflife'}>sliceoflife</MenuItem>
                  <MenuItem value={'space'}>space</MenuItem>
                  <MenuItem value={'sports'}>sports</MenuItem>
                  <MenuItem value={'supernatural'}>supernatural</MenuItem>
                  <MenuItem value={'superpower'}>superpower</MenuItem>
                  <MenuItem value={'thriller'}>thriller</MenuItem>
                  <MenuItem value={'unknown_genre'}>unknown_genre</MenuItem>
                  <MenuItem value={'vampire'}>vampire</MenuItem>
                  <MenuItem value={'yaoi'}>yaoi</MenuItem>
                  <MenuItem value={'yuri'}>yuri</MenuItem>
                </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                <InputLabel id="Genre10">Genre</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={genre10}
                label="Genre10"
                onChange={e => setGenre10(e.target.value)}
                >
                  <MenuItem value={'action'}>action</MenuItem>
                  <MenuItem value={'adventure'}>adventure</MenuItem>
                  <MenuItem value={'cars'}>cars</MenuItem>
                  <MenuItem value={'comedy'}>comedy</MenuItem>
                  <MenuItem value={'dementia'}>dementia</MenuItem>
                  <MenuItem value={'demons'}>demons</MenuItem>
                  <MenuItem value={'drama'}>drama</MenuItem>
                  <MenuItem value={'ecchi'}>ecchi</MenuItem>
                  <MenuItem value={'fantasy'}>fantasy</MenuItem>
                  <MenuItem value={'game'}>game</MenuItem>
                  <MenuItem value={'harem'}>harem</MenuItem>
                  <MenuItem value={'hentai'}>hentai</MenuItem>
                  <MenuItem value={'historical'}>historical</MenuItem>
                  <MenuItem value={'horror'}>horror</MenuItem>
                  <MenuItem value={'josei'}>josei</MenuItem>
                  <MenuItem value={'kids'}>kids</MenuItem>
                  <MenuItem value={'magic'}>magic</MenuItem>
                  <MenuItem value={'martialarts'}>martialarts</MenuItem>
                  <MenuItem value={'mecha'}>mecha</MenuItem>
                  <MenuItem value={'military'}>military</MenuItem>
                  <MenuItem value={'music'}>music</MenuItem>
                  <MenuItem value={'mystery'}>mystery</MenuItem>
                  <MenuItem value={'parody'}>parody</MenuItem>
                  <MenuItem value={'police'}>police</MenuItem>
                  <MenuItem value={'psychological'}>psychological</MenuItem>
                  <MenuItem value={'romance'}>romance</MenuItem>
                  <MenuItem value={'samurai'}>samurai</MenuItem>
                  <MenuItem value={'school'}>school</MenuItem>
                  <MenuItem value={'sci-fi'}>sci-fi</MenuItem>
                  <MenuItem value={'seinen'}>seinen</MenuItem>
                  <MenuItem value={'shoujo'}>shoujo</MenuItem>
                  <MenuItem value={'shoujoai'}>shoujoai</MenuItem>
                  <MenuItem value={'shounen'}>shounen</MenuItem>
                  <MenuItem value={'shounenai'}>shounenai</MenuItem>
                  <MenuItem value={'sliceoflife'}>sliceoflife</MenuItem>
                  <MenuItem value={'space'}>space</MenuItem>
                  <MenuItem value={'sports'}>sports</MenuItem>
                  <MenuItem value={'supernatural'}>supernatural</MenuItem>
                  <MenuItem value={'superpower'}>superpower</MenuItem>
                  <MenuItem value={'thriller'}>thriller</MenuItem>
                  <MenuItem value={'unknown_genre'}>unknown_genre</MenuItem>
                  <MenuItem value={'vampire'}>vampire</MenuItem>
                  <MenuItem value={'yaoi'}>yaoi</MenuItem>
                  <MenuItem value={'yuri'}>yuri</MenuItem>
                </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button 
                fullWidth 
                variant='contained' 
                sx={{ mt: 10, mb: 2 }}
                onClick={handleSubmit}
              >
                Next
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>

  );
}