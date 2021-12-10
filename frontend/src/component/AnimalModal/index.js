import React, { useEffect, useRef, useState } from "react";
import {
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Rating,
  Select,
  Typography,
} from "@mui/material";
// import {
//   Chart,
//   ChartTooltip,
//   ChartSeries,
//   ChartSeriesItem,
//   ChartCategoryAxis,
//   ChartCategoryAxisItem,
//   ChartTitle,
//   ChartLegend,
//   ChartCategoryAxisTitle
// } from '@progress/kendo-react-charts';

// import "@progress/kendo-theme-material/dist/all.css";
// import 'hammerjs';
import { Line } from 'react-chartjs-2';
import { makeStyles } from "@mui/styles";
import CloseIcon from "@mui/icons-material/Close";
import animalImage from "../../assets/image/animalModal.png";
import * as modalActions from "../../store/actions";
import { useDispatch } from "react-redux";
import { COLORS } from "../../constants";




const useStyles = makeStyles({
  root: {
    padding: "94px 66px 40px 66px",
    width: "1099px",
    height: "742px",
    position: "relative",
  },
});

function useOutsideAlerter(ref) {
  const dispatch = useDispatch();
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        //alert("You clicked outside of me!");
        //const dispatch = useDispatch();
        
        dispatch(modalActions.closeModal());
        //modalActions.closeModal();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

export default function AnimalModal() {
  const categories = ["10", "9", "8", "7", "6", "5", "4", "3", "2", "1"];

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  const [movie, setMovie] = useState([]);
  const [sJ, setSJ] = useState([]);
  const [sL, setSL] = useState([]);

  // const renderTooltip = context => {
  //   const { category, value } = context.point || context;
  //   return (
  //     <div>
  //       {category}: {value}
  //     </div>
  //   );
  // };

  // labels = Utils.months({ count: 7 });
  const data = {
    labels: categories,
    datasets: [{
      label: 'No. of users',
      data: sL,
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const getAnime = async () => {
    try {
      const resp = await fetch('http://localhost:8080/show/' + window.name.toString());
      const movieList = await resp.json();
      let response = "";
      let fetchURL = "http://localhost:8080/show/" + movieList['anime_id'].toString() + "/images/001.png";
      response = await fetch(fetchURL);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      movieList.link = url;

      let scores = movieList.score_info;
      scores = scores.replace('{', "").replace('}', '').replace(/'/g, '"');
      const scoreList = scores.split(',');
      let newScoreList = [];
      for (const string of scoreList) {
        let str = "{" + string + "}";
        newScoreList.push(str);
      }
      const scoreJSON = [];
      const scoresList = [];

      for (const score of newScoreList) {
        const obj = JSON.parse(score);
        let oldKey = Object.keys(obj);
        //key[0] = key[0].replace(/[0-9]/g, '').replace('_',"");
        scoresList.push(obj[oldKey[0]]);
        obj['score'] = obj[oldKey[0]];
        delete obj[oldKey[0]];
        scoreJSON.push(obj)
      }
      setSJ(scoreJSON);
      setSL(scoresList);
      setMovie(movieList);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getAnime();
  }, []);

  const classes = useStyles();
  const dispatch = useDispatch();
  const [seasons, setSeasons] = useState();
  const [episodes, setEpisodes] = useState();
  const handleChange1 = (event) => {
    setSeasons(event.target.value);
  };
  const handleChange2 = (event) => {
    setEpisodes(event.target.value);
  };
  const handleClose = () => {
    dispatch(modalActions.closeModal());
  };
  const labelContent = e => e.category;
  return (
    <div ref={wrapperRef} className={classes.root}>
      <div style={{ position: "absolute", top: "30px", left: "30px" }}>
        <CloseIcon onClick={handleClose} />
      </div>
      <Typography style={{ fontSize: 24, fontWeight: 500 }}>
        {movie.name}
      </Typography>
      <Grid container justifyContent="space-between" sx={{ mb: 10, mt: 4 }}>
        <Grid item md={4}>
          {/* <img src={animalImage} alt="animalImage" /> */}
          <img id="movieResults" key={movie.anime_id} src={movie.link} alt={movie.name} />
        </Grid>
        <Grid item md={8} sx={{ pr: 20 }}>
          <div style={{ paddingLeft: "30px" }}>
            <Typography variant="h6" sx={{ mb: 4, fontSize: 20 }}>
              Synopsis
            </Typography>
            <Typography>
              {movie.sypnopsis}
            </Typography>
          </div>
          <Grid container justifyContent="space-between" sx={{ mt: 6 }}>
            <Grid item md={5}>
              <FormControl fullWidth>
                <InputLabel id="episodes">Episodes : {movie.episodes} </InputLabel>
                {/* <InputLabel id="seasons">seasons</InputLabel>
                <Select
                  defaultValue=""
                  onChange={handleChange1}
                  labelId="seasons"
                  label="seasons"
                  placeholder="seasons"
                  value={seasons}
                >
                  {[
                    { value: 1, title: "hello" },
                    { value: 2, title: "world" },
                    { value: 3, title: "good" },
                    { value: 4, title: "morning" },
                  ].map((item, index) => (
                    <MenuItem value={item.value} key={index}>
                      {item.title}
                    </MenuItem>
                  ))}
                </Select> */}
              </FormControl>
            </Grid>
            <Grid item md={5}>
              <FormControl fullWidth>

                <InputLabel id="studios">Studios : {movie.studios} </InputLabel>

                {/* <Select
                  defaultValue=""
                  onChange={handleChange2}
                  fullWidth
                  labelId="episodes"
                  label="episodes"
                  value={episodes}
                >
                  {[
                    { value: 1, title: "hello" },
                    { value: 2, title: "world" },
                    { value: 3, title: "good" },
                    { value: 4, title: "morning" },
                  ].map((item, index) => (
                    <MenuItem value={item.value} key={index}>
                      {item.title}
                    </MenuItem>
                  ))}
                </Select> */}
              </FormControl>
            </Grid>

          </Grid>
          <br /><br />
          <hr/>
          {/* <Grid>
            <Chart>
              <ChartTitle text="User Scores" />
              <ChartLegend visible={true} />
              <ChartTooltip render={renderTooltip} />
              <ChartCategoryAxis>
                <ChartCategoryAxisItem categories={categories} >
                  <ChartCategoryAxisTitle text="Scores" />
                </ChartCategoryAxisItem>
              </ChartCategoryAxis>
              <ChartSeries>
                <ChartSeriesItem type="line" data={sL} />
              </ChartSeries>
            </Chart>
          </Grid> */}
          <Grid>
            <Typography variant="h6" sx={{ mb: 4, fontSize: 20 }}>
              Earned Scores
            </Typography>
            <Line data={data} options={options} />
          </Grid>

        </Grid>
      </Grid>
      <div>
        <Grid container alignItems="center" sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: "20px", fontWeight: 700 }}>
            Ratings : {movie.rating}
          </Typography>

          {/* <Rating max={1} size="large" /> */}
        </Grid>
        <Typography variant="subtitle1">Rahul</Typography>
        <Typography sx={{ fontStyle: "italic", fontWeight: 100, fontSize: 14 }}>
          One of the best animes i have ever seen. A must watch for all naruto
          fans{" "}
        </Typography>
        <Rating value={4} size="small" />
        <Divider sx={{ border: "2px solid #DBDBDB", mt: 1, mb: 1 }} />
        <Typography variant="subtitle1">Akhil</Typography>
        <Typography sx={{ fontStyle: "italic", fontWeight: 100, fontSize: 14 }}>
          Must watch. Give it a 5 Star.{" "}
        </Typography>
        <Rating value={4} size="small" />
        <Divider sx={{ border: "2px solid #DBDBDB", mt: 1, mb: 1 }} />
      </div>
    </div>
  );
}
