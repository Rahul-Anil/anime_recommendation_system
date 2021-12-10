import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useDispatch } from "react-redux";
import * as modalActions from "../../store/actions";
import Carousel from 'react-elastic-carousel'

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
});

export default function Main() {
  const [movies, setMovies] = useState([]);
  const [rmovies, setRMovies] = useState([]);
  const [nmovies, setNMovies] = useState([]);

  async function generateList(url) {
    const resp = await fetch(url);
    const movieList = await resp.json();
    let list = [];
    for (const [_, data] of movieList["results"].entries()) {
      list.push(data);
    }
    return list;
  }
  async function setImageUrl(moviesList) {
    let response = "";

    for (const movie of moviesList) {
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
    //console.log(moviesList);

    return moviesList;
  }

  const getAnimes = async () => {
    try {
      const generalListURL =
        "http://localhost:8080/show?order_by=anime_id&random_list=true&page=1&page_size=10";
      const recentlyPlayedURL =
        "http://localhost:8080/show?order_by=anime_id&random_list=true&page=2&page_size=10";
      const newShowsURL =
        "http://localhost:8080/show?order_by=anime_id&random_list=true&page=3&page_size=10";

      const fetchGeneralList = await generateList(generalListURL);
      const listMovies1 = await setImageUrl(fetchGeneralList);
      setMovies(listMovies1);

      const fetchRPList = await generateList(recentlyPlayedURL);
      const listMovies2 = await setImageUrl(fetchRPList);
      setRMovies(listMovies2);

      const fetchNSList = await generateList(newShowsURL);
      const listMovies3 = await setImageUrl(fetchNSList);
      setNMovies(listMovies3);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getAnimes();
  }, []);

  const classes = useStyles();
  const dispatch = useDispatch();
  const selectClick = (e) => {
    window.name = e.target.alt;
    dispatch(modalActions.openModal("iii"));
  };
  return (
    <div>
      <Typography variant="h3" style={{ fontWeight: "600" }}>
        {" "}
        Latest Anime
      </Typography>
      <div className={classes.images}>
        <Grid container justifyContent="space-around" alignItems="center">
          <Carousel itemsToShow={4} style={{}}>
            {movies.map(movie => (
              <img key={movie.anime_id} src={movie.link} alt={movie.anime_id} onClick={selectClick} />
            ))}
          </Carousel>
          
        </Grid>
      </div>
      <div className={classes.recentContent}>
        <Typography variant="h3" style={{ fontWeight: "600" }}>
          {" "}
          Recently Played
        </Typography>
        <div style={{ marginTop: "60px" }}>
          <Grid container justifyContent="space-around" alignItems=" center">
            <Carousel itemsToShow={4} style={{}}>
              {rmovies.map((movie) => (
                <img
                  key={movie.anime_id}
                  src={movie.link}
                  alt={movie.anime_id}
                  onClick={(e) => selectClick(e)}
                />
              ))}
            </Carousel>
            
          </Grid>
        </div>
      </div>
      <div className={classes.recentContent}>
        <Typography variant="h3" style={{ fontWeight: "600" }}>
          {" "}
          New Shows
        </Typography>
        <div style={{ marginTop: "60px" }}>
          <Grid container justifyContent="space-around" alignItems=" center">
            <Carousel itemsToShow={4} style={{}}>
              {nmovies.map((movie) => (
                <img
                  key={movie.anime_id}
                  src={movie.link}
                  alt={movie.anime_id}
                  onClick={(e) => selectClick(e)}
                />
              ))}
            </Carousel>
            
          </Grid>
        </div>
      </div>
    </div>
  );
}
