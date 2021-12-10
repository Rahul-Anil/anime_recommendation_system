//Custom Modal is used for Custom Popups in Various Pages

import React from "react";
import { makeStyles } from "@mui/styles";
import { Typography, Grid, TextField, Fab } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
const useStyles = makeStyles({
  root: {
    position: "relative",
    padding: "40px 50px",
  },
  close: {
    position: "absolute",
    top: "40px",
    right: "40px",
  },
});
export const CustomModal = (props) => {
  const { item } = props;
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.close}>
        <HighlightOffIcon
          onClick={props.handleClose}
          sx={{ cursor: "pointer" }}
        />
      </div>
      {item == "cancel" ? (
        <div style={{ textAlign: "center", padding: "10px 10px" }}>
          <Typography variant="h4" sx={{ mb: 8 }}>
            Are you sure you want to cancel the membership?{" "}
          </Typography>
          <Grid container justifyContent="space-around" alignItems="center">
            <Fab
              onClick={props.handleClose}
              variant="extended"
              sx={{ background: "#3ED598", width: 140, color: "white" }}
            >
              Yes
            </Fab>
            <Fab
              onClick={props.handleClose}
              variant="extended"
              sx={{ background: "#FF404B", width: 140, color: "white" }}
            >
              No
            </Fab>
          </Grid>
        </div>
      ) : (
        <div>
          <Typography variant="h4">Change {item}</Typography>
          <Grid container alignItems="center">
            <Grid item md={4}>
              <Typography sx={{ mt: 4 }} variant="body1">
                Currnet {item}
              </Typography>
            </Grid>
            <Grid item md={8}>
              <TextField variant="outlined" sx={{ mt: 4 }} fullWidth />
            </Grid>
            <Grid item md={4}>
              <Typography sx={{ mt: 4 }}>New {item}</Typography>
            </Grid>
            <Grid item md={8}>
              <TextField variant="outlined" sx={{ mt: 4 }} fullWidth />
            </Grid>
          </Grid>
          <Grid container justifyContent="center" alignItems="center">
            <Fab
              onClick={props.handleClose}
              variant="extended"
              sx={{ mt: 4, width: 160, textTransform: "capitalize" }}
              color="primary"
            >
              <Typography>Okay</Typography>
            </Fab>
          </Grid>
        </div>
      )}
    </div>
  );
};
