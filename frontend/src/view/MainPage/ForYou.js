import React, { useEffect, useState } from "react";
import { Button, Grid, IconButton, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CustomCard from "../../component/CustomCard";
import middleImage from "../../assets/image/Green_Middle_Card.png";
import * as modalActions from "../../store/actions";
import { useDispatch } from "react-redux";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { ChartPart } from "./ChartPart";
import Carousel from "react-elastic-carousel";

const useStyles = makeStyles({
  root: {
    marginTop: "80px",
  },
  images: {
    marginTop: "80px",
    position: "relative",
  },
  rightArrow: {
    position: "absolute",
    top: "120px",
    right: "-10px",
  },
  leftArrow: {
    position: "absolute",
    top: "120px",
    left: "-10px",
  },
  recentContent: {
    marginTop: "80px",
    position: "relative",
  },
  supBtn: {
    "&.MuiButton-root": {
      backgroundColor: "#4643D3",
      width: "260px",
      height: "50px",
      fontSize: "16px",
      fontWeight: "600",
      color: "white",
      marginBottom: "80px",
      borderRadius: "14px",
      "&:hover": {
        backgroundColor: "#4643D3",
      },
    },
  },
});
export default function ForYou() {
  const classes = useStyles();

  const [movies, setMovies] = useState([]);
  const [rmovies, setRMovies] = useState([]);
  const [nmovies, setNMovies] = useState([]);

  //userdetails
  const [user, setUser] = useState({});

  async function getImageURl(fetchURL) {
    const response = await fetch(fetchURL);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    return url;
  }

  async function setImageUrlRecommendation(recommendedList) {
    console.log(recommendedList);
    let response = "";
    let urlList = [];
    for (const movie of recommendedList) {
      console.log(movie);
      let urlJSON = {};
      let fetchAnimeDetails =
        "http://localhost:8080/show/" + movie.toString().trim();
      console.log(fetchAnimeDetails);
      response = await fetch(fetchAnimeDetails);
      const anime = await response.json();
      let imageList = anime.image_list;
      const images = imageList
        .substring(1, imageList.length - 1)
        .replace(/'/g, "")
        .split(",");

      let fetchAnimeImage =
        "http://localhost:8080/show/" +
        movie.toString().trim() +
        "/images/" +
        images[0].toString();
      console.log(fetchAnimeImage);
      let url = await getImageURl(fetchAnimeImage);

      urlJSON["id"] = movie.trim();
      urlJSON["link"] = url;
      urlList.push(urlJSON);
    }
    console.log(urlList);
    return urlList;
  }

  const getAnimeById = async (recommendationList) => {
    console.log(recommendationList);
    console.log("recommended");
    const recommended = await setImageUrlRecommendation(recommendationList);
    setRMovies(recommended);
  };

  const getUserById = async () => {
    try {
      let userId = sessionStorage.getItem("data");
      const user = await fetch(
        "http://localhost:8080/user/" + userId.toString()
      );
      const userDetails = await user.json();
      console.log(userDetails);
      setUser(userDetails);
      console.log(userDetails);
      sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
      getAnimeById(
        userDetails.recommended
          .substring(1, userDetails.recommended.length - 1)
          .replace(/"/g, "")
          .split(",")
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getUserById();
  }, []);

  async function setImageUrl(moviesList) {
    console.log(moviesList);
    let response = "";

    for (const movie of moviesList) {
      let fetchURL =
        "http://localhost:8080/show/" +
        movie["anime_id"].toString() +
        "/images/001.png";
      response = await fetch(fetchURL);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      movie.link = url;
    }
    //console.log(moviesList);

    return moviesList;
  }

  async function generateList(url) {
    const resp = await fetch(url);
    const movieList = await resp.json();
    let list = [];
    for (const [_, data] of movieList["results"].entries()) {
      list.push(data);
    }
    return list;
  }

  const getAnimes = async () => {
    try {
      const generalListURL =
        "http://localhost:8080/show?order_by=anime_id&random_list=true&page=1&page_size=10";
      const fetchGeneralList = await generateList(generalListURL);
      const listMovies1 = await setImageUrl(fetchGeneralList);
      setMovies(listMovies1);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getAnimes();
  }, []);

  const [show, setShow] = useState(false);
  const surpriseMe = async () => {
    const random = Math.floor(Math.random() * rmovies.length);
    const randomImage = rmovies[random];
    console.log(randomImage);
    setNMovies([randomImage]);
    setShow(true);
  };

  const dispatch = useDispatch();
  const selectClick = (e) => {
    window.name = e.target.alt;
    dispatch(modalActions.openModal("iii"));
  };

  return (
    <div>
      <div className={classes.images}>
        <Typography variant="h3" style={{ fontWeight: "600" }}>
          {" "}
          Your Most Preferred Genres
        </Typography>
        <ChartPart />
        {/* {movies.map(movie => (
            <img key={movie.anime_id} src={movie.link} alt={movie.anime_id} onClick={(e) => selectClick(e)} />
          ))} */}
      </div>
      <div className={classes.recentContent}>
        <Typography variant="h3" style={{ fontWeight: "600" }}>
          {" "}
          Your List
        </Typography>
        <div style={{ marginTop: "60px" }}>
          <Grid container justifyContent="space-around" alignItems=" center">
            <Carousel itemsToShow={4} style={{}}>
              {movies.map((movie) => (
                <div style={{ margin: "10px" }}>
                  <img
                    key={movie.anime_id}
                    src={movie.link}
                    alt={movie.anime_id}
                    onClick={(e) => selectClick(e)}
                  />
                </div>
              ))}
            </Carousel>
          </Grid>
        </div>
      </div>

      <div className={classes.recentContent}>
        <Typography variant="h3" style={{ fontWeight: "600" }}>
          {" "}
          Recommended Shows for you
        </Typography>
        <div style={{ marginTop: "60px" }}>
          <Grid container justifyContent="space-around" alignItems=" center">
            <Carousel itemsToShow={4} style={{}}>
              {rmovies.map((movie) => (
                <div style={{ margin: "10px" }}>
                  <img
                    key={movie.id}
                    src={movie.link}
                    alt={movie.id}
                    onClick={(e) => selectClick(e)}
                  />
                </div>
              ))}
            </Carousel>
          </Grid>
        </div>
      </div>

      <div className={classes.recentContent}>
        <div style={{ marginTop: "100px" }}>
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Button className={classes.supBtn} onClick={surpriseMe}>
              Suprise Me
            </Button>

            <div style={{ display: show ? "block" : "none" }}>
              {nmovies.map((movie) => (
                <img
                  key={movie.id}
                  src={movie.link}
                  alt={movie.id}
                  onClick={(e) => selectClick(e)}
                />
              ))}
            </div>
          </Grid>
        </div>
      </div>
    </div>
  );
}
