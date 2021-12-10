import { Grid, CardActionArea } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import Summer from "../../assets/image/Summer.png";
import Crown from "../../assets/image/crown.jpg";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Background from "../../assets/image/tororo.jpeg";



export default function Index() {
    // http://localhost:8080/show?order_by=anime_id&page=1&page_size=150
    const genresList = ['action', 'adventure', 'cars', 'comedy', 'dementia', 'demons', 'drama', 'ecchi'
        , 'fantasy', 'game', 'harem', 'historical', 'horror', 'josei', 'kids', 'magic'
        , 'martialarts', 'mecha', 'military', 'music', 'mystery', 'police'
        , 'psychological', 'romance', 'samurai', 'school', 'sci-fi', 'seinen', 'shoujo'
        , 'shoujoai', 'shounen', 'shounenai', 'sliceoflife', 'space', 'sports'
        , 'supernatural', 'superpower', 'thriller', 'vampire'];

    const studiosList = ['A.C.G.T.', 'AIC', 'Asread', 'Bee Train', 'Bones', 'Daume', 'Digital Frontier',
        'Gainax', 'Gallop', 'Gonzo', 'Group TAC', 'Hal Film Maker', 'Imagin',
        'J.C.Staff', 'Kyoto Animation', 'Madhouse', 'Nakamura Production',
        'Nippon Animation', 'Nomad', 'OLM', 'Production I.G', 'Seven Arcs', 'Shaft',
        'Studio Comet', 'Studio Deen', 'Studio Fantasia', 'Studio Flag',
        'Studio Ghibli', 'Studio Hibari', 'Studio Live', 'Studio Matrix',
        'Studio Pierrot', 'Sunrise', 'TMS Entertainment', 'TNK',
        'Tatsunoko Production', 'Telecom Animation Film', 'Toei Animation',
        'Tokyo Movie Shinsha', 'Trans Arts', 'Xebec', 'Zexcs', 'feel.', 'ufotable']

    // function createData(name, calories, fat, carbs, protein) {
    //     return { name, calories, fat, carbs, protein };
    // }
    // const rows = [
    //     createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    //     createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    //     createData('Eclair', 262, 16.0, 24, 6.0),
    //     createData('Cupcake', 305, 3.7, 67, 4.3),
    //     createData('Gingerbread', 356, 16.0, 49, 3.9),
    // ];

    const [rows, setRows] = useState([]);
    const [nAnime, setNAnime] = useState(0);

    // const [dataSet, setDataset] = useState([]);
    // const [dataStudioSet, setStudioDataset] = useState([]);

    const [data, setData] = useState({ "labels": [], "datasets": [] });
    const [dataStudio, setDataStudio] = useState({ "labels": [], "datasets": [] });

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    const getAnimes = async () => {
        const resp = await fetch("http://localhost:8080/show?order_by=anime_id&page=1&page_size=150");
        const movieList = await resp.json();
        //console.log(movieList['results']);

        //number of movies -->KPI
        setNAnime(movieList['results'].length);

        //anime by genres
        const genresDict = {};

        for (var i = 0; i < movieList['results'].length; i++) {
            //console.log(typeof (movieList['results'][i]['genre']));
            let genre = movieList['results'][i]['genre'];
            genre = genre.replace('{', "").replace('}', '').replace(/'/g, '"');
            for (const g of JSON.parse(genre)) {
                //console.log();
                if (genresList.indexOf(g) !== -1) {
                    if (isNaN(genresDict[g])) {
                        genresDict[g] = 0 + 1;
                    } else {
                        genresDict[g] = genresDict[g] + 1;
                    }
                }
            }
        }
        console.log(genresDict);

        let dataSet = [];
        var keys = Object.keys(genresDict);
        keys.forEach(function (key) {
            dataSet.push(genresDict[key]);
        });

        // var r = () => Math.random() * 256 >> 0;
        // var color = `rgb(${r()}, ${r()}, ${r()})`;
        // var randomColor = Math.floor(Math.random() * 16777215).toString(16);

        var colors = [];
        for (var c = 0; c < 39; c++) {
            colors.push(getRandomColor());
        }
        // while (colors.length < 39) {
        //     do {
        //         var color = Math.floor((Math.random() * 1000000) + 1);
        //     } while (colors.indexOf(color) >= 0);
        //     colors.push("#" + ("000000" + color.toString(16)).slice(-6));
        // }
        // console.log(colors);

        const ds = [{
            label: ' Anime By Genre',
            data: dataSet,
            backgroundColor: colors,
            hoverOffset: 4,
            borderWidth: 1,
            borderColor: '#fff',
        }];

        setData({ labels: genresList, datasets: ds });

        //anime by studio
        const studioDict = {};

        //console.log(studiosList.length);
        for (var j = 0; j < movieList['results'].length; j++) {
            let studio = movieList['results'][j]['studios'];
            //studio = studio.replace('{', "").replace('}', '').replace(/'/g, '"');
            // for (const g of JSON.parse(genre)) {
            //     //console.log();
            if (studiosList.indexOf(studio) !== 1) {
                if (isNaN(studioDict[studio])) {
                    studioDict[studio] = 0 + 1;
                } else {
                    studioDict[studio] = studioDict[studio] + 1;
                }
            }
            //}
        }
        console.log(studioDict);

        let dataStudioSet = [];
        var skeys = Object.keys(studioDict);
        skeys.forEach(function (key) {
            dataStudioSet.push(studioDict[key]);
        });

        var studioColors = [];
        for (var c = 0; c < 44; c++) {
            studioColors.push(getRandomColor());
        }
        // while (studioColors.length < 44) {
        //     do {
        //         var studioColor = Math.floor((Math.random() * 1000000) + 1);
        //     } while (studioColors.indexOf(studioColor) >= 0);
        //     studioColors.push("#" + ("333333" + studioColor.toString(16)).slice(-6));
        // }
        // console.log(studioColors);

        const dSS = [{
            label: ' Anime By Studio',
            data: dataStudioSet,
            backgroundColor: studioColors,
            hoverOffset: 4,
            borderWidth: 1,
            borderColor: '#fff',
        }];

        setDataStudio({ labels: studiosList, datasets: dSS });

        //Top 10
        let movieRow = [];
        let values = []
        let name = "";
        let popularity = "";
        let watching = "";

        let movies = [];

        for (var i = 0; i < movieList['results'].length; i++) {
            let movie = { "name": "", "popularity": 0, "watching": 0 };
            name = movieList['results'][i]['name'];
            popularity = movieList['results'][i]['popularity'];
            watching = movieList['results'][i]['watching'];
            movie = { "name": name, "popularity": popularity, "watching": watching };
            movies.push(movie);
            values.push(popularity);
        }

        var topValues = values.sort((a, b) => b - a).slice(0, 10);
        console.log(topValues);

        for (const { name, popularity, watching } of movies) {
            if (topValues.indexOf(popularity) !== 1) {
                movieRow.push({ name, watching })
            }
        }

        console.log(movieRow);
        // const values = [1, 65, 8, 98, 689, 12, 33, 2, 3, 789];
        // var topValues = values.sort((a, b) => b - a).slice(0, 10);
        // console.log(topValues); // [789,689,98,65,33]

        setRows(movieRow.slice(0, 10).sort(function (a, b) { return b.watching - a.watching }));
        movieRow = [];
        dataSet = [];
        dataStudioSet = [];
        colors = [];
        studioColors = [];
        values = [];
        movies = [];


    }

    console.log(data);
    console.log(dataStudio);



    useEffect(() => {
        getAnimes();
    }, []);


    return (
        <form style={{ margin: "60px", padding: "50px", backgroundColor: "white", overflow: "auto", height: "500px", width: "1000px",backgroundSize:"cover",backgroundImage: `url(${Background})`}}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Card>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                image={Summer}
                                alt="green iguana"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Total Animes
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {nAnime}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card >
                        <CardActionArea>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Anime By Genre
                                </Typography>
                                <Doughnut
                                    data={data}
                                    width={3}
                                    height={3}
                                />
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card >
                        <CardActionArea>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Anime By Studio
                                </Typography>
                                <Doughnut
                                    data={dataStudio}
                                    width={3}
                                    height={3}
                                />
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="1000px"
                                image={Crown}
                                alt="green iguana"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Top 10 Popular Animes
                                </Typography>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Anime Name</TableCell>
                                                <TableCell># of people watching</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.map((row) => (
                                                <TableRow
                                                    key={row.name}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {row.name}
                                                    </TableCell>
                                                    <TableCell>{row.watching}</TableCell>

                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>
        </form>
    )
}


