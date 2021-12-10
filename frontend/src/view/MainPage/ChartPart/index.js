import { Grid } from "@mui/material";
import React from "react";
import ChartContent  from "./ChartContent/index";
import { ChartElements } from "./ChartElements";

export const ChartPart = () => {
  const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));

  return (
    <div>
      <Grid container spacing={8} alignItems="center">
        <Grid item md={6}>
          <ChartContent userDetails={userDetails} />
        </Grid>
        <Grid item md={6} container>
          <ChartElements userDetails={userDetails} />
        </Grid>
      </Grid>
    </div>
  );
};
