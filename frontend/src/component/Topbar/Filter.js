import { Button, Grid, Menu, MenuItem } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ChevronRight } from "@mui/icons-material";
import { FilterContent } from "./FilterContent";
import { Genre_const, Studio_const, year_const } from "./filter_constant";
import { useDispatch } from "react-redux";
import * as Actions from "../../store/actions";

const defaultTheme = createTheme();

const theme = createTheme({
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "dashed" },
          style: {
            textTransform: "none",
            border: `1px dashed black`,
            color: "black",
            borderRadius: "16px",
            padding: "8px 32px",
          },
        },
        //   {
        //     props: { variant: "dashed", color: "secondary" },
        //     style: {
        //       border: `2px dashed ${defaultTheme.palette.secondary.main}`,
        //       color: defaultTheme.palette.secondary.main,
        //     },
        //   },
        //   {
        //     props: { variant: "dashed", size: "large" },
        //     style: {
        //       borderWidth: 4,
        //     },
        //   },
        //   {
        //     props: { variant: "dashed", color: "secondary", size: "large" },
        //     style: {
        //       fontSize: 18,
        //     },
        //   },
      ],
    },
  },
});

export const Filter = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [status, setStatus] = React.useState();
  const [year, setYear] = React.useState(0);
  const open = Boolean(anchorEl);
  const handleClick = (item) => (event) => {
    setStatus(item);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChange = (e) => {
    let prev = 0;
    if (year > 0) {
      console.log(year);
      prev = year;
    }
    if (e.target.value !== undefined) {
      console.log(e.target.value);
      dispatch(Actions.selectYear(e.target.value));
      sessionStorage.setItem('year', e.target.value);
      setYear(e.target.value);
      //year = e.target.value;
    } else {
      //year = prev;
      dispatch(Actions.selectYear(prev));
      setYear(prev);
    }

  }

  console.log(year);
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Grid container spacing={4}>
          <Grid item>
            {" "}
            <Button
              variant="dashed"
              onClick={handleClick("genre")}
              endIcon={<ChevronRight />}
            >
              Genre{" "}
            </Button>
          </Grid>
          <Grid item>
            {" "}
            <Button
              variant="dashed"
              endIcon={<ChevronRight />}
              onClick={handleClick("studio")}
            >
              Studio{" "}
            </Button>{" "}
          </Grid>
          <Grid item>
            {" "}
            <Button
              variant="dashed"
              endIcon={<ChevronRight />}
              onClick={handleClick("year")}
            >
              Year{" "}
            </Button>{" "}
          </Grid>
        </Grid>
        {status === "year" ? (
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleChange}
            //   sx={{ height: 500 }}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            PaperProps={{
              style: {
                maxHeight: 400,
                width: "20ch",
              },
            }}
          >
            <div >
              {year_const.map((item, index) => (
                <MenuItem value={item} key={index}>
                  {item}
                </MenuItem>
              ))}
            </div>
          </Menu>
        ) : (
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            //   sx={{ height: 500 }}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <FilterContent
              status={status}
              const={status === "genre" ? Genre_const : Studio_const}
              handleClose={handleClose}
            />
          </Menu>
        )}
      </ThemeProvider>
    </div>
  );
};
