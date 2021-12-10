import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Badge,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
  Typography,
  Chip,
  Button
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import logo from "../../assets/logo/logo.png";
import SearchIcon from "@mui/icons-material/Search";

import { useDispatch } from "react-redux";
import * as modalActions from "../../store/actions";

//const [movie,setMovie] = useState('');
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Logout, PersonAdd, Settings, WindowSharp } from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import { Filter } from "./Filter";
import { useSelector } from "react-redux";
import * as Actions from "../../store/actions";
import { Genre_const, Studio_const, year_const } from "./filter_constant";

const useStyles = makeStyles({
  root: {},
  userName: {
    marginLeft: "20px",
  },
  input: {
    background: "#EFF0F6",
  },
  textFiled: {
    [`& fieldset`]: {
      borderRadius: 14,
      border: "none",
      color: "black",
    },
  },
});
// const SearchText = styled(TextField)({
//   background: "#EFF0F6",
//   borderRadius: "30px",
//   "&.MuiOutlineInput notchedOutline": {
//     border: "none",
//   },
// });

export default function Topbar(props) {
  const hideRef = useRef(null);
  const hist = useHistory();
  const [headStatus, setHeadStatus] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  let genres = useSelector(({ genre }) => genre.genres);
  let year = useSelector(({ genre }) => genre.year);
  let studios = useSelector(({ genre }) => genre.studios);

  const [selectedName, setSelectedName] = useState("");

  let selectedFilters = [];
  let genresList = [];
  let studiosList = [];
  let selectedYear = 0;

  let selectedJSON = { genres: [], studios: [], year: 0 };

  if (genres.length !== 0) {
    for (const key in genres) {
      selectedJSON.genres.push(genres[key]);
    }
    genresList = selectedJSON.genres
  }

  if (studios.length !== 0) {
    for (const key in studios) {
      selectedJSON.studios.push(studios[key]);
    }
    studiosList = selectedJSON.studios
  }

  if (year !== 0) {
    selectedJSON.year = year;
    selectedYear = selectedJSON.year
  }

  if (year !== 0) {
    if (genres.length !== 0) {
      if (studios.length !== 0) {
        selectedFilters = (genresList.concat(studiosList)).concat(selectedYear);
      }
      else {
        selectedFilters = genresList.concat(selectedYear);
      }
    } else {
      if (studios.length !== 0) {
        selectedFilters = studiosList.concat(selectedYear);
      } else {
        selectedFilters.push(selectedYear);
      }
    }
  } else {
    if (genres.length !== 0) {
      if (studios.length !== 0) {
        selectedFilters = (genresList.concat(studiosList))
      }
      else {
        selectedFilters = genresList;
      }
    } else {
      selectedFilters = studiosList;
    }
  }

  const handleDelete = (chipToDelete) => () => {

    const index = selectedFilters.indexOf(chipToDelete);
    if (index > -1) {
      selectedFilters.splice(index, 1);
    }

    const genreIndex = genresList.indexOf(chipToDelete);
    if (genreIndex > -1) {
      genresList.splice(genreIndex, 1);
    }

    const studioIndex = studiosList.indexOf(chipToDelete);
    if (studioIndex > -1) {
      studiosList.splice(studioIndex, 1);
    }


    if (selectedYear === chipToDelete) {
      selectedYear = 0;
    }

    dispatch(Actions.selectGenre(genresList));
    dispatch(Actions.selectStudio(studiosList));
    dispatch(Actions.selectYear(selectedYear));
  }


const reset = (e) => {
  setMovies([]);
};

  let genreList = [];
  let studioList = [];
  let genreString = "";
  let studioString ="";

if (selectedFilters.length !== 0) {
  for (const filter of selectedFilters) {
    let name = Genre_const.filter(name => name === filter);
    if (name.length !== 0) {
      genreList.push(name[0]);
    }
  }
  genreString = genreList.toString();

  for (const filter of selectedFilters) {
    let name = Studio_const.filter(name => name === filter);
    if (name.length !== 0) {
      studioList.push(name[0]);
    }
  }
  studioString = studioList.toString();
}


  const [movies, setMovies] = useState([]);
  const [show, setShow] = useState(false);

  const searchMovie = async () => {
    setMovies([]);
    setShow(false);
    
    try {
      if (selectedName !== "") {
        let url ='';

        let anime_name = encodeURIComponent(selectedName);
        url = " http://localhost:8080/show?name=" + anime_name;

        let anime_genre = '';
        let anime_studio = '';
        let anime_year = 0;

      if (year !== 0) {
        anime_year = year;
        url = url + "&year=" + anime_year.toString();
      }

        if(genreString.length !== 0){
          anime_genre = encodeURIComponent(genreString);
          console.log(anime_genre);
          url = url + "&genre=" + anime_genre;
        }
        
        if(studioString.length !==0){
          anime_studio = encodeURIComponent(studioString);
          console.log(anime_studio);
          url = url + "&studio=" + anime_studio;
        }

        if (year !== 0 || genreString.length !== 0 || studioString.length !== 0) {
          url = url + "&order_by=anime_id&random_list=false&page=1&page_size=5";
          console.log(url);
        }
        else {
          url = url + "&order_by=anime_id&page=1&page_size=5";
          console.log(url);
        }

        const resp = await fetch(url);
        const movieList = await resp.json();
        let list = [];
        for (const [id, data] of movieList["results"].entries()) {
          list.push(data);
        }
        const urlList = [];
        let response = "";

      for (const movie of list) {
        let imageList = movie.image_list;
        const images = imageList
          .substring(1, imageList.length - 1)
          .replace(/'/g, "")
          .split(",");
        let fetchURL =
          "http://localhost:8080/show/" +
          movie["anime_id"].toString() + "/images/" +
          images[0].toString();
        response = await fetch(fetchURL);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        movie.link = url;
      }
      setMovies(list);
      setShow(true);
      genreList = [];
      studioList = [];
      genreString = "";
      studioString = "";
    } else if (year !== 0 || genreString.length !== 0 || studioString.length !== 0) {

      console.log(year, genreString, studioString);
      let url = '';
      url = " http://localhost:8080/show?";

      let anime_genre = '';
      let anime_studio = '';
      let anime_year = 0;

      if (year !== 0) {
        anime_year = year;
        url = url + "year=" + anime_year.toString();

        if (genreString.length !== 0) {
          anime_genre = encodeURIComponent(genreString);
          console.log(anime_genre);
          url = url + "&genre=" + anime_genre;
        }

        if (studioString.length !== 0) {
          anime_studio = encodeURIComponent(studioString);
          console.log(anime_studio);
          url = url + "&studio=" + anime_studio;
        }
      } else if (genreString.length !== 0) {
        anime_genre = encodeURIComponent(genreString);
        console.log(anime_genre);
        url = url + "genre=" + anime_genre;

        if (studioString.length !== 0) {
          anime_studio = encodeURIComponent(studioString);
          console.log(anime_studio);
          url = url + "&studio=" + anime_studio;
        }
      }
      else {
        if (studioString.length !== 0) {
          anime_studio = encodeURIComponent(studioString);
          console.log(anime_studio);
          url = url + "studio=" + anime_studio;
        }
      }

      url = url + "&order_by=anime_id&random_list=false&page=1&page_size=5";
      console.log(url);

      const resp = await fetch(url);
      const movieList = await resp.json();
      let list = [];
      for (const [id, data] of movieList["results"].entries()) {
        list.push(data);
      }
      const urlList = [];
      let response = "";

      for (const movie of list) {
        let imageList = movie.image_list;
        const images = imageList
          .substring(1, imageList.length - 1)
          .replace(/'/g, "")
          .split(",");
        let fetchURL =
          "http://localhost:8080/show/" +
          movie["anime_id"].toString() + "/images/" +
          images[0].toString();
        response = await fetch(fetchURL);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        movie.link = url;
      }
      setMovies(list);
      setShow(true);
      genreList = [];
      studioList = [];
      genreString = "";
      studioString = "";
    }
    else {
      setMovies([]);
      setShow(false);
    }
  } catch (err) {
    console.error(err.message);
  }
};

  useEffect(() => {
    searchMovie().then(setShow(false));
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    if (hist.location.pathname == "/userSetting") {
      setHeadStatus(() => true);
    } else {
      setHeadStatus(() => false);
    }
  }, [hist.location.pathname]);

  const classes = useStyles();

  const dispatch = useDispatch();
  const selectClick = (e) => {
    window.name = e.target.alt;
    dispatch(modalActions.openModal("iii"));
  };

  //userdetails
  const [user, setUser] = useState({});

  const getUserById = async () => {
    try {
      let userId = sessionStorage.getItem("data");
      const user = await fetch(
        "http://localhost:8080/user/" + userId.toString()
      );
      const userDetails = await user.json();
      console.log(userDetails);
      setUser(userDetails);
      sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getUserById();
  }, []);

  console.log(user["username"]);
  let admin = false;
  if (user["user_type"] === "admin") {
    admin = true;
  }
  return (
    <div style={{ paddingLeft: "40px", paddingRight: "40px", margin: "20px" }}>
      {headStatus ? (
        <div onClick={() => (window.location = "/main")}>
          <Grid container justifyContent="flex-start" alignItems="center">
            <img
              src={logo}
              alt="logo"
              width="50px"
              onClick={() => (window.location = "/main")}
              style={{ cursor: "pointer" }}
            />
            <Typography
              onClick={() => (window.location = "/main")}
              variant="h5"
              style={{
                color: "#A4A6B3",
                marginLeft: "20px",
                cursor: "pointer",
              }}
            >
              アニメを探す
            </Typography>
          </Grid>
        </div>
      ) : (
        <Grid
          container
          direction="row"
          justifyContent="space-around"
          alignItems="center"
        >
          <Grid item>
            <Grid container direction="row" alignItems="center">
              <img
                src={logo}
                alt="logo"
                width="50px"
                onClick={() => (window.location = "/main")}
                style={{ cursor: "pointer" }}
              />
              <Typography
                onClick={() => (window.location = "/main")}
                variant="h5"
                style={{
                  color: "#A4A6B3",
                  marginLeft: "20px",
                  cursor: "pointer",
                }}
              >
                アニメを探す
              </Typography>
            </Grid>
          </Grid>
          <Grid item md={5}>
            {hist.location.pathname != "/main" && (
              <TextField
                variant="outlined"
                className={classes.textFiled}
                style={{ width: "100%" }}
                placeholder="Search"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" style={{ zIndex: 1000 }}>
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  className: classes.input,
                }}
                onChange={(e) => searchMovie(e)}
              ></TextField>
            )}
          </Grid>
          <Grid item>
            <Grid container alignItems="center">
              <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
                <Badge
                  overlap="circular"
                  color="secondary"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent=" "
                >
                  <Avatar alt={user.username} />
                </Badge>
              </IconButton>
              <Typography variant="body1" style={{ marginLeft: "20px" }}>
                {user.username}
              </Typography>
            </Grid>
          </Grid>
          {hist.location.pathname === "/main" && (
            <>
              <Grid
                container
                justifyContent="space-evenly"
                alignItems="center"
                sx={{ mt: 6 }}
              >
                <Grid Item>
                  {" "}
                  <TextField
                    variant="outlined"
                    className={classes.textFiled}
                    style={{ width: "400px" }}
                    placeholder="Search"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          style={{ zIndex: 1000 }}
                        >
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      className: classes.input,
                    }}
                    onChange={(e) => setSelectedName(e.target.value)}
                  ></TextField>
                  
                </Grid>
                <Grid Item>
                  <Button variant="outlined" variant="contained" style={{ left: "-200px" }} onClick={searchMovie}>
                    Search
                  </Button>
                </Grid>
                <Grid Item>
                  <Filter />
                </Grid>
              </Grid>
              <br /><br />
              {selectedFilters ?
                (<Grid container justifyContent="center">
                  <br /><br />
                {selectedFilters.map((index, item) => (
                  <Chip label={index} sx={{ mx: 1, mt: 1 }} color='primary' onDelete={handleDelete(index)} />
                ))}

                </Grid>
                ) : <div><br /><br /></div>}
              <br /><br />
              
            </>
          )}
          {show
            ?
            <Grid container style={{ margin: "5px" }} justifyContent="space-around" alignItems="center">
              <br /><br />
              {movies.map((movie) => (
                <img
                  id="results"
                  ref={hideRef}
                  key={movie.anime_id}
                  src={movie.link}
                  alt={movie.anime_id}
                  onClick={(e) => selectClick(e)}
                />
              ))}
            </Grid> : null}

        </Grid>
      )}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              left: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        <MenuItem onClick={() => hist.push("/userSetting")}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          User Settings
        </MenuItem>
        {admin ? (
          <MenuItem onClick={() => (window.location.href = "/admin")}>
            <DashboardIcon />
            Admin Dashboard
          </MenuItem>
        ) : null}
        <MenuItem
          onClick={() => {
            sessionStorage.clear();
            window.location.href = "/";
          }}
        >
          <LogoutIcon />
          Log Out
        </MenuItem>
      </Menu>
    </div>
  );
}
