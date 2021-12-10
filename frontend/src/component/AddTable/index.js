import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  Grid,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
//import DatePicker from '@mui/lab/DatePicker';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";

const useStyle = makeStyles({
  root: {
    "& .MuiFormControl-root": {
      width: "80%",
      margin: "10px",
    },
  },
});

const initialValues = {
  name: "",
  score: 0,
  english_name: "",
  japanese_name: "",
  genre: [],
  sypnopsis: "",
  type: "",
  episodes: 0,
  premiered: "",
  producers: "",
  licensors: "",
  studios: "",
  source: "",
  duration: "",
  rating: "",
  ranked: 0,
  popularity: 0,
  members: 0,
  favorites: 0,
  watching: 0,
  completed: 0,
  on_hold: 0,
  dropped: 0,
  plan_to_watch: 0,
  score_info: {
    score_10: 0,
    score_9: 0,
    score_8: 0,
    score_7: 0,
    score_6: 0,
    score_5: 0,
    score_4: 0,
    score_3: 0,
    score_2: 0,
    score_1: 0,
  },
  aired_info: {
    aired_start_date_month: "",
    aired_start_date_year: 0,
    aired_end_date_month: "",
    aired_end_date_year: 0,
  },
};
// Genre List
const genresList = [
  "action",
  "adventure",
  "cars",
  "comedy",
  "dementia",
  "demons",
  "drama",
  "ecchi",
  "fantasy",
  "game",
  "harem",
  "historical",
  "horror",
  "josei",
  "kids",
  "magic",
  "martialarts",
  "mecha",
  "military",
  "music",
  "mystery",
  "police",
  "psychological",
  "romance",
  "samurai",
  "school",
  "sci-fi",
  "seinen",
  "shoujo",
  "shoujoai",
  "shounen",
  "shounenai",
  "sliceoflife",
  "space",
  "sports",
  "supernatural",
  "superpower",
  "thriller",
  "vampire",
];
// Studio List
const studiosList = [
  "A.C.G.T.",
  "AIC",
  "Asread",
  "Bee Train",
  "Bones",
  "Daume",
  "Digital Frontier",
  "Gainax",
  "Gallop",
  "Gonzo",
  "Group TAC",
  "Hal Film Maker",
  "Imagin",
  "J.C.Staff",
  "Kyoto Animation",
  "Madhouse",
  "Nakamura Production",
  "Nippon Animation",
  "Nomad",
  "OLM",
  "Production I.G",
  "Seven Arcs",
  "Shaft",
  "Studio Comet",
  "Studio Deen",
  "Studio Fantasia",
  "Studio Flag",
  "Studio Ghibli",
  "Studio Hibari",
  "Studio Live",
  "Studio Matrix",
  "Studio Pierrot",
  "Sunrise",
  "TMS Entertainment",
  "TNK",
  "Tatsunoko Production",
  "Telecom Animation Film",
  "Toei Animation",
  "Tokyo Movie Shinsha",
  "Trans Arts",
  "Xebec",
  "Zexcs",
  "feel.",
  "ufotable",
];

const premieredList = ["spring", "summer", "fall", "winter"];

const typeList = ["TV", "Movie", "OVA"];

const sourceList = [
  "Original",
  "Manga",
  "Light novel",
  "Game",
  "Visual novel",
  "4-koma manga",
  "Novel",
  "Other",
];
//List Of Months (1-12)
const months = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

let check = false;
let count = 0;

export default function Index() {
  console.log(sessionStorage.getItem("anime"));
  console.log(sessionStorage.getItem("currentPath"));
  // const [id, setId] = useState(0);
  // setId(sessionStorage.getItem('anime'));
  // console.log(id);
  if (sessionStorage.getItem("currentPath") === "/admin/updateAnime") {
    count += 1;
    console.log("CHECKED");
    check = true;
    sessionStorage.setItem("currentPath", "/admin/addAnime");
  } else {
    if (count === 0) {
      sessionStorage.setItem("currentPath", "/admin/updateAnime");
      console.log("notchecked");
      check = false;
    }
  }
  console.log(sessionStorage.getItem("currentPath"));
  console.log(check);

  const [name, setName] = useState("");
  const [score, setScore] = useState(0);
  const [englishName, setEnglishName] = useState("");
  const [japanesesName, setJapaneseName] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [episodes, setEpisodes] = useState(0);
  const [producers, setProducers] = useState("");
  const [licensors, setLicensors] = useState("");
  const [duration, setDuration] = useState("");
  const [rating, setRating] = useState("");
  const [ranked, setRanked] = useState(0);
  const [popularity, setPopularity] = useState(0);
  const [members, setMembers] = useState(0);
  const [favorites, setFavorites] = useState(0);
  const [watching, setWatching] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [on_hold, setOnhold] = useState(0);
  const [dropped, setDropped] = useState(0);
  const [plan_to_watch, setPTW] = useState(0);
  const [score_1, setScore_1] = useState(0);
  const [score_2, setScore_2] = useState(0);
  const [score_3, setScore_3] = useState(0);
  const [score_4, setScore_4] = useState(0);
  const [score_5, setScore_5] = useState(0);
  const [score_6, setScore_6] = useState(0);
  const [score_7, setScore_7] = useState(0);
  const [score_8, setScore_8] = useState(0);
  const [score_9, setScore_9] = useState(0);
  const [score_10, setScore_10] = useState(0);

  //startdate
  const [startDate, updateStartDate] = useState(new Date());
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState(0);

  const onSDChange = (date) => {
    let dateString = date.toString();
    updateStartDate(date);
    setStartMonth(dateString.substring(4, 7));
    let yearString = dateString.substring(11, 15);
    console.log(parseInt(yearString));
    setStartYear(parseInt(yearString));
  };

  //enddate
  const [endDate, updateEndDate] = useState(new Date());
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState(0);
  const onEDChange = (date) => {
    let dateString = date.toString();
    updateEndDate(date);
    setEndMonth(dateString.substring(4, 7));
    let yearString = dateString.substring(11, 15);
    setEndYear(parseInt(yearString));
  };

  //genre
  const [genres, setGenres] = React.useState([]);
  const [selectedGenres, setSelectedGenres] = React.useState(null);

  const handleGChange = (event) => {
    setGenres(event.target.value);
    setSelectedGenres(event.target.value);
  };

  const handleDelete = (chipToDelete) => () => {
    setSelectedGenres((chips) => chips.filter((chip) => chip !== chipToDelete));
    if (genres) {
      setGenres((chips) => chips.filter((chip) => chip !== chipToDelete));
    }
  };

  //studio
  const [studios, setStudios] = React.useState("");

  const handleSChange = (event) => {
    setStudios(event.target.value);
  };

  //premiered
  const [premiered, setPremiered] = React.useState("");

  const handlePChange = (event) => {
    setPremiered(event.target.value);
  };

  //type
  const [types, setType] = React.useState("");

  const handleTChange = (event) => {
    setType(event.target.value);
  };

  //source
  const [sources, setSources] = React.useState("");

  const handleSoChange = (event) => {
    setSources(event.target.value);
  };

  //Update animal model
  const [movie, setMovie] = useState([]);

  const getAnime = async (id) => {
    try {
      const resp = await fetch("http://localhost:8080/show/" + id.toString());
      const movieList = await resp.json();
      console.log(movieList);

      let scores = movieList.score_info;
      //console.log(scores);
      scores = scores.replace(/'/g, '"');
      const scoreJSON = JSON.parse(scores);
      //console.log(scoreJSON);

      let airedDate = movieList.aired_info;
      airedDate = airedDate.replace(/'/g, '"');
      const airedDateJSON = JSON.parse(airedDate);
      console.log(airedDateJSON);

      setMovie(movieList);
      setName(movieList.name);
      setScore(movieList.score);
      setEnglishName(movieList.english_name);
      setJapaneseName(movieList.japanese_name);
      setSelectedGenres(
        movieList.genre
          .substring(1, movieList.genre.length - 1)
          .replace(/"/g, "")
          .split(",")
      );
      setSynopsis(movieList.sypnopsis);
      setType(movieList.type);
      setEpisodes(movieList.episodes);
      setPremiered(movieList.premiered);
      setProducers(movieList.producers);
      setLicensors(movieList.licensors);
      setStudios(movieList.studios);
      setSources(movieList.source);
      setDuration(movieList.duration);
      setRating(movieList.rating);
      setRanked(movieList.ranked);
      setPopularity(movieList.popularity);
      setMembers(movieList.members);
      setFavorites(movieList.favorites);
      setWatching(movieList.watching);
      setCompleted(movieList.completed);
      setOnhold(movieList.on_hold);
      setDropped(movieList.dropped);
      setPTW(movieList.plan_to_watch);
      setScore_10(scoreJSON.score_10);
      setScore_9(scoreJSON.score_9);
      setScore_8(scoreJSON.score_8);
      setScore_7(scoreJSON.score_7);
      setScore_6(scoreJSON.score_6);
      setScore_5(scoreJSON.score_5);
      setScore_4(scoreJSON.score_4);
      setScore_3(scoreJSON.score_3);
      setScore_2(scoreJSON.score_2);
      setScore_1(scoreJSON.score_1);
      if (
        airedDateJSON.aired_start_date_year &&
        airedDateJSON.aired_start_date_month
      ) {
        updateStartDate(
          new Date(
            airedDateJSON.aired_start_date_year,
            months[airedDateJSON.aired_start_date_month]
          )
        );
      }
      if (
        airedDateJSON.aired_end_date_year &&
        airedDateJSON.aired_end_date_month
      ) {
        updateEndDate(
          new Date(
            airedDateJSON.aired_end_date_year,
            months[airedDateJSON.aired_end_date_month]
          )
        );
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const id = sessionStorage.getItem("anime");
  useEffect(() => {
    console.log(id !== 0 && id !== null && id !== undefined && check);
    if (id !== 0 && id !== null && id !== undefined && check) {
      console.log("IN");
      getAnime(id);
      //sessionStorage.removeItem('anime');
    }
  }, []);

  const classes = useStyle();

  const [anime, setAnime] = useState(initialValues);

  function reset() {
    setName("");
    setScore(0);
    setEnglishName("");
    setJapaneseName("");
    setSelectedGenres(null);
    setGenres([]);
    setSynopsis("");
    setEpisodes(0);
    setProducers("");
    setLicensors("");
    setDuration("");
    setRating("");
    setRanked(0);
    setPopularity(0);
    setMembers(0);
    setFavorites(0);
    setWatching(0);
    setCompleted(0);
    setOnhold(0);
    setDropped(0);
    setPTW(0);
    setScore_1(0);
    setScore_2(0);
    setScore_3(0);
    setScore_4(0);
    setScore_5(0);
    setScore_6(0);
    setScore_7(0);
    setScore_8(0);
    setScore_9(0);
    setScore_10(0);
    updateStartDate(new Date());
    updateEndDate(new Date());
    setStudios("");
    setSources("");
    setType("");
    setPremiered("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        anime_id: parseInt(id),
        name: name,
        score: score,
        english_name: englishName,
        japanese_name: japanesesName,
        genre: genres,
        sypnopsis: synopsis,
        type: types,
        episodes: parseInt(episodes),
        premiered: premiered,
        producers: producers,
        licensors: licensors,
        studios: studios,
        source: sources,
        duration: duration,
        rating: rating,
        ranked: ranked,
        popularity: popularity,
        members: members,
        favorites: favorites,
        watching: watching,
        completed: completed,
        on_hold: on_hold,
        dropped: dropped,
        plan_to_watch: plan_to_watch,
        score_info: {
          score_10: score_10,
          score_9: score_9,
          score_8: score_8,
          score_7: score_7,
          score_6: score_6,
          score_5: score_5,
          score_4: score_4,
          score_3: score_3,
          score_2: score_2,
          score_1: score_1,
        },
        aired_info: {
          aired_start_date_month: startMonth,
          aired_start_date_year: startYear,
          aired_end_date_month: endMonth,
          aired_end_date_year: endYear,
        },
      };
      if (id !== 0 && id !== null && id !== undefined && check) {
        let url = "http://localhost:8080/show/" + id.toString();
        const response = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }).then((response) => {
          if (response.status === 400) {
            console.log(JSON.stringify(body));
            alert(JSON.stringify(body));
          } else if (response.status === 200) {
            response.json().then((data) => {
              console.log(data);
              window.location = "/admin/updateAnime";
            });
          }
        });
      } else {
        const response = await fetch("http://localhost:8080/show", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }).then((response) => {
          if (response.status === 400) {
            alert("Oops");
          } else if (response.status === 200) {
            response.json().then((data) => {
              console.log(data["anime_id"]);
              window.location = "/admin/updateAnime";
            });
          }
        });
      }
    } catch (err) {
      console.log(err);
      console.error(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={classes.root}
      style={{
        margin: "60px",
        padding: "50px",
        backgroundColor: "white",
        overflow: "auto",
        height: "500px",
        width: "1000px",
      }}
    >
      <Grid container>
        <Grid item xs={6}>
          <TextField
            variant="outlined"
            label="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <TextField
            variant="outlined"
            label="Score"
            value={score}
            onChange={(e) => {
              setScore(e.target.value);
            }}
          />

          <TextField
            variant="outlined"
            label="English Name"
            value={englishName}
            onChange={(e) => {
              setEnglishName(e.target.value);
            }}
          />

          <TextField
            variant="outlined"
            label="Japanese Name"
            value={japanesesName}
            onChange={(e) => {
              setJapaneseName(e.target.value);
            }}
          />

          <TextField
            variant="outlined"
            label="Synopsis"
            value={synopsis}
            multiline
            onChange={(e) => {
              setSynopsis(e.target.value);
            }}
          />

          <TextField
            variant="outlined"
            label="Episodes"
            value={episodes}
            onChange={(e) => {
              setEpisodes(e.target.value);
            }}
          />

          <TextField
            variant="outlined"
            label="Producers"
            value={producers}
            onChange={(e) => {
              setProducers(e.target.value);
            }}
          />

          <TextField
            variant="outlined"
            label="Licensors"
            value={licensors}
            onChange={(e) => {
              setLicensors(e.target.value);
            }}
          />

          <TextField
            variant="outlined"
            label="Duration"
            value={duration}
            onChange={(e) => {
              setDuration(e.target.value);
            }}
          />

          <TextField
            variant="outlined"
            label="Rating"
            value={rating}
            onChange={(e) => {
              setRating(e.target.value);
            }}
          />

          <TextField
            variant="outlined"
            label="Ranked"
            value={ranked}
            onChange={(e) => {
              setRanked(e.target.value);
            }}
          />

          <TextField
            variant="outlined"
            label="Popularity"
            value={popularity}
            onChange={(e) => {
              setPopularity(e.target.value);
            }}
          />

          <TextField
            variant="outlined"
            label="Members"
            value={members}
            onChange={(e) => {
              setMembers(e.target.value);
            }}
          />

          <TextField
            variant="outlined"
            label="Favorites"
            value={favorites}
            onChange={(e) => {
              setFavorites(e.target.value);
            }}
          />

          <TextField
            variant="outlined"
            label="Watching"
            value={watching}
            onChange={(e) => {
              setWatching(e.target.value);
            }}
          />

          <TextField
            variant="outlined"
            label="Completed"
            value={completed}
            onChange={(e) => {
              setCompleted(e.target.value);
            }}
          />

          <TextField
            variant="outlined"
            label="Onhold"
            value={on_hold}
            onChange={(e) => {
              setOnhold(e.target.value);
            }}
          />
          <TextField
            variant="outlined"
            label="Dropped"
            value={dropped}
            onChange={(e) => {
              setDropped(e.target.value);
            }}
          />

          <TextField
            variant="outlined"
            label="PTW"
            value={plan_to_watch}
            onChange={(e) => {
              setPTW(e.target.value);
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            variant="outlined"
            label="Score 1"
            value={score_1}
            onChange={(e) => {
              setScore_1(e.target.value);
            }}
          />

          <TextField
            variant="outlined"
            label="Score 2"
            value={score_2}
            onChange={(e) => {
              setScore_2(e.target.value);
            }}
          />

          <TextField
            variant="outlined"
            label="Score 3"
            value={score_3}
            onChange={(e) => {
              setScore_3(e.target.value);
            }}
          />

          <TextField
            variant="outlined"
            label="Score 4"
            value={score_4}
            onChange={(e) => {
              setScore_4(e.target.value);
            }}
          />

          <TextField
            variant="outlined"
            label="Score 5"
            value={score_5}
            onChange={(e) => {
              setScore_5(e.target.value);
            }}
          />

          <TextField
            variant="outlined"
            label="Score 6"
            value={score_6}
            onChange={(e) => {
              setScore_6(e.target.value);
            }}
          />

          <TextField
            variant="outlined"
            label="Score 7"
            value={score_7}
            onChange={(e) => {
              setScore_7(e.target.value);
            }}
          />

          <TextField
            variant="outlined"
            label="Score 8"
            value={score_8}
            onChange={(e) => {
              setScore_8(e.target.value);
            }}
          />
          <TextField
            variant="outlined"
            label="Score 9"
            value={score_9}
            onChange={(e) => {
              setScore_9(e.target.value);
            }}
          />
          <TextField
            variant="outlined"
            label="Score 10"
            value={score_10}
            onChange={(e) => {
              setScore_10(e.target.value);
            }}
          />

          <br />
          <br />
          <label>
            <Typography>Aired Start Date</Typography>
          </label>

          <DatePicker
            selected={startDate}
            onChange={onSDChange}
            showMonthYearPicker
            dateFormat="yyyy MMM"
          />
          <br />
          <br />

          <label>
            <Typography>Aired End Date</Typography>
          </label>
          <DatePicker
            selected={endDate}
            onChange={onEDChange}
            showMonthYearPicker
            dateFormat="yyyy MMM"
          />

          <br />
          <br />
          <InputLabel>Genres</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            value={genres}
            label="Genres"
            onChange={handleGChange}
            fullWidth
            multiple
          >
            {genresList.map((genre) => {
              return <MenuItem value={genre}>{genre}</MenuItem>;
            })}
          </Select>
          {selectedGenres
            ? selectedGenres.map((item) => (
              <div>
                <br />
                <br />
                <Chip
                  label={item}
                  color="primary"
                  onDelete={handleDelete(item)}
                  sx={{ mx: 1 }}
                />
              </div>
            ))
            : null}

          <br />
          <br />
          <InputLabel>Studio</InputLabel>
          <Select
            value={studios}
            label="Studios"
            onChange={handleSChange}
            autoWidth
          >
            {studiosList.map((studio) => {
              return <MenuItem value={studio}>{studio}</MenuItem>;
            })}
          </Select>

          <br />
          <br />
          <InputLabel>Premiered</InputLabel>
          <Select
            value={premiered}
            label="Premiered In"
            onChange={handlePChange}
            autoWidth
          >
            {premieredList.map((p) => {
              return <MenuItem value={p}>{p}</MenuItem>;
            })}
          </Select>

          <br />
          <br />
          <InputLabel>Type</InputLabel>
          <Select value={types} label="Type" onChange={handleTChange} autoWidth>
            {typeList.map((t) => {
              return <MenuItem value={t}>{t}</MenuItem>;
            })}
          </Select>

          <br />
          <br />
          <InputLabel>Source</InputLabel>
          <Select
            value={sources}
            label="Source"
            onChange={handleSoChange}
            autoWidth
          >
            {sourceList.map((s) => {
              return <MenuItem value={s}>{s}</MenuItem>;
            })}
          </Select>
          <br />
          <br />
        </Grid>
      </Grid>
      <div style={{ textAlign: "right" }}>
        <Button style={{ margin: "10px" }} variant="contained" type="Submit">
          Submit
        </Button>
        <Button variant="outlined" onClick={reset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
