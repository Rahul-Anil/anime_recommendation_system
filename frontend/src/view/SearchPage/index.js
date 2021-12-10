import React from "react";
import { makeStyles } from "@mui/styles";
import { Grid } from "@mui/material";
import middleImage from "../../assets/image/Green_Middle_Card.png";

const useStyles = makeStyles({
  root: {
    marginTop: "80px",
  },
  images: {
    marginTop: "80px",
  },
  recentContent: {
    marginTop: "80px",
  },
});
export default function SearchPage() {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.images}>
        <Grid container justifyContent="space-around" alignItems="center">
          <img src={middleImage} alt="small1" />
          <img src={middleImage} alt="small2" />
          <img src={middleImage} alt="small3" />
          <img src={middleImage} alt="small4" />
        </Grid>
      </div>
      <div className={classes.images}>
        <Grid container justifyContent="space-around" alignItems="center">
          <img src={middleImage} alt="small5" />
          <img src={middleImage} alt="small6" />
          <img src={middleImage} alt="small7" />
          <img src={middleImage} alt="small8" />
        </Grid>
      </div>
    </div>
  );
}
