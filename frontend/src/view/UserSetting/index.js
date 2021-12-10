import { Divider, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import MemeberShip from "./MemeberShip";
import PhoneDetails from "./PhoneDetails";
import Settings from "./Settings";

const useStyles = makeStyles({
  root: {
    marginTop: "60px",
    padding: "0px 40px 0px 40px",
  },
  fabBtn: {
    "&.MuiFab-root": {
      backgroundColor: "#4643D3",
      color: "white",
      fontSize: "18px",
      fontWeight: "800",
      width: "220px",
      "&:hover": {
        backgroundColor: "#4643D3",
      },
    },
  },
  tabBtn: {
    "&.MuiButton-root": {
      fontWeight: "800",
      width: "220px",
      color: "black",
      fontSize: "18px",
    },
  },
});

export default function UserSetting() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="h3">Account Settings</Typography>
      <Divider sx={{ mt: 4, mb: 4, border: "2px solid #000000" }} />
      <MemeberShip />
      <Divider sx={{ mt: 4, mb: 4, border: "2px solid #000000" }} />
      <PhoneDetails />
      <Divider sx={{ mt: 4, mb: 4, border: "2px solid #000000" }} />
      <Settings />
    </div>
  );
}
