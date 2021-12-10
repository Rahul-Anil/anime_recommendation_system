import React, { useState } from "react";
import { Button, Container, Dialog, Fab, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Main from "./Main";
import ForYou from "./ForYou";
import AnimalModal from "../../component/AnimalModal";
import { useSelector } from "react-redux";
const useStyles = makeStyles({
  root: {
    marginTop: "80px",
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

export default function MainPage() {
  const [tabStatus, setTabStatus] = useState("Home");
  const classes = useStyles();
  const open = useSelector(({ modal }) => modal.open);
  return (
    <div className={classes.root}>
      <Container>
        <Grid container justifyContent="center" alignItems="center">
          {tabStatus === "Home" ? (
            <Fab variant="extended" className={classes.fabBtn}>
              Home
            </Fab>
          ) : (
            <Button
              className={classes.tabBtn}
              onClick={() => setTabStatus("Home")}
            >
              {" "}
              Home
            </Button>
          )}
          {tabStatus === "forYou" ? (
            <Fab variant="extended" className={classes.fabBtn}>
              For You
            </Fab>
          ) : (
            <Button
              className={classes.tabBtn}
              onClick={() => setTabStatus("forYou")}
            >
              For You
            </Button>
          )}
        </Grid>
        <div>{tabStatus === "Home" && <Main />}</div>
        <div>{tabStatus === "forYou" && <ForYou />}</div>
      </Container>
      <Dialog
        open={open}
        maxWidth="1099px"
        PaperProps={{
          style: {
            borderRadius: 18,
          },
          backdropFilter: "blur(100px)",
        }}
      >
        <AnimalModal />
      </Dialog>
    </div>
  );
}
